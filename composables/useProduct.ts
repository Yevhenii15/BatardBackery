import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface Product {
  _id: string;
  name: string;
  description: string;
  photo: string;
  price: number;
  categoryId: string;
  stock: number;
  dailyCapacity: number;
  active: boolean;
}

export type ProductInput = Omit<Product, "_id">;

const products = ref<Product[]>([]);
const product = ref<Product | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useProduct() {
  const api = useApiClient();

  const getProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
      products.value = await api<Product[]>("/api/product");
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch products";
    } finally {
      loading.value = false;
    }
  };

  const getProductById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      product.value = await api<Product>(`/api/product/${id}`);
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch product";
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (data: ProductInput) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await api<Product>("/api/product", {
        method: "POST",
        body: data,
      });

      products.value.push(created);
      alert("Product created successfully");
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to create product";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateProduct = async (id: string, data: ProductInput) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<Product>(`/api/product/${id}`, {
        method: "PUT",
        body: data,
      });

      const index = products.value.findIndex((p) => p._id === id);
      if (index !== -1) products.value[index] = updated;

      product.value = updated;
      alert("Product updated successfully");
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to update product";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api(`/api/product/${id}`, { method: "DELETE" });
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to delete product";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    products,
    product,
    loading,
    error,

    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
