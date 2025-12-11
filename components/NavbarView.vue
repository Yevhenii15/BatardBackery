<script setup>
import { onMounted } from "vue";
import { useCartPanel } from "~/composables/useCartPanel";
import { useCart } from "~/composables/useCart";
import { useContactInfo } from "~/composables/useContactInfo";

const { open } = useCartPanel();
const { items } = useCart();

// ⭐ Load contact info (including logo)
const { contactInfo, getContactInfo } = useContactInfo();

onMounted(() => {
  getContactInfo();
});
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo (clickable -> home) -->
      <NuxtLink to="/" class="navbar-logo" aria-label="Go to homepage">
        <!-- ⭐ Show ONLY the database logo (no fallback!) -->
        <img
          v-if="contactInfo?.logo"
          :src="contactInfo.logo"
          alt="Bakery Logo"
          class="navbar-logo-img"
        />
      </NuxtLink>

      <div class="bttn">
        <NuxtLink to="/find-booking" class="cart-btn">FIND MY BOOKING</NuxtLink>

        <!-- Cart icon -->
        <button
          class="cart-btn cart-wrapper"
          @click="open"
          aria-label="Open cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="cart-icon"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path
              d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
            />
          </svg>

          <!-- 🔴 Red dot -->
          <span v-if="items.length > 0" class="cart-dot"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* ====== Navbar Container ====== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #211a1a;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ====== Logo ====== */
.navbar-logo-img {
  height: 50px;
  width: auto;
}

.bttn {
  display: flex;
  gap: 40px;
}

/* ====== Cart Button ====== */
.cart-btn {
  background: transparent;
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  text-decoration: none;
  color: #ffffff;
  font-weight: 100;
}

.cart-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.cart-icon {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.cart-wrapper {
  position: relative;
}

/* 🔴 Notification dot */
.cart-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background-color: #ff3b30;
  border-radius: 50%;
  border: 2px solid #211a1a;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0.75rem 1.5rem;
  }

  .navbar-logo-img {
    height: 40px;
  }

  .cart-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
