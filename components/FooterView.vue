<script setup lang="ts">
import { onMounted } from "vue";
import { useContactInfo } from "~/composables/useContactInfo";
import { useRoute } from "vue-router";

const route = useRoute();

const { contactInfo, loading, error, getContactInfo } = useContactInfo();

interface MenuItem {
  name: string;
  path?: string;
  external?: string;
}

const menuItems: MenuItem[] = [
  { name: "Homepage", path: "/" },
  { name: "Order", path: "/products" },
  { name: "Se smiley (FVST)", external: "https://www.findsmiley.dk/1290487" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Return Policy", path: "/return-policy" },
];

const isActive = (item: MenuItem) => {
  if (item.external) return false;
  return route.path === item.path;
};

onMounted(() => {
  getContactInfo();
});
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <!-- LEFT COLUMN — LOGO + TEXT -->
      <div class="footer-left">
        <div class="footer-logo">
          <img
            v-if="contactInfo?.logoDark"
            class="footer-logo-img"
            :src="contactInfo.logoDark"
            alt="Company Logo"
          />
        </div>

        <p class="footer-description">
          <!-- You can later move this text to DB too if you want -->
          A sourdough bakery with delicious coffee, where <br />
          every detail has been carefully considered!
        </p>
      </div>

      <!-- MIDDLE COLUMN — MENU -->
      <div class="footer-center">
        <h3 class="footer-title">Menu</h3>
        <ul class="footer-menu">
          <li v-for="item in menuItems" :key="item.name">
            <!-- Internal pages -->
            <NuxtLink
              v-if="item.path"
              :to="item.path"
              class="footer-link"
              :class="{ active: isActive(item) }"
            >
              {{ item.name }}
            </NuxtLink>

            <!-- External link -->
            <a
              v-else-if="item.external"
              :href="item.external"
              class="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>

      <!-- RIGHT COLUMN — CONTACT -->
      <div class="footer-right">
        <h3 class="footer-title">Contact information</h3>

        <p>
          {{ contactInfo?.address }}
        </p>

        <p>
          Email: {{ contactInfo?.email }} <br />
          Tlf.: {{ contactInfo?.phone }} <br />
          CVR: {{ contactInfo?.cvr }}
        </p>

        <p>
          Opening hours: <br />
          {{ contactInfo?.openingHours }}
        </p>

        <p v-if="loading" style="margin-top: 1rem; color: #888">
          Loading contact info…
        </p>

        <p v-if="error" style="margin-top: 1rem; color: red">
          {{ error }}
        </p>
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div class="footer-bottom">
      <p>© 2025 All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style>
/* --- your existing CSS unchanged --- */
.footer {
  width: 100%;
  background: #ffffff;
  padding-top: 4rem;
  color: #1d2a3a;
  font-family: inherit;
}

/* TOP */
.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 3rem 4rem;
}
@media (min-width: 1200px) {
  .footer-top {
    width: 100%;
  }
}
/* LEFT */
.footer-left {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-logo {
  width: 260px;
  display: flex;
  margin-top: 40px;
}

.footer-logo img {
  width: 100%;
  height: auto;
}

.footer-description {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  line-height: 1.5;
}

/* CENTER */
.footer-center {
  flex: 1;
  text-align: center;
}

.footer-title {
  font-size: 1.9rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  font-size: 1.2rem;
  margin: 0.7rem 0;
}

/* links should look like the old text */
.footer-link {
  text-decoration: none;
  color: #1d2a3a;
  transition: color 0.25s ease, opacity 0.25s ease;
}

/* hover like before */
.footer-link:hover {
  color: #afc4d4;
  opacity: 0.8;
}

/* active item (current page) */
.footer-link.active {
  color: #5d7261; /* highlight color */
  font-weight: 600;
}
/* RIGHT */
.footer-right {
  flex: 1;
  text-align: center;
}

.footer-right p {
  font-size: 1.2rem;
  margin-top: 1rem;
  line-height: 1.6;
}

/* BOTTOM */
.footer-bottom {
  text-align: center;
  background: #707f78;
  color: white;
  padding: 0.8rem 0;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .footer-top {
    flex-direction: column;
    align-items: center;
    gap: 3.5rem;
    padding: 0 2rem 3rem;
  }

  .footer-logo {
    width: 200px;
  }

  .footer-description,
  .footer-right p,
  .footer-menu li {
    font-size: 1.1rem;
  }
}

@media (max-width: 600px) {
  .footer-logo {
    width: 170px;
  }

  .footer-title {
    font-size: 1.6rem;
  }
}
</style>
