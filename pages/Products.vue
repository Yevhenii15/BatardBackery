<template>
  <Navbar />
  <section class="order-of-products">
    <!-- BACK BUTTON  -->
    <button class="back-btn" @click="$router.push('/')">
      <svg viewBox="0 0 24 24" class="arrow-icon">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <!-- PAGE HEADER -->
    <section class="order-header">
      <h1 class="order-title">ORDER</h1>
      <p class="order-subtitle">Skip the line – pick up in the bakery</p>
    </section>

    <section class="products">
      <!-- Loading / error -->
      <div v-if="loading" class="text-center text-sm text-gray-600 mb-6">
        Loading products…
      </div>
      <div v-if="error" class="text-center text-sm text-red-600 mb-6">
        {{ error }}
      </div>

      <!-- Dynamic categories from DB -->
      <div
        v-for="section in sections"
        :key="section.category._id"
        class="category"
      >
        <h2 class="category-title">
          {{ section.category.categoryName }}
        </h2>

        <p class="category-times">
          Pick up times — (Weekdays:
          <strong>
            {{ section.category.weekdayTime.from }}
            –
            {{ section.category.weekdayTime.to }}
          </strong>
          <span class="dot-separator">•</span>
          Weekends:
          <strong>
            {{ section.category.weekendsTime.from }}
            –
            {{ section.category.weekendsTime.to }})
          </strong>
        </p>

        <div v-if="section.items.length" class="product-grid">
          <div
            v-for="item in section.items"
            :key="item._id"
            class="product-card"
            :class="{ 'sold-out': remainingForProduct(item) <= 0 }"
          >
            <div v-if="remainingForProduct(item) <= 0" class="sold-out-badge">
              OUT OF STOCK
            </div>

            <div class="product-image">
              <img
                :src="item.photo || '/img/placeholder.jpg'"
                :alt="item.name"
              />
            </div>

            <h3 class="product-name">{{ item.name }}</h3>

            <p class="product-price">{{ item.price.toFixed(2) }} DKK</p>

            <div class="product-actions">
              <!-- If this card is NOT currently selecting a quantity -->
              <template v-if="activeQtyProductId !== item._id">
                <NuxtLink class="product-btn" :to="`/product/${item._id}`">
                  View details
                </NuxtLink>

                <button
                  type="button"
                  class="product-btn"
                  :disabled="remainingForProduct(item) <= 0"
                  @click="openQtySelector(item)"
                >
                  {{
                    remainingForProduct(item) <= 0 ? "Sold out" : "Add to cart"
                  }}
                </button>
              </template>

              <!-- Quantity selector shown AFTER clicking Add to cart -->
              <template v-else>
                <div class="qty-wrapper">
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
                    :max="remainingForProduct(item)"
                  />

                  <button
                    type="button"
                    class="qty-btn"
                    @click="qty < remainingForProduct(item) && (qty = qty + 1)"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    class="product-btn confirm-btn"
                    @click="confirmAddToCart(item)"
                  >
                    Add {{ qty }} pcs
                  </button>

                  <button
                    type="button"
                    class="cancel-link"
                    @click="activeQtyProductId = null"
                  >
                    Cancel
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <p v-else class="text-sm text-gray-500 ml-4 mb-8">
          No products in this category yet.
        </p>
      </div>
    </section>
  </section>
  <FooterView />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCategory } from "~/composables/useCategory";
import { useProduct } from "~/composables/useProduct";
import { useCart } from "~/composables/useCart";
import FooterView from "~/components/FooterView.vue";
import Navbar from "~/components/NavbarView.vue";

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  getCategories,
} = useCategory();

const {
  products,
  loading: productsLoading,
  error: productsError,
  getProducts,
} = useProduct();

const { addItem, items } = useCart();

const loading = computed(
  () => categoriesLoading.value || productsLoading.value
);

const error = computed(() => categoriesError.value || productsError.value);

const sections = computed(() =>
  categories.value
    .map((cat) => ({
      category: cat,
      items: products.value.filter(
        (p) => p.categoryId === cat._id && p.active !== false
      ),
    }))
    .filter((section) => section.items.length > 0)
);


//  Quantity selector state
const activeQtyProductId = ref<string | null>(null);
const qty = ref(1);


const maxPerOrder = (p: any) => {
  const cap = typeof p.dailyCapacity === "number" ? p.dailyCapacity : Infinity;
  const stock = typeof p.stock === "number" ? p.stock : Infinity;
  const max = Math.min(cap, stock);
  return max === Infinity ? 99 : max;
};

const alreadyInCart = (p: any) => {
  if (!items?.value) return 0;
  const id = p._id;

  return items.value.reduce((sum: number, item: any) => {
    const itemProductId =
      item.product?._id || item.productId || item._id || item.id;
    const q = item.quantity ?? item.qty ?? 0;
    return itemProductId === id ? sum + q : sum;
  }, 0);
};

const remainingForProduct = (p: any) => {
  const baseMax = maxPerOrder(p);
  const used = alreadyInCart(p);
  const remaining = baseMax - used;
  return remaining > 0 ? remaining : 0;
};

const openQtySelector = (product: any) => {
  const remaining = remainingForProduct(product);
  if (remaining <= 0) return; 

  activeQtyProductId.value = product._id;
  qty.value = 1;
};

const confirmAddToCart = (product: any) => {
  const remaining = remainingForProduct(product);
  if (remaining <= 0) return;

  if (qty.value > remaining) qty.value = remaining;
  if (qty.value <= 0) return;

  addItem(product, qty.value);

  activeQtyProductId.value = null; 
};

onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});
</script>

<style scoped>
.order-of-products {
  position: relative;
  top: 80px;
  margin-bottom: 80px;
}

/* ===== BACK BUTTON ===== */
.back-btn {
  position: fixed;
  top: 100px; 
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100;
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #4f5c55;
  transform: scale(1.07);
}

.arrow-icon {
  width: 22px;
  height: 22px;
  color: white;
}

.order-header {
  text-align: center;
  background: #f4f4f4;
  padding: 3rem 2rem 2rem;
  margin: 0;
}

.order-title {
  font-size: 5rem;
  letter-spacing: 4px;
  color: #6f7d75;
  font-weight: 700;
  margin: 0;
  font-family: "Tungsten", "Arial Narrow", sans-serif;
}

.order-subtitle {
  font-size: 1.4rem;
  color: #333;
  margin-top: 1rem;
  font-weight: 600;
}

/* Page Wrapper */
.products {
  padding: 4rem 2rem;
  background: #f4f4f4;
}

/* Category Title */
.category-title {
  font-size: 3rem;
  margin-bottom: 0.4rem;
  margin-left: 1rem;
  color: #1d2a3a;
  font-weight: 700;
  letter-spacing: 2px;
}

.category-times {
  margin-left: 1.1rem;
  margin-bottom: 1.8rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.category-times strong {
  font-weight: 600;
}

.dot-separator {
  margin: 0 0.45rem;
  color: #9ca3af;
}

.product-grid {
  display: grid;
  gap: 2.5rem;
  padding: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Card */
.product-card {
  position: relative;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.product-card.sold-out::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25); 
  pointer-events: none;
  z-index: 1; 
}

.sold-out-badge {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 2;
  background: #b91c1c;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-image {
  width: 100%;
  height: 230px;
  border-radius: 12px;
  overflow: hidden;
  background: #d2d2d2;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-name {
  margin-top: 1rem;
  font-size: 1.4rem;
  color: #395153;
  font-weight: 700;
}

.product-price {
  margin: 0.4rem 0 1rem;
  font-size: 1.2rem;
  color: #333;
}

.product-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}

.product-btn {
  background: #6f7d75;
  color: white;
  border: none;
  padding: 0.7rem 1.6rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.25s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.product-btn:hover {
  background: #4f5c55;
  transform: scale(1.05);
}

/* Disabled button */
.product-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Qty selector */
.qty-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
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

.confirm-btn {
  padding-inline: 1.2rem;
}

.cancel-link {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  color: #6b7280;
  text-decoration: underline;
  cursor: pointer;
}


@media (max-width: 600px) {
  .products {
    padding: 2.5rem 1rem;
  }

  .category-title {
    font-size: 2rem;
    margin-left: 0.5rem;
  }

  .category-times {
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 0.5rem;
  }

  .product-card {
    padding: 1rem;
  }

  .product-image {
    height: 180px;
  }

  .product-name {
    font-size: 1.1rem;
  }

  .product-price {
    font-size: 1rem;
  }

  .product-btn {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
  .qty-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .qty-btn,
  .qty-input {
    margin-bottom: 0;
  }

  .qty-input {
    width: 46px;
    padding: 3px 4px;
    font-size: 0.9rem;
  }

  .confirm-btn {
    flex: 0 0 100%;
    margin-top: 4px;
    padding: 0.55rem 0.8rem;
    font-size: 0.9rem;
  }

  .cancel-link {
    flex: 0 0 100%;
    text-align: center;
    margin-top: 2px;
    font-size: 0.8rem;
  }
}

@media (max-width: 900px) {
  .order-title {
    font-size: 3.5rem;
  }

  .order-subtitle {
    font-size: 1.1rem;
  }
}
</style>
