<script setup lang="ts">
import { useCart } from "~/composables/useCart";
import { useCartPanel } from "~/composables/useCartPanel";

const { items, totalPrice, setQuantity, removeItem, clearCart } = useCart();
const { close } = useCartPanel();

// --- capacity helpers ---
const maxPerOrder = (item: any) => {
  const cap =
    typeof item.dailyCapacity === "number" ? item.dailyCapacity : Infinity;
  const stock = typeof item.stock === "number" ? item.stock : Infinity;
  return Math.min(cap, stock);
};

const isAtLimit = (item: any) => {
  const max = maxPerOrder(item);
  if (!Number.isFinite(max)) return false; // no limit, never at limit
  return item.quantity >= max;
};

// --- quantity controls ---
const decrease = (item: any) => {
  setQuantity(item.productId, item.quantity - 1);
};

const increase = (item: any) => {
  if (isAtLimit(item)) return; // block if already at limit
  setQuantity(item.productId, item.quantity + 1);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="true" class="cart-wrapper">
      <!-- Backdrop -->
      <div class="backdrop" @click="close"></div>

      <!-- Panel -->
      <section class="cart-panel">
        <header class="cart-header">
          <div>
            <h1>Your cart</h1>
            <p class="subtitle">Review your items before checkout.</p>
          </div>

          <button class="close-btn" @click="close">×</button>
        </header>

        <!-- Empty -->
        <div v-if="items.length === 0" class="empty-cart">
          <p>Your cart is empty.</p>
          <NuxtLink to="/products" class="primary-btn" @click="close">
            Browse products
          </NuxtLink>
        </div>

        <!-- Items -->
        <div v-else class="cart-content">
          <div class="items-list">
            <article
              v-for="item in items"
              :key="item.productId"
              class="cart-item"
            >
              <div class="thumb-wrap">
                <img
                  :src="item.photo || '/img/placeholder.jpg'"
                  :alt="item.name"
                  class="thumb"
                />
              </div>

              <div class="main-info">
                <h3 class="item-name">{{ item.name }}</h3>
                <p class="item-price">{{ item.price.toFixed(2) }} DKK</p>

                <div class="qty-row">
                  <div class="qty-controls">
                    <button type="button" @click="decrease(item)">−</button>
                    <span>{{ item.quantity }}</span>
                    <button
                      type="button"
                      @click="increase(item)"
                      :disabled="isAtLimit(item)"
                      :class="{ 'qty-plus-disabled': isAtLimit(item) }"
                    >
                      +
                    </button>
                  </div>

                  <p class="subtotal">
                    {{ (item.price * item.quantity).toFixed(2) }} DKK
                  </p>
                </div>
              </div>

              <button class="remove-btn" @click="removeItem(item.productId)">
                ✕
              </button>
            </article>
          </div>

          <!-- Footer -->
          <footer class="cart-footer">
            <div class="total-row">
              <span>Total</span>
              <strong>{{ totalPrice.toFixed(2) }} DKK</strong>
            </div>

            <div class="actions">
              <button class="secondary-btn" @click="clearCart">
                Clear cart
              </button>

              <NuxtLink to="/checkout" class="primary-btn" @click="close">
                Go to checkout →
              </NuxtLink>
            </div>
          </footer>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.cart-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

/* Background dim */
.backdrop {
  flex: 1;
  background: rgba(0, 0, 0, 0.02);
}

/* Panel */
.cart-panel {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
  padding: 2rem 2rem 2.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Header */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
}

.cart-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.subtitle {
  font-size: 0.95rem;
  color: #666;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 1.8rem;
  cursor: pointer;
  color: #888;
}

/* Empty */
.empty-cart {
  margin-top: 3rem;
  text-align: center;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Content */
.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.items-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.3rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.thumb-wrap {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f1f1;
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
}

.item-price {
  font-size: 0.9rem;
  color: #666;
}

.qty-row {
  display: flex;
  justify-content: space-between;
}

.qty-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 999px;
  padding: 0.1rem 0.35rem;
}

.qty-controls button {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  border: none;
  background: #6f7d75;
  color: white;
  cursor: pointer;
  font-size: 1rem;
}

/* 🔥 Disabled/limit style for + button */
.qty-controls button.qty-plus-disabled,
.qty-controls button:disabled {
  background: #b3b3b3;
  color: #f5f5f5;
  cursor: not-allowed;
}

.qty-controls span {
  min-width: 20px;
  text-align: center;
  font-size: 0.95rem;
}

.subtotal {
  font-weight: 600;
}

/* note when capacity reached */
.capacity-note {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #b91c1c;
}

.remove-btn {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  color: #b33;
  cursor: pointer;
}

/* Footer */
.cart-footer {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.primary-btn {
  background: #6f7d75;
  color: white;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
}

.primary-btn:hover {
  background: #4f5c55;
}

.secondary-btn {
  background: #f3f3f3;
  border: 1px solid #ddd;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
}
</style>
