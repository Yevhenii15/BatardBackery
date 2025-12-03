<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useHero } from "~/composables/useHero";

const { hero, loading, error, getHero } = useHero();

onMounted(() => {
  getHero();
});

// Direct bindings — no fallbacks
const title = computed(() => hero.value?.title || "");
const subTitle = computed(() => hero.value?.subTitle || "");
const leftImage = computed(() => hero.value?.heroImg1 || "");
const rightImage = computed(() => hero.value?.heroImg2 || "");
</script>

<template>
  <section class="hero">
    <!-- Background images -->
    <div
      class="hero-image hero-left"
      :style="{ backgroundImage: `url(${leftImage})` }"
    ></div>

    <div
      class="hero-image hero-right"
      :style="{ backgroundImage: `url(${rightImage})` }"
    ></div>

    <!-- Overlay Content -->
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-subtitle">{{ subTitle }}</p>

      <NuxtLink to="/products" class="hero-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="hero-btn-icon"
        >
          <path d="M6 6h15l-1.5 9h-13z" />
          <circle cx="9" cy="21" r="1" />
          <circle cx="18" cy="21" r="1" />
        </svg>
        BESTIL HER
      </NuxtLink>

      <p v-if="error" class="hero-error">{{ error }}</p>
    </div>
  </section>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.hero {
  position: relative;
  height: 100vh;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.hero-image {
  width: 50%;
  background-size: cover;
  background-position: center;
}

.hero-left {
  background-position: 20% 20%;
}

.hero-right {
  background-position: 20% 80%;
}

.hero-content {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.hero-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.9);
}

.hero-btn {
  background-color: #5d7261;
  color: white;
  padding: 0.9rem 1.8rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: 0.3s ease;
}

.hero-btn:hover {
  background-color: white;
  color: #5d7261;
  transform: scale(1.08);
}

.hero-btn-icon {
  width: 20px;
  height: 20px;
}

.hero-error {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #ffcccc;
}

/* Mobile */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    height: 100vh;
  }

  .hero-right {
    display: none;
  }

  .hero-left {
    width: 100%;
    height: 100%;
  }

  .hero-content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0%);
    width: 90%;
    max-width: 500px;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
