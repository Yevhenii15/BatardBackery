<template>
  <Navbar />
  <!-- BACK BUTTON -->
  <button class="back-btn" @click="router.back()">
    <svg viewBox="0 0 24 24" class="arrow-icon">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>

  <main class="find-page">
    <section class="find-container">
      <!-- PAGE HEADER (styled like ORDER page) -->
      <header class="find-header">
        <h1 class="find-title">FIND BOOKING</h1>
        <p class="find-subtitle">
          Enter your booking number and surname to view your booking summary.
        </p>
      </header>

      <!-- Form -->
      <form class="find-form" @submit.prevent="handleSearch">
        <div class="field">
          <label for="bookingNumber">Booking number</label>
          <input
            id="bookingNumber"
            v-model="bookingNumber"
            type="text"
            placeholder="e.g. B-20251204-FP5T"
            required
          />
        </div>

        <div class="field">
          <label for="lastName">Surname</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            placeholder="Your last name"
            required
          />
        </div>

        <p v-if="error" class="error-text">{{ error }}</p>

        <button class="primary-btn" type="submit" :disabled="loading">
          <span v-if="!loading">Find booking</span>
          <span v-else>Searching…</span>
        </button>
      </form>

      <!-- Result -->
      <div v-if="booking" class="result-wrapper">
        <CheckoutSuccessSummary :booking="booking" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Navbar from "~/components/NavbarView.vue";
import CheckoutSuccessSummary from "~/components/checkout/CheckoutSuccessSummary.vue";
import { useRouter } from "vue-router";
import { useBooking } from "~/composables/useBooking";

const router = useRouter();

// form fields
const bookingNumber = ref("");
const lastName = ref("");

// useBooking composable
const { booking, loading, error, lookupBooking } = useBooking();

const handleSearch = async () => {
  // clear previous result / error
  error.value = null;
  booking.value = null;

  const num = bookingNumber.value.trim();
  const last = lastName.value.trim();

  if (!num || !last) {
    error.value = "Please fill in both booking number and surname.";
    return;
  }

  await lookupBooking(num, last);
};
</script>

<style scoped>
.back-btn {
  position: fixed;
  top: 100px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  transition: 0.25s ease;
}

.back-btn:hover {
  background: #4f5c55;
  transform: scale(1.07);
}

.arrow-icon {
  width: 22px;
  height: 22px;
}

.find-page {
  height: 100vh;
  position: relative;
  top: 80px;
  min-height: calc(100vh - 80px);
  background: #f4f4f4;
}

.find-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

/* ===== HEADER (match ORDER page feeling) ===== */
.find-header {
  text-align: center;
  background: #f4f4f4;
  padding: 2.5rem 1rem 1.5rem;
  margin: 0 0 1rem;
}

.find-title {
  font-size: 5rem;
  letter-spacing: 4px;
  color: #6f7d75;
  font-weight: 700;
  margin: 0;
  font-family: "Tungsten", "Arial Narrow", sans-serif;
}

.find-subtitle {
  font-size: 1.4rem;
  color: #333;
  margin-top: 1rem;
  font-weight: 600;
}

/* ===== FORM & RESULT ===== */
.find-form {
  margin-top: 1.25rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  display: grid;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6b7280;
}

input {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
}

input:focus {
  outline: none;
  border-color: #6f7d75;
  box-shadow: 0 0 0 1px #6f7d75;
}

.primary-btn {
  margin-top: 0.5rem;
  background: #6f7d75;
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;
  align-self: flex-start;
}

.primary-btn[disabled] {
  opacity: 0.7;
  cursor: default;
}

.primary-btn:not([disabled]):hover {
  background: #4f5c55;
}

.error-text {
  color: #b3261e;
  font-size: 0.9rem;
}

.result-wrapper {
  margin-top: 2rem;
}
</style>
