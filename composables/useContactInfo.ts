import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  openingHours: string;
  cvr: string;
  logoLight: string;
  logoDark: string;
}

const contactInfo = ref<ContactInfo | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useContactInfo() {
  const api = useApiClient();

  const getContactInfo = async () => {
    loading.value = true;
    error.value = null;

    try {
      contactInfo.value = await api<ContactInfo>("/api/contact-info");
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch contact information";
    } finally {
      loading.value = false;
    }
  };

  const updateContactInfo = async (data: ContactInfo) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<ContactInfo>("/api/contact-info", {
        method: "PUT",
        body: data,
      });

      contactInfo.value = updated;
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.statusMessage ||
        "Failed to update contact information";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    contactInfo,
    loading,
    error,
    getContactInfo,
    updateContactInfo,
  };
}
