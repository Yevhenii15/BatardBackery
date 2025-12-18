<script setup lang="ts">
import type { PickupGroupState } from "~/composables/useCheckoutPickup";

// groups v-model
const groups = defineModel<PickupGroupState[]>("groups", {
  default: () => [],
});

// shared date v-model
const dateModel = defineModel<string>("date", {
  default: "",
});

const props = defineProps<{
  today: string;
  timeSlots: (group: PickupGroupState) => string[];
}>();
</script>

<template>
  <div class="card">
    <h2 class="card-title">Pickup time</h2>

    <p class="hint">
      Choose one pickup date for all products. Products with different rules
      will still get separate time slots for that date.
    </p>

    <!-- 🔹 Global date selector -->
    <div class="global-date-row">
      <div class="field">
        <label>Pickup date (applies to all pickup groups)</label>
        <input v-model="dateModel" type="date" :min="today" required />
        <p class="tiny-text">
          You cannot choose different days for different products.
        </p>
      </div>
    </div>

    <div v-for="(group, idx) in groups" :key="group.key" class="pickup-group">
      <header class="pickup-header">
        <h3>Pickup group {{ idx + 1 }}</h3>
        <p class="pickup-subtitle">
          Categories:
          <strong>{{ group.categoryNames }}</strong>
        </p>

        <!-- Products under category -->
        <div class="pickup-products">
          <span
            v-for="item in group.items"
            :key="item.productId"
            class="pickup-product-chip"
          >
            {{ item.name }} × {{ item.quantity }}
          </span>
        </div>
      </header>

      <div class="pickup-row">
        <!-- 🔹 Only time selector per group -->
        <div class="field">
          <label>Pickup time</label>
          <select
            v-model="group.timeSlot"
            :disabled="!dateModel || props.timeSlots(group).length === 0"
            required
          >
            <option value="" disabled>Select time</option>
            <option
              v-for="slot in props.timeSlots(group)"
              :key="slot"
              :value="slot"
            >
              {{ slot }}
            </option>
          </select>

          <p
            v-if="dateModel && props.timeSlots(group).length === 0"
            class="tiny-text"
          >
            No available times for this date. Please pick another day.
          </p>
        </div>
      </div>

      <div class="field">
        <label>Order notes (optional)</label>
        <textarea
          v-model="group.orderNotes"
          rows="2"
          placeholder="Allergies, special instructions..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  height: auto;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hint {
  font-size: 0.85rem;
  color: #777;
  margin-bottom: 0.75rem;
}

/* global date row */
.global-date-row {
  margin-bottom: 1rem;
}

.pickup-group {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
}

.pickup-header {
  margin-bottom: 0.7rem;
}

.pickup-header h3 {
  font-size: 1rem;
  font-weight: 600;
}

.pickup-subtitle {
  font-size: 0.85rem;
  color: #666;
}

/* products chips */
.pickup-products {
  margin-top: 0.35rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.pickup-product-chip {
  font-size: 0.8rem;
  background: #f4f4f4;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  border: 1px solid #e0e0e0;
  color: #444;
}

.pickup-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field label {
  font-size: 0.9rem;
  color: #444;
}

.field input,
.field select,
.field textarea {
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  width: 90%;
}
.field textarea {
  height: 30px;
}

.tiny-text {
  font-size: 0.75rem;
  color: #999;
}
</style>
