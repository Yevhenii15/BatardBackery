<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";
import { useContactInfo } from "~/composables/useContactInfo";

const router = useRouter();
const { login, loading, error } = useAuth();

// 🔹 Contact info composable
const { contactInfo, getContactInfo } = useContactInfo();

const form = ref({
  email: "",
  password: "",
});

// Load contact info (including logo) on mount
onMounted(async () => {
  await getContactInfo();
});

const onSubmit = async () => {
  const success = await login(form.value.email, form.value.password);
  if (success) router.push("/admin");
};
</script>

<template>
  <div class="admin-bg">
    <div class="login-window">
      <!-- Logo -->
      <div class="logo-container">
        <!-- Use logo from contact info if available -->
        <img
          v-if="contactInfo && contactInfo.logoLight"
          :src="contactInfo.logoLight"
          alt="Batard logo"
          class="logo-img"
        />
      </div>

      <h1 class="title">Welcome, Admin!</h1>

      <form @submit.prevent="onSubmit" class="form">
        <!-- Email -->
        <div class="field">
          <label class="label">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="input"
            placeholder="admin@example.com"
          />
        </div>

        <!-- Password -->
        <div class="field">
          <label class="label">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="input"
            placeholder="••••••••"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="error">{{ error }}</p>

        <!-- Button -->
        <button type="submit" :disabled="loading" class="btn">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Fullscreen background */
.admin-bg {
  min-height: 100vh;
  margin: 0;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #211a1a;
  box-sizing: border-box;
}

/* Main login box */
.login-window {
  width: 100%;
  max-width: 380px;
  background: #5d7261;
  padding: 2.5rem 2.25rem 2.3rem;
  border-radius: 18px;
  box-shadow: 0px 14px 35px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Logo container */
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
}

.logo-img {
  max-width: 260px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Title */
.title {
  text-align: center;
  color: #ffffff;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.4rem;
}

/* Form layout */
.form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.field {
  display: flex;
  flex-direction: column;
}

/* Labels */
.label {
  color: #e8e8e8;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

/* Inputs */
.input {
  width: 100%;
  padding: 11px 13px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #ffffff;
  color: #333;
  outline: none;
  transition: box-shadow 0.2s ease, transform 0.1s ease;
  box-sizing: border-box;
}

.input::placeholder {
  color: #a0a0a0;
}

.input:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
}

/* Error */
.error {
  color: #ffe0e0;
  background: rgba(255, 0, 0, 0.25);
  padding: 6px 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
}

/* Button */
.btn {
  margin-top: 0.5rem;
  width: 100%;
  padding: 12px;
  background: #ffffff;
  color: #5d7261;
  border: none;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.btn:hover:not(:disabled) {
  background: #f1f1f1;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  box-shadow: none;
}

/* Small screens */
@media (max-width: 480px) {
  .login-window {
    padding: 2rem 1.5rem 2rem;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>
