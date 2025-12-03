<template>
  <section
    class="booking-table"
    :class="{ 'booking-table--collapsed': collapsed }"
  >
    <!-- Header -->
    <header class="bt-header">
      <div class="bt-header-text">
        <h2 class="bt-title">{{ title }}</h2>
        <p class="bt-subtitle">{{ subtitle }}</p>
      </div>

      <div class="bt-header-right">
        <div v-if="loading" class="bt-loading">
          <span class="bt-dot"></span> Loading…
        </div>

        <!-- Collapse / expand button -->
        <button type="button" class="bt-toggle" @click="collapsed = !collapsed">
          <span>{{ collapsed ? "Show" : "Hide" }}</span>
          <span
            class="bt-toggle-icon"
            :class="{ 'bt-toggle-icon--collapsed': collapsed }"
          >
            ▾
          </span>
        </button>
      </div>
    </header>

    <!-- Body (only if not collapsed) -->
    <div v-if="!collapsed">
      <!-- Empty state -->
      <div v-if="!items.length && !loading" class="bt-empty">
        No bookings found.
      </div>

      <!-- Table -->
      <div v-else class="bt-table-wrapper">
        <table class="bt-table">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Pickups</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Archive</th>
              <th>Timestamps</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <BookingTableRow
              v-for="b in items"
              :key="b._id"
              :booking="b"
              @updateBooking="$emit('updateBooking', $event)"
              @delete="$emit('delete', $event)"
            />
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Booking } from "~/composables/useBooking";
import BookingTableRow from "./BookingTableRow.vue";

defineProps<{
  title: string;
  subtitle: string;
  items: Booking[];
  loading: boolean;
}>();

defineEmits<{
  (
    e: "updateBooking",
    payload: { id: string; status: Booking["status"]; archived: boolean }
  ): void;
  (e: "delete", id: string): void;
}>();

// local collapse state
const collapsed = ref(false);
</script>

<style scoped>
/* Header */
.bt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.bt-header-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.bt-title {
  font-size: 1.2rem;
  font-weight: 600;
  text-align: left;
}

.bt-subtitle {
  font-size: 0.75rem;
  color: #777;
}

.bt-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bt-loading {
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.bt-dot {
  width: 6px;
  height: 6px;
  background: #666;
  border-radius: 50%;
  animation: bt-pulse 1s infinite;
}

@keyframes bt-pulse {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

/* Toggle button */
.bt-toggle {
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

.bt-toggle:hover {
  background: #f3f4f6;
}

.bt-toggle-icon {
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.bt-toggle-icon--collapsed {
  transform: rotate(180deg);
}

/* Empty */
.bt-empty {
  margin-top: 1rem;
  padding: 1.5rem;
  text-align: center;
  border: 1px dashed #ccc;
  border-radius: 10px;
  background: #fafafa;
}

/* Table wrapper */
.bt-table-wrapper {
  margin-top: 1rem;
  overflow-x: auto;
}

.bt-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.bt-table thead th {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #888;
  padding: 4px 6px;
}
</style>
