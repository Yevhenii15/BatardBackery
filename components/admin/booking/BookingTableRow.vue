<script setup lang="ts">
import { ref, watch } from "vue";
import type { Booking } from "~/composables/useBooking";

const props = defineProps<{
  booking: Booking;
}>();

const emit = defineEmits<{
  (
    e: "updateBooking",
    payload: { id: string; status: Booking["status"]; archived: boolean }
  ): void;
  (e: "delete", id: string): void;
}>();

/* Local state */
const isEditing = ref(false);
const status = ref<Booking["status"]>(props.booking.status);
const archived = ref<boolean>(props.booking.archived);

/* Watch for parent changes (backend refresh) */
watch(
  () => props.booking,
  (b) => {
    status.value = b.status;
    archived.value = b.archived;
  }
);

/* Start editing row */
const startEdit = () => {
  isEditing.value = true;
  status.value = props.booking.status;
  archived.value = props.booking.archived;
};

/* Cancel editing */
const cancelEdit = () => {
  isEditing.value = false;
};

/* Save changes */
const saveEdit = () => {
  emit("updateBooking", {
    id: props.booking._id,
    status: status.value,
    archived: archived.value,
  });

  // Update the row immediately (no reload needed)
  props.booking.status = status.value;
  props.booking.archived = archived.value;

  isEditing.value = false;
};
</script>

<template>
  <tr class="bt-row">
    <!-- Booking -->
    <td class="cell">
      <div class="b-id">#{{ props.booking.bookingNumber }}</div>
      <div class="b-id-small">ID: {{ props.booking._id }}</div>
    </td>

    <!-- Customer -->
    <td class="cell">
      <div class="c-name">
        {{ props.booking.customer.firstName }}
        {{ props.booking.customer.lastName }}
      </div>
      <div class="c-info">{{ props.booking.customer.email }}</div>
      <div class="c-info">{{ props.booking.customer.phone }}</div>
    </td>

    <!-- Pickups -->
    <td class="cell">
      <ul class="pickup-list">
        <li
          v-for="(p, i) in props.booking.pickups"
          :key="i"
          class="pickup-item"
        >
          <div class="pickup-header">
            <span class="pickup-name">{{ p.categoryName }}</span>
            <span class="pickup-badge">#{{ i + 1 }}</span>
          </div>
          <div class="pickup-date">{{ p.date }} · {{ p.timeSlot }}</div>
        </li>
      </ul>
    </td>

    <!-- Items -->
    <td class="cell">
      <ul class="item-list">
        <li
          v-for="(item, idx) in props.booking.items"
          :key="idx"
          class="item-entry"
        >
          <div class="item-wrapper">
            <img v-if="item.photo" :src="item.photo" class="item-img" />
            <div v-else class="item-img empty">No img</div>

            <div class="item-info">
              <div class="item-name">{{ item.quantity }} × {{ item.name }}</div>
              <div class="item-meta">{{ item.price.toFixed(2) }} DKK each</div>
              <div class="item-meta">
                Subtotal: {{ item.subtotalPrice.toFixed(2) }} DKK
              </div>
            </div>
          </div>
        </li>
      </ul>
    </td>

    <!-- Total -->
    <td class="cell total">{{ props.booking.totalPrice.toFixed(2) }} DKK</td>

    <!-- Status -->
    <td class="cell">
      <!-- normal mode -->
      <template v-if="!isEditing">
        <span :class="['status-badge', props.booking.status]">
          {{ props.booking.status }}
        </span>
      </template>

      <!-- edit mode -->
      <template v-else>
        <select v-model="status" class="status-select">
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </template>
    </td>

    <!-- Archive -->
    <td class="cell">
      <template v-if="!isEditing">
        <span>{{ props.booking.archived ? "Yes" : "No" }}</span>
      </template>
      <template v-else>
        <input type="checkbox" v-model="archived" />
      </template>
    </td>

    <!-- Timestamps -->
    <td class="cell">
      <div class="ts-block">
        <span class="ts-label">Created </span>
        <span>{{ new Date(props.booking.createdAt).toLocaleString() }}</span>
      </div>
      <div class="ts-block">
        <span class="ts-label">Updated </span>
        <span>{{ new Date(props.booking.updatedAt).toLocaleString() }}</span>
      </div>
    </td>

    <!-- Actions -->
    <td class="cell actions">
      <!-- default -->
      <template v-if="!isEditing">
        <button class="btn" @click="startEdit">Edit</button>
        <button class="btn danger" @click="$emit('delete', props.booking._id)">
          Delete
        </button>
      </template>

      <!-- edit mode -->
      <template v-else>
        <button class="btn save" @click="saveEdit">Save</button>
        <button class="btn" @click="cancelEdit">Cancel</button>
      </template>
    </td>
  </tr>
</template>

<style scoped>
.bt-row {
  background: #f9fafb;
  border-radius: 10px;
}

.cell {
  padding: 10px;
  vertical-align: top;
}

/* Booking */
.b-id {
  font-weight: 600;
}

.b-id-small {
  font-size: 0.7rem;
  color: #999;
  word-break: break-all;
}

/* Customer */
.c-name {
  font-weight: 500;
}

.c-info {
  font-size: 0.75rem;
  color: #666;
}

/* Pickups */
.pickup-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pickup-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 6px 8px;
  border-radius: 8px;
}

.pickup-item + .pickup-item {
  margin-top: 0.4rem;
}

.pickup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pickup-name {
  font-weight: 500;
  font-size: 0.85rem;
}

.pickup-badge {
  background: #f3f4f6;
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 999px;
}

.pickup-date {
  font-size: 0.75rem;
  color: #555;
  margin-top: 0.15rem;
}

.pickup-small {
  font-size: 0.65rem;
  color: #999;
}

.pickup-notes {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
  margin-top: 0.15rem;
}

/* Items */
.item-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item-entry + .item-entry {
  margin-top: 0.4rem;
}

.item-wrapper {
  display: flex;
  gap: 8px;
}

.item-img {
  width: 42px;
  height: 42px;
  border-radius: 6px;
  border: 1px solid #ddd;
  object-fit: cover;
  background: #f8f8f8;
}

.item-img.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 0.65rem;
}

.item-info {
  font-size: 0.8rem;
}

.item-name {
  font-weight: 500;
}

.item-meta {
  font-size: 0.75rem;
  color: #666;
}

/* Total */
.total {
  font-weight: 600;
}

/* Status select + archive */
.status-select {
  border-radius: 999px;
  border: 1px solid #d1d5db;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  background: #f9fafb;
  outline: none;
}

.arch-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #374151;
}

.arch-toggle input {
  width: 14px;
  height: 14px;
}

.arch-small {
  margin-top: 0.25rem;
  font-size: 0.7rem;
  color: #9ca3af;
}

/* Timestamps */
.ts-block {
  font-size: 0.7rem;
  margin-bottom: 4px;
}

/* Actions */
.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.btn {
  padding: 5px 10px;
  font-size: 0.75rem;
  border-radius: 6px;
  border: 1px solid #999;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.btn:hover {
  background: #f0f0f0;
}

.btn.danger {
  border-color: #d33;
  color: #d33;
}

.btn.danger:hover {
  background: #ffecec;
}
/* Status badges */
.status-badge {
  padding: 2px 8px;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: capitalize;
  border: 1px solid transparent;
}

/* pending */
.status-badge.pending {
  background: #fff7db;
  color: #a07d00;
  border-color: #f0e2a0;
}

/* confirmed */
.status-badge.confirmed {
  background: #e8f9f1;
  color: #0f8f4f;
  border-color: #b5ead1;
}

/* completed */
.status-badge.completed {
  background: #e7f2ff;
  color: #1a6ecb;
  border-color: #bcd8ff;
}

/* cancelled */
.status-badge.cancelled {
  background: #ffecec;
  color: #c63b3b;
  border-color: #ffb6b6;
}
</style>
