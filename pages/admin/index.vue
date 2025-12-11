<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const router = useRouter();
const { logout } = useAuth();

const goTo = (path: string) => router.push(path);

const onLogout = async () => {
  await logout();
  router.push("/");
};
</script>

<template>
  <div class="admin-bg">
    <div class="admin-window">
      <!-- Header -->
      <header class="header">
        <div>
          <h1 class="title">Admin Panel</h1>
          <p class="subtitle">
            Manage content, products, categories and bookings.
          </p>
        </div>

        <button class="logout-btn" @click="onLogout">Logout</button>
      </header>

      <!-- GRID OF ACTIONS -->
      <section class="grid">
        <div class="card" @click="goTo('/admin/categories')">
          <h2 class="card-title">Categories</h2>
          <p class="card-desc">Manage product categories and pickup rules.</p>
          <span class="card-link">Go to categories →</span>
        </div>

        <div class="card" @click="goTo('/admin/products')">
          <h2 class="card-title">Products</h2>
          <p class="card-desc">Create and edit products, prices and images.</p>
          <span class="card-link">Go to products →</span>
        </div>

        <div class="card" @click="goTo('/admin/bookings')">
          <h2 class="card-title">Bookings</h2>
          <p class="card-desc">View and update customer bookings.</p>
          <span class="card-link">Go to bookings →</span>
        </div>

        <div class="card" @click="goTo('/admin/contact-info')">
          <h2 class="card-title">Contact Info</h2>
          <p class="card-desc">Edit opening hours, address and phone.</p>
          <span class="card-link">Go to contact →</span>
        </div>

        <div class="card" @click="goTo('/admin/company')">
          <h2 class="card-title">Company</h2>
          <p class="card-desc">Edit company details</p>
          <span class="card-link">Go to company →</span>
        </div>

        <div class="card" @click="goTo('/admin/contact')">
          <h2 class="card-title">Contact Messages</h2>
          <p class="card-desc">Manage all messages from form.</p>
          <span class="card-link">Go to contact messages →</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
}
/* Full background */
.admin-bg {
  background: #211a1a;
  min-height: 85vh;
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

/* Centered window */
.admin-window {
  width: 1100px;
  height: 100%;
  background: #5d7261;
  padding: 3rem;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  color: white;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.3rem;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  margin-top: 0.3rem;
  opacity: 0.9;
  font-size: 0.95rem;
}

/* Logout button */
.logout-btn {
  background: transparent;
  border: 2px solid white;
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
}

.logout-btn:hover {
  background: white;
  color: #5d7261;
}

/* Grid layout — 2 rows × 3 columns */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Cards */
.card {
  background: rgba(255, 255, 255, 0.15);
  padding: 2rem;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transition: 0.25s ease;
  display: flex;
  flex-direction: column;
  height: 130px;
}

.card:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.card-desc {
  font-size: 0.9rem;
  opacity: 0.95;
  line-height: 1.4;
  flex-grow: 1;
}

.card-link {
  margin-top: 1rem;
  font-size: 0.85rem;
  opacity: 0.9;
}
</style>
