import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface HeroSection {
  title: string;
  subTitle: string;
  heroImg1: string;
  heroImg2: string;
}

const hero = ref<HeroSection | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useHero() {
  const api = useApiClient();

  const getHero = async () => {
    loading.value = true;
    error.value = null;

    try {
      hero.value = await api<HeroSection>("/api/hero");
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch hero section";
    } finally {
      loading.value = false;
    }
  };

  const updateHero = async (data: HeroSection) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<HeroSection>("/api/hero", {
        method: "PUT",
        body: data,
      });

      hero.value = updated;
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        err?.statusMessage ||
        "Failed to update hero section";
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    hero,
    loading,
    error,
    getHero,
    updateHero,
  };
}
