<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCompany } from "~/composables/useCompany";

const { company, loading, error, getCompany } = useCompany();

onMounted(() => {
  getCompany();
});

const shortDescription = computed(() => company.value?.shortDescription || "");
const fullDescription = computed(() => company.value?.description || "");
</script>

<template>
  <section class="about">
    <div class="about-container">
      <h2 class="about-title">OM OS</h2>

      <!-- subtitle from DB -->
      <h3 class="about-subtitle">
        {{ shortDescription }}
      </h3>

      <div class="about-text">
        <!-- full text from DB -->
        <p>{{ fullDescription }}</p>

        <!-- static location (can also be moved to DB later if you want) -->
        <p class="about-location">Lokation: Batard Bakery Vejers Strand</p>

        <!-- optional: small error / loading -->
        <p v-if="loading" class="about-status">Henter tekst…</p>
        <p v-if="error" class="about-status error">{{ error }}</p>
      </div>
    </div>
  </section>
</template>

<style>
/* Background and layout */
.about {
  background-color: #211a1a;
  color: #fff;
  padding: 6rem 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
}

/* Headings */
.about-title {
  font-size: 3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.8rem;
}

.about-subtitle {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

/* Paragraphs */
.about-text p {
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1.8rem;
  color: #f2f2f2;
}

.about-location {
  margin-top: 2rem;
  font-style: italic;
  font-size: 1.1rem;
  color: #ddd;
}

/* Status messages */
.about-status {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #cccccc;
}

.about-status.error {
  color: #ffb3b3;
}

/* Responsive */
@media (max-width: 768px) {
  .about {
    padding: 4rem 1rem;
  }

  .about-title {
    font-size: 2.2rem;
  }

  .about-subtitle {
    font-size: 1rem;
  }

  .about-text p {
    font-size: 1rem;
  }
}
</style>
