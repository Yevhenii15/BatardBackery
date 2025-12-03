<template>
  <Navbar />

  <!-- BACK BUTTON -->
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" class="arrow-icon">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <!-- LOADING / ERROR -->
  <section v-if="loading" class="product-details">
    <p class="loading-text">Loading product…</p>
  </section>

  <section v-else-if="error" class="product-details">
    <p class="error-text">{{ error }}</p>
  </section>

  <!-- PRODUCT FOUND -->
  <section v-else-if="product" class="product-details">
    <div class="product-wrapper">
      <div class="info">
        <h1 class="title">{{ product.name }}</h1>

        <p class="description">
          {{ product.description || "Description will be added soon..." }}
        </p>

        <p class="price">{{ product.price.toFixed(2) }} DKK</p>

        <!-- Availability info -->
        <p class="availability" v-if="maxPerOrder > 0">
          Available today:
          <strong>{{ remaining }}</strong>
          / {{ maxPerOrder }}
        </p>
        <p class="availability sold" v-else>Out of stock for today</p>

        <!-- Pickup times for this product's category -->
        <p v-if="productCategory" class="pickup-times">
          <span class="pickup-line">
            <strong>Pickup (Mon–Fri):</strong>
            {{ weekdayTimesText || "No weekday pickup times configured" }}
          </span>
          <br />
          <span class="pickup-line">
            <strong>Pickup (Sat–Sun):</strong>
            {{ weekendTimesText || "No weekend pickup times configured" }}
          </span>
        </p>

        <!-- ACTIONS: Add to cart with quantity selector -->
        <div class="actions">
          <!-- Completely blocked -->
          <template v-if="remaining <= 0">
            <button class="add-to-cart-btn" type="button" disabled>
              Out of stock for today
            </button>
          </template>

          <!-- We still have some left -->
          <template v-else>
            <!-- Initial state: just button -->
            <button
              v-if="!showSelector"
              class="add-to-cart-btn"
              type="button"
              @click="openSelector"
            >
              Add to cart
            </button>

            <!-- After click: selector + confirm -->
            <div v-else class="qty-row">
              <button
                type="button"
                class="qty-btn"
                @click="qty > 1 && (qty = qty - 1)"
              >
                −
              </button>

              <input
                v-model.number="qty"
                type="number"
                class="qty-input"
                :min="1"
                :max="remaining"
              />

              <button
                type="button"
                class="qty-btn"
                @click="qty < remaining && (qty = qty + 1)"
              >
                +
              </button>

              <button
                type="button"
                class="add-to-cart-btn confirm"
                @click="confirmAddToCart"
              >
                Add {{ qty }} pcs
              </button>

              <button
                type="button"
                class="cancel-link"
                @click="showSelector = false"
              >
                Cancel
              </button>
            </div>
          </template>
        </div>
      </div>

      <div class="image-box">
        <img
          :src="product.photo || '/img/placeholder.jpg'"
          :alt="product.name"
        />
      </div>
    </div>
  </section>

  <!-- PRODUCT NOT FOUND -->
  <section v-else class="not-found">
    <h2>Product not found</h2>
    <NuxtLink to="/products" class="back-link"> Back to products </NuxtLink>
  </section>
  <FooterView />
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProduct } from "~/composables/useProduct";
import { useCart } from "~/composables/useCart";
import { useCategory } from "~/composables/useCategory";
import type { Category } from "~/composables/useCategory";
import FooterView from "~/components/FooterView.vue";
import Navbar from "~/components/NavbarView.vue";

const route = useRoute();
const router = useRouter();

const { product, loading, error, getProductById } = useProduct();
const { addItem, items } = useCart();

// 🔹 categories (for pickup times)
const { categories, getCategories } = useCategory();

// ===== Load product + categories =====
onMounted(async () => {
  const id = route.params.id as string;

  await Promise.all([
    getCategories(),
    id ? getProductById(id) : Promise.resolve(),
  ]);
});

// ===== Quantity + limits =====
const qty = ref(1);
const showSelector = ref(false);

// Base max allowed by product fields (dailyCapacity + stock)
const maxPerOrder = computed(() => {
  if (!product.value) return 0;
  const p: any = product.value;

  const cap =
    typeof p.dailyCapacity === "number"
      ? p.dailyCapacity
      : Number.POSITIVE_INFINITY;
  const stock =
    typeof p.stock === "number" ? p.stock : Number.POSITIVE_INFINITY;

  const max = Math.min(cap, stock);
  return max === Number.POSITIVE_INFINITY ? 99 : max; // fallback
});

// How many of this product are already in cart
const alreadyInCart = computed(() => {
  if (!product.value) return 0;
  const id = (product.value as any)._id;

  if (!items?.value) return 0;

  return items.value.reduce((sum: number, item: any) => {
    const itemProductId =
      item.product?._id || item.productId || item._id || item.id;
    const itemQty = item.quantity ?? item.qty ?? 0;
    return itemProductId === id ? sum + itemQty : sum;
  }, 0);
});

// Remaining we can still add
const remaining = computed(() => {
  const rem = maxPerOrder.value - alreadyInCart.value;
  return rem > 0 ? rem : 0;
});

// 🔹 Category of this product
const productCategory = computed<Category | null>(() => {
  if (!product.value) return null;
  return (
    categories.value.find((c) => c._id === product.value!.categoryId) || null
  );
});

// 🔹 Texts for pickup times
const weekdayTimesText = computed(() => {
  if (!productCategory.value) return "";
  const { weekdayTime } = productCategory.value;
  if (!weekdayTime?.from || !weekdayTime?.to) return "";
  return `${weekdayTime.from} – ${weekdayTime.to}`;
});

const weekendTimesText = computed(() => {
  if (!productCategory.value) return "";
  const { weekendsTime } = productCategory.value;
  if (!weekendsTime?.from || !weekendsTime?.to) return "";
  return `${weekendsTime.from} – ${weekendsTime.to}`;
});

// Open selector
const openSelector = () => {
  if (!product.value) return;
  if (remaining.value <= 0) return;
  qty.value = 1;
  showSelector.value = true;
};

// Confirm add to cart
const confirmAddToCart = () => {
  if (!product.value) return;
  if (remaining.value <= 0) return;

  if (qty.value > remaining.value) qty.value = remaining.value;
  if (qty.value <= 0) return;

  addItem(product.value, qty.value);
  showSelector.value = false;
};
</script>

<style scoped>
.back-btn {
  position: fixed;
  top: 100px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #4f5c55;
  transform: scale(1.07);
}

.arrow-icon {
  width: 22px;
  height: 22px;
}

/* Layout */
.product-details {
  padding: 6rem 2rem;
  background: #f4f4f4;
  min-height: 80vh;
}

.product-wrapper {
  position: relative;
  top: 80px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 3rem;
  align-items: center;
  flex-wrap: wrap;
}

.info {
  flex: 1 1 320px;
}

.image-box {
  flex: 1 1 320px;
  display: flex;
  justify-content: center;
}

.image-box img {
  width: 100%;
  max-width: 500px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 3rem;
  color: #6f7d75;
  margin-bottom: 1rem;
  font-weight: 700;
}

.description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  max-width: 560px;
}

.price {
  font-size: 1.6rem;
  margin-top: 1.5rem;
  font-weight: 600;
  color: #1d2a3a;
}

/* Availability text */
.availability {
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: #4b5563;
}

.availability strong {
  font-weight: 700;
}

.availability.sold {
  color: #b91c1c;
}

/* Actions */
.actions {
  margin-top: 1.5rem;
}

.add-to-cart-btn {
  padding: 0.8rem 1.8rem;
  border-radius: 6px;
  border: none;
  background: #6f7d75;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #4f5c55;
  transform: scale(1.03);
}

/* Disabled */
.add-to-cart-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Qty row */
.qty-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #6f7d75;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-input {
  width: 60px;
  text-align: center;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 4px 6px;
}

.add-to-cart-btn.confirm {
  padding-inline: 1.4rem;
}

.cancel-link {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: #6b7280;
  text-decoration: underline;
  cursor: pointer;
}

.loading-text,
.error-text {
  text-align: center;
  font-size: 1rem;
  margin-top: 5rem;
  color: #555;
}

.error-text {
  color: #c53030;
}

.not-found {
  padding: 6rem 2rem;
  text-align: center;
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.back-link {
  color: #6f7d75;
  text-decoration: underline;
  font-size: 0.95rem;
}
.pickup-times {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  color: #374151;
}

.pickup-line strong {
  font-weight: 600;
  color: #111827;
}
</style>
