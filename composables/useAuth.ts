
import { ref, computed } from "vue";
import { useApiClient } from "./useApiClient";

export interface AdminUser {
  _id: string;
  email: string;
}

const adminUser = ref<AdminUser | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const hasCheckedAuth = ref(false); 

export function useAuth() {
  const api = useApiClient();

  const isLoggedIn = computed(() => adminUser.value !== null);

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;

    try {
      
      const res = await api<{ token: string; user: AdminUser }>(
        "/api/auth/login",
        {
          method: "POST",
          body: { email, password },
        }
      );

      adminUser.value = res.user;
      return true;
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.statusMessage ||
        "Login failed. Please check your email and password.";
      error.value = msg;
      adminUser.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      await api<{ ok: boolean }>("/api/auth/logout", {
        method: "POST",
      });
      adminUser.value = null;
      return true;
    } catch (err: any) {
      const msg = err?.data?.message || err?.statusMessage || "Logout failed.";
      error.value = msg;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const checkAuth = async () => {

    if (hasCheckedAuth.value && adminUser.value) return;

    loading.value = true;
    error.value = null;

    try {
     
      const res = await api<{ user: AdminUser | null }>("/api/auth/me");
      adminUser.value = res.user;
    } catch (err: any) {
     
      adminUser.value = null;
    } finally {
      loading.value = false;
      hasCheckedAuth.value = true;
    }
  };

  return {
    
    adminUser,
    isLoggedIn,
    loading,
    error,
    hasCheckedAuth,

    
    login,
    logout,
    checkAuth,
  };
}
