<script setup lang="ts">
import { onMounted } from "vue";
import { useCompany } from "~/composables/useCompany";
import { useHero } from "~/composables/useHero";

import CompanyForm from "~/components/admin/company/CompanyForm.vue";
import HeroForm from "~/components/admin/company/HeroForm.vue";

const { company, loading, error, getCompany, updateCompany } = useCompany();
const {
  hero,
  loading: heroLoading,
  error: heroError,
  getHero,
  updateHero,
} = useHero();

onMounted(async () => {
  await Promise.all([getCompany(), getHero()]);
});

const handleCompanySubmit = async (payload: {
  shortDescription: string;
  description: string;
}) => {
  await updateCompany(payload);
};

const handleHeroSubmit = async (payload: HeroSection) => {
  await updateHero(payload);
};
</script>

<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">← </NuxtLink>
      </div>

      <h1 class="admin-title">Company information</h1>
      <p class="admin-subtitle">
        Edit the company descriptions and homepage hero section.
      </p>

      <div v-if="error && !company" class="alert-error">
        {{ error }}
      </div>

      <div class="admin-card">
        <CompanyForm
          :company="company"
          :loading="loading"
          :error="error"
          @submit="handleCompanySubmit"
        />
      </div>

      <div class="admin-card">
        <HeroForm
          :hero="hero"
          :loading="heroLoading"
          :error="heroError"
          @submit="handleHeroSubmit"
        />
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
  width: 90%;
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
  background: transparent;
  margin-bottom: 30px;
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
