<script setup lang="ts">
import Navbar from "~/components/NavbarView.vue";
import FooterView from "~/components/FooterView.vue";
</script>

<template>
  <div class="page-wrapper">
    <Navbar />

    <main class="policy-section">
      <!-- ===== BACK BUTTON ===== -->
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

      <!-- ===== CONTENT ===== -->
      <section class="policy-content">
        <div class="policy-card">
          <h1 class="card-title">Refund & Returns Policy</h1>
          <p class="card-intro">
            These terms outline the conditions for ordering, payment, returns,
            and complaints at Batard Bakery ApS.
          </p>

          <!-- PRODUCT INFORMATION -->
          <h2>1. Product Information</h2>
          <p>
            Details about each product can be found on www.batardbakery.dk.
            Additional information or questions can be sent to
            <a href="mailto:hello@batardbakery.dk">hello@batardbakery.dk</a>.
          </p>

          <!-- PRICES -->
          <h2>2. Prices</h2>
          <p>
            Prices may vary depending on when you place your order. Prices shown
            on the website are daily prices and may change regularly. If your
            order is accepted, the price valid on the order date will apply. All
            prices include VAT.
          </p>

          <!-- ORDERING -->
          <h2>3. Ordering</h2>
          <p>
            Product listings on the website are not binding offers. When placing
            an order, the customer submits an offer to purchase the product. A
            binding agreement only exists when the customer receives an order
            confirmation.
          </p>

          <!-- PAYMENT -->
          <h2>4. Payment</h2>
          <p>
            Your payment information is securely transferred to PBS using SSL
            encryption, ensuring that no unauthorized party can access your
            data. The amount is only charged once the order is shipped.
          </p>

          <!-- RISK TRANSFER -->
          <h2>5. Risk of Loss</h2>
          <p>
            The risk of accidental damage or loss passes to the customer once
            the product is in the customer's possession.
          </p>

          <!-- COMPLAINTS -->
          <h2>6. Complaints</h2>
          <p>
            For fresh products (such as bread or pastries), complaints must be
            submitted no later than the day after receiving the item. Otherwise,
            the right to complain is lost.
          </p>
          <p>
            For non-food items or packaged goods, complaints must be made within
            a reasonable time after receiving the product.
          </p>

          <!-- LIABILITY & WARRANTY -->
          <h2>7. Liability & Warranty</h2>
          <p>
            Batard Bakery ApS is not responsible for the content of external
            links. Descriptions from external websites are not part of the
            agreement between the seller and customer.
          </p>
          <p>
            The seller is not liable for delays or defects caused by conditions
            outside the seller’s control, including war, fire, government
            intervention, strikes, lockouts, or similar.
          </p>
          <p>
            Customers only receive warranties issued directly by the product
            manufacturer. Batard Bakery ApS does not provide independent
            warranties.
          </p>

          <!-- RIGHT OF WITHDRAWAL -->
          <h2>8. Right of Withdrawal</h2>
          <p>
            Customers may cancel their purchase within 14 days of delivery by
            notifying Batard Bakery. Returned goods must be shipped through Post
            Danmark to ensure traceability.
          </p>
          <p>
            Items returned without prepaid postage or via cash-on-delivery will
            be refused. Returned products must be securely packaged together
            with the invoice.
          </p>
          <p>
            The withdrawal right does not apply to items collected in-store or
            to business purchases.
          </p>

          <!-- REFUNDS -->
          <h2>9. Refunds</h2>
          <p>
            If the returned item is received in acceptable condition, the
            purchase amount will be refunded.
          </p>

          <!-- COMPANY INFO -->
          <h2>10. Company Information</h2>
          <p class="publisher">
            <strong>Batard Bakery ApS</strong><br />
            CVR: 43368532<br />
            Vejers Havvej 81B<br />
            6853 Vejers Strand<br />
            Phone: 42723278<br />
            Email: hello@batardbakery.dk
          </p>

          <!-- CHANGES -->
          <h2>11. Updates to Terms</h2>
          <p>
            Batard Bakery ApS reserves the right to update these terms. We
            recommend reviewing them regularly.
          </p>

          <!-- USEFUL LINKS -->
          <h2>12. Useful Links</h2>
          <p>
            PBS – www.pbs.dk<br />
            FDIH – www.fdih.dk<br />
            Danish Consumer Ombudsman – www.forbruger.dk
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

/* top layout */
.policy-section {
  width: 100%;
  margin-top: 80px;
  padding-bottom: 4rem;
}


.back-btn {
  position: fixed;
  top: 100px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #ffffff;
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
.back-btn:hover {
  background: #e8f0ec;
  transform: scale(1.07);
}
.arrow-icon {
  width: 22px;
  height: 22px;
  color: #6f7d75;
}

/* content box */
.policy-content {
  background: #707f78;
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
}
.policy-card {
  background: white;
  max-width: 850px;
  width: 100%;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.25);
  color: #231f20;
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
  font-size: 1rem;
  color: #333;
}
.policy-card a {
  color: #5d7261;
  text-decoration: underline;
}
.publisher {
  margin-top: 1rem;
  line-height: 1.7;
}

/* responsive */
@media (max-width: 900px) {
  .policy-content {
    padding: 2rem 1rem;
  }
  .policy-card {
    padding: 2rem 1.2rem;
  }
}
</style>
