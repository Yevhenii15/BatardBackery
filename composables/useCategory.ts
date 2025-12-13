import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface TimeRange {
  from: string; 
  to: string; 
}

export interface Category {
  _id: string;
  categoryName: string;
  weekdayTime: TimeRange;
  weekendsTime: TimeRange;
  slotSizeMinutes: number;
  leadTimeMinutes: number;
}

export type CategoryInput = Omit<Category, "_id">;

const categories = ref<Category[]>([]);
const category = ref<Category | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useCategory() {
  const api = useApiClient();

  const getCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      categories.value = await api<Category[]>("/api/category");
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch categories";
    } finally {
      loading.value = false;
    }
  };

  const getCategoryById = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      category.value = await api<Category>(`/api/category/${id}`);
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch category";
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async (data: CategoryInput) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await api<Category>("/api/category", {
        method: "POST",
        body: data,
      });
      categories.value.push(created);
      alert("Category created successfully.");
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to create category";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateCategory = async (id: string, data: CategoryInput) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<Category>(`/api/category/${id}`, {
        method: "PUT",
        body: data,
      });

      const index = categories.value.findIndex((c) => c._id === id);
      if (index !== -1) categories.value[index] = updated;
      category.value = updated;
      alert("Category updated successfully.");
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to update category";
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api(`/api/category/${id}`, { method: "DELETE" });
      categories.value = categories.value.filter((c) => c._id !== id);
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to delete category";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    categories,
    category,
    loading,
    error,

    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
