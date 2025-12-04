<script setup lang="ts">
import type { Booking } from "~/composables/useBooking";

const props = defineProps<{
  booking: Booking;
}>();

const goBackToProducts = () => {
  if (import.meta.client) {
    window.location.href = "/products";
  }
};
</script>

<template>
  <div class="success-box">
    <!-- HEADER -->
    <header class="success-header">
      <h2>Booking created</h2>

      <p class="success-intro">
        Thank you,
        <strong>{{ booking.customer.firstName }}</strong
        >. Your booking number is <strong>{{ booking.bookingNumber }}</strong
        >.
      </p>

      <p class="success-note">
        Below is a full summary of your booking, including customer details,
        pickup time(s), and all items.
      </p>
    </header>

    <!-- TOP ROW: CUSTOMER + PICKUP -->
    <div class="success-grid">
      <!-- Customer -->
      <section class="success-card">
        <h3>Customer</h3>
        <div class="card-body">
          <div class="line">
            <span class="label">Name</span>
            <span class="value">
              {{ booking.customer.firstName }} {{ booking.customer.lastName }}
            </span>
          </div>
          <div class="line">
            <span class="label">Phone</span>
            <span class="value">{{ booking.customer.phone }}</span>
          </div>
          <div class="line">
            <span class="label">Email</span>
            <span class="value">{{ booking.customer.email }}</span>
          </div>
        </div>
      </section>

      <!-- Pickup times -->
      <section class="success-card">
        <h3>Pickup time(s)</h3>

        <div class="card-body">
          <ul class="pickup-list">
            <li
              v-for="(p, idx) in booking.pickups"
              :key="idx"
              class="pickup-row"
            >
              <div class="pickup-badge">Pickup {{ idx + 1 }}</div>

              <div class="pickup-details">
                <span class="pickup-line">
                  {{ p.categoryName }} · {{ p.date }} · {{ p.timeSlot }}
                </span>

                <p v-if="p.orderNotes" class="pickup-notes">
                  Notes: {{ p.orderNotes }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- ITEMS FULL WIDTH -->
    <section class="success-card success-items">
      <h3>Items</h3>

      <div class="card-body card-body--no-padding-top">
        <table class="items-table">
          <thead>
            <tr>
              <th class="col-product">Product</th>
              <th class="col-pickup">Pickup</th>
              <th class="col-qty">Qty</th>
              <th class="col-price">Price</th>
              <th class="col-subtotal">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in booking.items" :key="item.productId">
              <td class="col-product">
                <div class="item-cell">
                  <img
                    v-if="item.photo"
                    :src="item.photo"
                    :alt="item.name"
                    class="item-thumb"
                  />
                  <div class="item-text">
                    <div class="item-name">{{ item.name }}</div>
                  </div>
                </div>
              </td>
              <td class="col-pickup">
                <span class="pill">Pickup {{ item.pickupIndex + 1 }}</span>
              </td>
              <td class="col-qty">
                {{ item.quantity }}
              </td>
              <td class="col-price">{{ item.price.toFixed(2) }} DKK</td>
              <td class="col-subtotal">
                {{ item.subtotalPrice.toFixed(2) }} DKK
              </td>
            </tr>
          </tbody>
        </table>

        <div class="success-total">
          <span>Total</span>
          <strong>{{ booking.totalPrice.toFixed(2) }} DKK</strong>
        </div>
      </div>
    </section>

    <!-- Back button -->
    <button class="primary-btn" @click="goBackToProducts">
      Back to products
    </button>
  </div>
</template>

<style scoped>
.success-box {
  max-width: 1050px;
  margin: 2.5rem auto 0;
  background: #ffffff;
  border-radius: 16px;
  padding: 1.8rem 2rem 2.4rem;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid #e7e7e7;
}

/* HEADER */
.success-header {
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.success-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: #2f2f2f;
}

.success-intro {
  font-size: 0.98rem;
  color: #444;
  margin: 0;
}

.success-note {
  font-size: 0.9rem;
  color: #777;
  margin-top: 0.4rem;
}

/* TOP ROW: 2 CARDS */
.success-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.3rem;
}

@media (max-width: 900px) {
  .success-box {
    padding: 1.5rem 1.25rem 2rem;
  }

  .success-grid {
    grid-template-columns: 1fr;
  }
}

/* CARDS */
.success-card {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 40%);
  display: flex;
  flex-direction: column;
}

.success-card h3 {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.7rem 0.9rem 0.5rem;
  border-bottom: 1px solid #ececec;
  margin: 0;
  color: #333;
}

.card-body {
  padding: 0.75rem 0.9rem 0.9rem;
}

.card-body--no-padding-top {
  padding-top: 0.4rem;
}

/* CUSTOMER LINES */
.line {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.label {
  color: #777;
}

.value {
  font-weight: 500;
  color: #222;
  text-align: right;
  word-break: break-word;
}

/* PICKUP LIST */
.pickup-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pickup-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid #eee;
}

.pickup-row:last-child {
  border-bottom: none;
}

/* badge: small circle label */
.pickup-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  border: 1px solid #d7d7d7;
  background: #ffffff;
  color: #555;
  white-space: nowrap;
}

/* full horizontal line */
.pickup-line {
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  display: block;
}

/* Notes */
.pickup-notes {
  margin-top: 2px;
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

/* ITEMS FULL WIDTH */
.success-items {
  background: #ffffff;
}

/* ITEMS TABLE */
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.2rem;
  font-size: 0.9rem;
}

.items-table th,
.items-table td {
  padding: 0.45rem 0.35rem;
  border-bottom: 1px solid #f0f0f0;
}

.items-table thead th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
  font-weight: 600;
}

.items-table tbody tr:last-child td {
  border-bottom: none;
}

.col-product {
  width: 40%;
  text-align: left;
}

.col-pickup {
  width: 15%;
  text-align: center;
}

.col-qty {
  width: 8%;
  text-align: center;
}

.col-price,
.col-subtotal {
  width: 18%;
  text-align: right;
}

.item-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-thumb {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  object-fit: cover;
  background: #f1f1f1;
}

.item-text .item-name {
  font-size: 0.9rem;
  color: #333;
}

/* PILL */
.pill {
  display: inline-flex;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  border: 1px solid #dedede;
  font-size: 0.78rem;
  color: #555;
  background: #fafafa;
}

/* TOTAL */
.success-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.7rem;
  font-size: 0.98rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.success-total span {
  color: #666;
}

/* BUTTON */
.primary-btn {
  margin-top: 1.6rem;
  background: #6f7d75;
  color: #fff;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.primary-btn:hover {
  background: #4f5c55;
}
</style>
