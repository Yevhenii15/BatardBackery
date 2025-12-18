<script setup lang="ts">
import type { BookingCustomer } from "~/composables/useBooking";

const customer = defineModel<BookingCustomer>("customer", {
  required: true,
});
</script>

<template>
  <div class="card">
    <h2 class="card-title">Customer details</h2>

    <form class="form-grid">
      <div class="field">
        <label>First name</label>
        <input v-model="customer.firstName" type="text" required />
      </div>
      <div class="field">
        <label>Last name</label>
        <input v-model="customer.lastName" type="text" required />
      </div>
      <div class="field">
        <label>Phone</label>
        <input v-model="customer.phone" type="tel" required />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="customer.email" type="email" required />
      </div>
    </form>
  </div>
</template>

<style scoped>
.card {
  height: auto;
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem 1.5rem;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field label {
  font-size: 0.9rem;
  color: #444;
}

.field input {
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  width: 90%;
}
</style>
