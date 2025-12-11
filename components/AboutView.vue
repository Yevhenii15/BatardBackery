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
/* Extra responsive improvements for smaller screens */
@media (max-width: 650px) {
  .about {
    padding: 5rem 3rem; /* more breathing room */
  }

  .about-container {
    padding: 0 0.5rem;
  }

  .about-title {
    font-size: 1.9rem;
    margin-bottom: 0.5rem;
  }

  .about-subtitle {
    font-size: 0.95rem;
    margin-bottom: 2rem;
    line-height: 1.4;
  }

  .about-text p {
    font-size: 0.95rem;
    margin-bottom: 1.6rem;
  }

  .about-location {
    margin-top: 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .about {
    padding: 4rem 2rem; /* smaller screens need tighter layout */
  }

  .about-title {
    font-size: 1.7rem;
    letter-spacing: 1px;
  }

  .about-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .about-text p {
    font-size: 0.9rem;
    line-height: 1.7;
  }

  .about-location {
    font-size: 0.95rem;
  }
}
</style>
