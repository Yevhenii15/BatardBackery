import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface Company {
  shortDescription: string;
  description: string;
}

const company = ref<Company | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useCompany() {
  const api = useApiClient();

  const getCompany = async () => {
    loading.value = true;
    error.value = null;

    try {
      company.value = await api<Company>("/api/company");
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch company info";
    } finally {
      loading.value = false;
    }
  };

  const updateCompany = async (data: Company) => {
    loading.value = true;
    error.value = null;

    try {
      company.value = await api<Company>("/api/company", {
        method: "PUT",
        body: data, 
      });
      alert("Company information updated successfully.");
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.statusMessage ||
        "Failed to update company info";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    company,
    loading,
    error,
    getCompany,
    updateCompany,
  };
}
