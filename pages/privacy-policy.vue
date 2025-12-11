<script setup lang="ts">
import Navbar from "~/components/NavbarView.vue";
import FooterView from "~/components/FooterView.vue";
</script>

<template>
  <div class="page-wrapper">
    <Navbar />

    <main class="policy-section">
      <!-- ===== BACK BUTTON (same style as Order page) ===== -->
      <button class="back-btn" @click="$router.push('/')">
        <svg viewBox="0 0 24 24" class="arrow-icon">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- FULL-WIDTH TEXT CARD -->
      <section class="policy-content">
        <div class="policy-card">
          <h1 class="card-title">Privacy Policy</h1>
          <p class="card-intro">
            This privacy and cookie policy explains how Batard Bakery ApS uses
            cookies and handles personal data when you visit our website.
          </p>

          <!-- INTRODUCTION -->
          <h2>1. Introduction</h2>
          <p>
            When you visit our website, information about you is collected. This
            information is used to adjust and improve our content and to make
            ads more relevant. If you do not want information to be collected,
            you should delete your cookies and stop using the website.
          </p>

          <!-- COOKIES -->
          <h2>2. Cookies</h2>
          <p>
            Our website uses cookies. Cookies are small text files stored on
            your device. They help remember settings, perform statistics, and
            show relevant content or ads.
          </p>
          <p>
            You can delete or block cookies. Guide:
            <a
              href="http://minecookies.org/cookiehandtering"
              target="_blank"
              rel="noopener noreferrer"
            >
              http://minecookies.org/cookiehandtering
            </a>
          </p>

          <!-- PERSONAL DATA -->
          <h2>3. Personal Data</h2>
          <p>
            Personal data includes information that can identify you. When you
            use our website, we collect data such as your IP address, device
            type, location, and pages you visit.
          </p>
          <p>
            If you enter information yourself, we may also process your name,
            phone number, email, address, and payment information.
          </p>

          <!-- SECURITY -->
          <h2>4. Security</h2>
          <p>
            We handle your data securely and confidentially according to GDPR
            and the Danish Data Protection Act. We only use your data for the
            purposes described in this policy.
          </p>

          <!-- PURPOSE -->
          <h2>5. Purpose of Processing</h2>
          <p>
            Your data is used to identify you, show relevant content, register
            purchases, send newsletters, and improve our services.
          </p>

          <!-- STORAGE -->
          <h2>6. Storage Period</h2>
          <p>
            We store your data only as long as necessary. The period depends on
            the type of information and the purpose.
          </p>

          <!-- DISCLOSURE -->
          <h2>7. Disclosure of Information</h2>
          <p>
            Information about your website usage may be shared with third
            parties for advertising and analytics purposes.
          </p>
          <p>
            We only use EU-based data processors or those providing adequate
            protection.
          </p>

          <!-- RIGHTS -->
          <h2>8. Your Rights</h2>
          <p>
            You may request insight, correction, deletion, or limitation of your
            data. You may also withdraw your consent at any time.
          </p>
          <p>
            Contact us at:
            <a href="mailto:hello@batardbakery.dk">hello@batardbakery.dk</a>
          </p>

          <!-- PUBLISHER -->
          <h2>9. Publisher</h2>
          <p class="publisher">
            <strong>Batard Bakery ApS</strong><br />
            Vejers Havvej 81B<br />
            6853 Vejers Strand<br />
            Phone: 42723278<br />
            Email: hello@batardbakery.dk
          </p>
        </div>
      </section>
    </main>

    <FooterView />
  </div>
</template>

<style scoped>
.page-wrapper {
  background: #ebeaea;
}

/* Layout top-down */
.policy-section {
  width: 100%;
  margin-top: 80px; /* navbar offset */
  padding-bottom: 4rem;
}

/* ===== BACK BUTTON (copied from Order page) ===== */
/* ===== BACK BUTTON (white version) ===== */
.back-btn {
  position: fixed;
  top: 100px; /* below navbar */
  left: 25px;
  width: 48px;
  height: 48px;
  background: #ffffff; /* WHITE background */
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1100;
  transition: 0.25s ease;
}

/* Hover effect: light green tint */
.back-btn:hover {
  background: #e8f0ec; /* subtle green tint */
  transform: scale(1.07);
}

/* Green arrow */
.arrow-icon {
  width: 22px;
  height: 22px;
  color: #6f7d75; /* match your brand green */
}

/* Content card section */
.policy-content {
  width: 100%;
  background: #707f78;
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
}

.policy-card {
  background: #ffffff;
  color: #231f20;
  width: 100%;
  max-width: 850px;
  padding: 2.5rem 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0px 14px 35px rgba(0, 0, 0, 0.25);
  line-height: 1.6;
}

.card-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.policy-card h2 {
  margin-top: 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
}

.policy-card p {
  margin-top: 0.6rem;
  font-size: 0.98rem;
  color: #333;
}

.policy-card a {
  color: #5d7261;
  text-decoration: underline;
}

.publisher {
  line-height: 1.7;
  margin-top: 1rem;
}

/* Mobile */
@media (max-width: 900px) {
  .policy-section {
    padding-bottom: 3rem;
  }

  .policy-content {
    padding: 2rem 1rem;
  }

  .policy-card {
    padding: 2rem 1.5rem 2.5rem;
  }
}
</style>
