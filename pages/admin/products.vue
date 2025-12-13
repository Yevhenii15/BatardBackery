<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import {
  useProduct,
  type Product,
  type ProductInput,
} from "~/composables/useProduct";
import { useCategory, type Category } from "~/composables/useCategory";

import AdminProductForm from "~/components/admin/product/ProductForm.vue";
import AdminProductTable from "~/components/admin/product/ProductTable.vue";

// composables
const {
  products,
  loading: productsLoading,
  error: productsError,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = useProduct();

const {
  categories,
  loading: categoriesLoading,
  error: categoriesError,
  getCategories,
} = useCategory();

const editingProduct = ref<Product | null>(null);

const formSection = ref<HTMLElement | null>(null);

const loading = computed(
  () => productsLoading.value || categoriesLoading.value
);

const error = computed(() => productsError.value || categoriesError.value);

const scrollToForm = () => {
  nextTick(() => {
    if (!formSection.value) return;

    const rect = formSection.value.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY - 80; // adjust for navbar height

    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  });
};

const scrollToProduct = (id: string) => {
  nextTick(() => {
    const el = document.getElementById(`product-${id}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
};

onMounted(async () => {
  await Promise.all([getCategories(), getProducts()]);
});

// when form is submitted
const handleSubmit = async (payload: ProductInput) => {
  if (editingProduct.value) {
    // UPDATE
    const id = editingProduct.value._id;
    const ok = await updateProduct(id, payload);
    if (!ok) return;

    // update list locally
    products.value = products.value.map((p) =>
      p._id === id ? { ...p, ...payload, _id: id } : p
    );

    editingProduct.value = null;

    // scroll to updated product
    scrollToProduct(id);
  } else {
    // CREATE
    const ok = await createProduct(payload);
    if (!ok) return;

    await getProducts();

    // find last product in that category
    const lastInCategory = [...products.value]
      .reverse()
      .find((p) => p.categoryId === payload.categoryId);

    if (lastInCategory?._id) {
      scrollToProduct(lastInCategory._id);
    }
  }
};

// when clicking "Edit" in cards
const handleEdit = (product: Product) => {
  editingProduct.value = product;
  scrollToForm(); // scroll up to the form again
};

// when clicking "Delete"

const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  const ok = await deleteProduct(id);
  if (!ok) return;

  products.value = products.value.filter((p) => p._id !== id);

  // Clear edit form if we were editing this one
  if (editingProduct.value?._id === id) {
    editingProduct.value = null;
  }
};

const handleCancelEdit = () => {
  editingProduct.value = null;
};
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">← </NuxtLink>
      </div>  
    <!-- Header -->
     <h1 class="admin-title">Products Managment</h1>
      <p class="admin-subtitle">
        Manage all products, their categories, images, prices and stock.
      </p>
    

      <div v-if="loading">Loading…</div>


    <!-- Error -->
    <p v-if="error">
      {{ error }}
    </p>

    <!-- Layout: form + table -->
    <div>
      <!-- Form -->
      <div ref="formSection">
        <AdminProductForm
          :key="editingProduct ? editingProduct._id : 'new'"
          :modelValue="editingProduct"
          :categories="categories as Category[]"
          @submit="handleSubmit"
          @cancelEdit="handleCancelEdit"
        />
      </div>

      <!-- Table -->
      <div class="xl:col-span-2">
        <AdminProductTable
          :products="products"
          :categories="categories"
          :loading="productsLoading"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>

.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.admin-container {
  background: #5d7261;
  width: 100%;
  max-width: 1100px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);
  text-align: center;
}

.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  font-size: 15px;
}

.admin-card {
  background: #6f8472;
  padding: 25px;
  border-radius: 14px;
  margin-bottom: 30px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.25);
}

.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>

