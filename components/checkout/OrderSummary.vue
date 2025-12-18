<script setup lang="ts">
import type { CartItem } from "~/composables/useCart";

const props = defineProps<{
  items: CartItem[];
  totalPrice: number;
  submitting: boolean;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();
</script>

<template>
  <div class="card">
    <h2 class="card-title">Order summary</h2>

    <ul class="summary-list">
      <li
        v-for="item in props.items"
        :key="item.productId"
        class="summary-item"
      >
        <!-- Thumbnail -->
        <img
          :src="item.photo || '/img/placeholder.jpg'"
          class="thumb"
          :alt="item.name"
        />

        <!-- Product info -->
        <div class="info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">{{ item.price.toFixed(2) }} DKK each</span>
        </div>

        <!-- Quantity -->
        <div class="qty">× {{ item.quantity }}</div>

        <!-- Subtotal -->
        <div class="subtotal">
          {{ (item.price * item.quantity).toFixed(2) }} DKK
        </div>
      </li>
    </ul>

    <div class="total-row">
      <span>Total</span>
      <strong>{{ props.totalPrice.toFixed(2) }} DKK</strong>
    </div>

    <button
      type="button"
      class="primary-btn w-full mt-3"
      :disabled="props.submitting"
      @click="emit('submit')"
    >
      {{ props.submitting ? "Creating booking..." : "Confirm booking" }}
    </button>
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

/* NEW layout for items */
.summary-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.summary-item {
  display: grid;
  grid-template-columns: 55px 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  border-bottom: 1px solid #eee;
}

/* Thumbnail */
.thumb {
  width: 55px;
  height: 55px;
  border-radius: 8px;
  object-fit: cover;
  background: #eee;
}

/* Info */
.info {
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.item-price {
  color: #777;
  font-size: 0.8rem;
}

/* Quantity */
.qty {
  font-size: 0.9rem;
  color: #333;
}

/* Subtotal */
.subtotal {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

/* button */
.primary-btn {
  background: #6f7d75;
  color: #fff;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 0.95rem;
  border-radius: 6px;
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

.primary-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.w-full {
  width: 100%;
}
</style>
