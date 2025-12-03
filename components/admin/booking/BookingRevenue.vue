<script setup lang="ts">
import { computed, ref } from "vue";
import type { Booking } from "~/composables/useBooking";

const props = defineProps<{
  bookings: Booking[];
}>();

// local collapse state (same idea as BookingTable)
const collapsed = ref(false);

// We treat all bookings that are NOT "cancelled" as revenue
const revenueBookings = computed(() =>
  props.bookings.filter((b) => b.status !== "cancelled")
);

const bookingTotal = (b: Booking): number => {
  if (!b.items || !Array.isArray(b.items)) return 0;

  return b.items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 1;
    return sum + price * qty;
  }, 0);
};

const totalOrders = computed(() => revenueBookings.value.length);

const totalRevenue = computed(() =>
  revenueBookings.value.reduce((sum, b) => sum + bookingTotal(b), 0)
);

const totalItemsSold = computed(() =>
  revenueBookings.value.reduce((sum, b) => {
    if (!b.items || !Array.isArray(b.items)) return sum;
    return (
      sum + b.items.reduce((inner, item) => inner + (item.quantity ?? 1), 0)
    );
  }, 0)
);

const averageOrderValue = computed(() =>
  totalOrders.value ? totalRevenue.value / totalOrders.value : 0
);

// ✅ Revenue by category using booking.pickups[pickupIndex].categoryName
const revenueByCategory = computed(() => {
  const map = new Map<string, { revenue: number; qty: number }>();

  for (const b of revenueBookings.value) {
    const items = b.items || [];
    const pickups = b.pickups || [];

    for (const item of items) {
      const pickup = pickups[item.pickupIndex];
      const catName = pickup?.categoryName || "Uncategorized";

      const price = typeof item.price === "number" ? item.price : 0;
      const qty = typeof item.quantity === "number" ? item.quantity : 1;

      const current = map.get(catName) ?? { revenue: 0, qty: 0 };
      current.revenue += price * qty;
      current.qty += qty;
      map.set(catName, current);
    }
  }

  return Array.from(map.entries()).sort((a, b) => b[1].revenue - a[1].revenue);
});

// Revenue by product
const revenueByProduct = computed(() => {
  const map = new Map<string, { revenue: number; qty: number }>();

  for (const b of revenueBookings.value) {
    const items = b.items || [];
    for (const item of items as any[]) {
      const name = item.name || "Unknown product";

      const price = typeof item.price === "number" ? item.price : 0;
      const qty = typeof item.quantity === "number" ? item.quantity : 1;

      const current = map.get(name) ?? { revenue: 0, qty: 0 };
      current.revenue += price * qty;
      current.qty += qty;
      map.set(name, current);
    }
  }

  return Array.from(map.entries()).sort((a, b) => b[1].revenue - a[1].revenue);
});

const formatCurrency = (value: number) => `${value.toFixed(2)} DKK`;
</script>

<template>
  <section class="revenue">
    <!-- Header (same idea as booking table) -->
    <header class="rev-header">
      <div class="rev-header-text">
        <h2 class="rev-title">Revenue overview</h2>
        <p class="rev-subtitle">
          Based on all non-cancelled bookings currently loaded.
        </p>
      </div>

      <div class="rev-header-right">
        <button
          type="button"
          class="rev-toggle"
          @click="collapsed = !collapsed"
        >
          <span>{{ collapsed ? "Show" : "Hide" }}</span>
          <span
            class="rev-toggle-icon"
            :class="{ 'rev-toggle-icon--collapsed': collapsed }"
          >
            ▾
          </span>
        </button>
      </div>
    </header>

    <!-- Body only when expanded -->
    <div v-if="!collapsed">
      <!-- Top summary cards -->
      <div class="rev-cards">
        <div class="rev-card">
          <span class="rev-label">Total revenue</span>
          <span class="rev-value">{{ formatCurrency(totalRevenue) }}</span>
        </div>

        <div class="rev-card">
          <span class="rev-label">Total orders</span>
          <span class="rev-value">{{ totalOrders }}</span>
        </div>

        <div class="rev-card">
          <span class="rev-label">Items sold</span>
          <span class="rev-value">{{ totalItemsSold }}</span>
        </div>

        <div class="rev-card">
          <span class="rev-label">Avg. order value</span>
          <span class="rev-value">{{ formatCurrency(averageOrderValue) }}</span>
        </div>
      </div>

      <!-- Tables -->
      <div class="rev-tables">
        <!-- By category -->
        <div class="rev-table-block">
          <h3 class="rev-table-title">Revenue by category</h3>
          <table class="rev-table" v-if="revenueByCategory.length">
            <thead>
              <tr>
                <th>Category</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Items sold</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[name, info] in revenueByCategory" :key="name">
                <td>{{ name }}</td>
                <td class="text-right">{{ formatCurrency(info.revenue) }}</td>
                <td class="text-right">{{ info.qty }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="rev-empty">No category data available.</p>
        </div>

        <!-- By product -->
        <div class="rev-table-block">
          <h3 class="rev-table-title">Top products</h3>
          <table class="rev-table" v-if="revenueByProduct.length">
            <thead>
              <tr>
                <th>Product</th>
                <th class="text-right">Revenue</th>
                <th class="text-right">Items sold</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[name, info] in revenueByProduct" :key="name">
                <td>{{ name }}</td>
                <td class="text-right">{{ formatCurrency(info.revenue) }}</td>
                <td class="text-right">{{ info.qty }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="rev-empty">No product data available.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Header layout like BookingTable */
.rev-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rev-header-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.rev-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rev-title {
  font-family: Georgia, serif;
  font-size: 20px;
  font-weight: bold;
  color: #111827;
  text-align: left;
}

.rev-subtitle {
  font-size: 13px;
  color: #4b5563;
}

/* Toggle button (same style idea as bt-toggle) */
.rev-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d4d4d4;
  background: #f9fafb;
  font-size: 0.75rem;
  cursor: pointer;
  color: #374151;
}

.rev-toggle:hover {
  background: #f3f4f6;
}

.rev-toggle-icon {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.rev-toggle-icon--collapsed {
  transform: rotate(180deg);
}

/* Summary cards */
.rev-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 900px) {
  .rev-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .rev-cards {
    grid-template-columns: 1fr;
  }
}

.rev-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.rev-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 4px;
}

.rev-value {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

/* Tables */
.rev-tables {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .rev-tables {
    grid-template-columns: 1fr;
  }
}

.rev-table-block {
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 12px 12px 8px;
}

.rev-table-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.rev-table {
  width: 100%;
  border-collapse: collapse;
}

.rev-table thead th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
  padding: 6px 4px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.rev-table tbody td {
  font-size: 13px;
  padding: 6px 4px;
  border-bottom: 1px solid #f3f4f6;
}

.rev-empty {
  font-size: 13px;
  color: #6b7280;
  margin-top: 6px;
}

.text-right {
  text-align: right;
}
</style>
