<template>
  <Navbar />

  <main class="checkout-page">
    <!-- Back button -->
    <button class="back-btn" @click="goBack">
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

    <section class="checkout-container">
      <header class="checkout-header">
        <h1>Checkout</h1>
        <p v-if="!success">Fill in your details and choose pickup time.</p>

        <p v-if="paymentStatus === 'success'" class="info-text">
          Stripe test payment completed successfully.
        </p>
        <p v-if="paymentStatus === 'cancelled'" class="info-text warning">
          You cancelled the Stripe payment. Your booking was not created.
        </p>
      </header>

      <!-- Everything that depends on localStorage/cart goes here -->
      <ClientOnly>
        <!-- Empty cart (only if no booking success) -->
        <div v-if="items.length === 0 && !success" class="empty-state">
          <p>Your cart is empty.</p>
          <NuxtLink to="/products" class="primary-btn">
            Go to products
          </NuxtLink>
        </div>

        <!-- SUCCESS (FULL SCREEN) -->
        <CheckoutSuccessSummary v-if="success && booking" :booking="booking" />

        <!-- MAIN CHECKOUT FORM -->
        <div v-if="items.length > 0 && !success" class="checkout-grid">
          <section class="left-column">
            <CustomerForm v-model:customer="customer" />
            <PickupGroupsForm
              v-model:groups="pickupGroups"
              v-model:date="pickupDate"
              :today="today"
              :timeSlots="timeSlots"
            />
          </section>

          <section class="right-column">
            <OrderSummary
              :items="items"
              :totalPrice="totalPrice"
              :submitting="submitting"
              @submit="handleSubmit"
            />
          </section>
        </div>
      </ClientOnly>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navbar from "~/components/NavbarView.vue";

import { useCart } from "~/composables/useCart";
import { useCategory } from "~/composables/useCategory";
import {
  useBooking,
  type BookingCustomer,
  type BookingItemInput,
  type BookingPickupInput,
  type BookingCreateInput,
} from "~/composables/useBooking";
import {
  useCheckoutPickup,
  type PickupGroupState,
} from "~/composables/useCheckoutPickup";

import CustomerForm from "../components/checkout/CustomerForm.vue";
import PickupGroupsForm from "../components/checkout/PickupGroupsForm.vue";
import OrderSummary from "../components/checkout/OrderSummary.vue";
import CheckoutSuccessSummary from "~/components/checkout/CheckoutSuccessSummary.vue";

const PENDING_BOOKING_KEY = "batard_pending_booking";

const route = useRoute();

const { items, totalPrice, clearCart, setQuantity, removeItem } = useCart();
const { categories, getCategories, loading: categoriesLoading } = useCategory();
const {
  createBooking,
  loading: bookingLoading,
  error: bookingError,
  booking,
  checkCapacity,
} = useBooking();

const { today, pickupDate, pickupGroups, timeSlots, rebuildPickupGroups } =
  useCheckoutPickup(items, categories);

const customer = reactive<BookingCustomer>({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
});

const formError = ref<string | null>(null);
const success = ref(false);

const submitting = computed(
  () => bookingLoading.value || categoriesLoading.value
);

// read ?payment=success / cancelled
const paymentStatus = computed<string | null>(() => {
  const q = route.query.payment;
  return typeof q === "string" ? q : null;
});

onMounted(async () => {
  await getCategories();
  rebuildPickupGroups();

  // If we just came back from Stripe with success -> finalize booking
  if (paymentStatus.value === "success") {
    await finalizeBookingFromStripe();
  }
});

const goBack = () => {
  if (import.meta.client) {
    window.location.href = "/products";
  }
};

/**
 * Build booking payload from current state.
 */
const buildBookingPayload = (): BookingCreateInput | null => {
  if (!pickupDate.value) return null;

  const pickups: BookingPickupInput[] = pickupGroups.value.map((group) => ({
    categoryId: group.categoryIds[0] ?? "",
    date: pickupDate.value!, // shared date
    timeSlot: group.timeSlot,
    orderNotes: group.orderNotes || "",
  }));

  const itemsPayload: BookingItemInput[] = [];
  pickupGroups.value.forEach((group, index) => {
    for (const item of group.items) {
      itemsPayload.push({
        productId: item.productId,
        quantity: item.quantity,
        pickupIndex: index,
      });
    }
  });

  return {
    customer: {
      firstName: customer.firstName.trim(),
      lastName: customer.lastName.trim(),
      phone: customer.phone.trim(),
      email: customer.email.trim(),
    },
    pickups,
    items: itemsPayload,
  };
};

/**
 * Main flow triggered from OrderSummary submit:
 * 1) validate form
 * 2) check capacity
 * 3) build booking payload
 * 4) store it in sessionStorage
 * 5) redirect to Stripe test checkout
 */
const handleSubmit = async () => {
  formError.value = null;

  if (!items.value.length) {
    formError.value = "Your cart is empty.";
    return;
  }

  if (
    !customer.firstName.trim() ||
    !customer.lastName.trim() ||
    !customer.phone.trim() ||
    !customer.email.trim()
  ) {
    formError.value = "Please fill in all customer details.";
    return;
  }

  if (!pickupDate.value) {
    formError.value = "Please select a pickup date.";
    return;
  }

  for (const group of pickupGroups.value) {
    if (!group.timeSlot) {
      formError.value = "Please select time for all pickup groups.";
      return;
    }
  }

  // ============================
  // CHECK CAPACITY FOR THE DAY
  // ============================
  const capacityResult = await checkCapacity(pickupDate.value, items.value);
  const byProduct = capacityResult?.byProduct || {};

  let adjusted = false;
  const messages: string[] = [];

  for (const item of [...items.value]) {
    const info = byProduct[item.productId];
    if (!info) continue;

    const remaining = info.remaining;

    if (item.quantity > remaining) {
      adjusted = true;

      if (remaining <= 0) {
        // nothing left → remove from cart
        removeItem(item.productId);
        messages.push(`${item.name}: no items left for ${pickupDate.value}.`);
      } else {
        // clamp to remaining
        const old = item.quantity;
        setQuantity(item.productId, remaining);
        messages.push(
          `${item.name}: reduced from ${old} to ${remaining} for ${pickupDate.value}.`
        );
      }
    }
  }

  if (adjusted) {
    alert(
      `Sorry, we only have a limited amount left for the selected date.\n\n` +
        messages.join("\n") +
        `\n\nIf you need more, please contact us.`
    );

    if (!items.value.length) {
      formError.value =
        "Your cart is now empty because there was no remaining capacity for the selected date.";
    }
    return;
  }

  // ============================
  // Build & store booking payload
  // ============================
  const bookingPayload = buildBookingPayload();
  if (!bookingPayload) {
    formError.value = "Could not build booking data. Please try again.";
    return;
  }

  if (import.meta.client) {
    sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(bookingPayload));
  }

  // ============================
  // Redirect to Stripe test checkout
  // ============================
  await startStripeCheckout();
};

/**
 * After Stripe redirects back with ?payment=success
 * we read the pending booking payload from sessionStorage
 * and actually create the booking in our backend.
 */
const finalizeBookingFromStripe = async () => {
  if (!import.meta.client) return;
  if (success.value) return;

  const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
  if (!raw) {
    // no draft booking – nothing to do
    return;
  }

  let payload: BookingCreateInput;
  try {
    payload = JSON.parse(raw);
  } catch {
    formError.value =
      "Payment succeeded but booking data was invalid. Please contact us.";
    return;
  }

  const created = await createBooking(payload);

  if (!created) {
    formError.value =
      "Payment succeeded but booking could not be created. Please contact us.";
    return;
  }

  success.value = true;

  // clear stored draft + cart
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
  clearCart();
};

/**
 * Stripe test checkout:
 * uses current cart items for line items.
 * Backend should:
 * - read items & total
 * - create Stripe Checkout Session
 * - redirect to success/cancel URLs
 */
const startStripeCheckout = async () => {
  formError.value = null;

  if (!items.value.length) {
    formError.value = "Your cart is empty.";
    return;
  }

  try {
    const payload = {
      items: items.value.map((item: any) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      // optional extras you can use in backend:
      totalPrice: totalPrice.value,
    };

    const res = await $fetch<{ url: string }>("/api/stripe/checkout", {
      method: "POST",
      body: payload,
    });

    if (!res.url) {
      formError.value = "Could not start Stripe checkout.";
      return;
    }

    // redirect to Stripe Checkout (test mode)
    window.location.href = res.url;
  } catch (err) {
    console.error(err);
    formError.value =
      "Stripe checkout failed. Please try again or contact the bakery.";
  }
};
</script>

<style scoped>
.checkout-page {
  position: relative;
  top: 80px;
  min-height: calc(100vh - 80px);
  background: #f4f4f4;
}

.back-btn {
  position: fixed;
  top: 100px;
  left: 25px;
  width: 48px;
  height: 48px;
  background: #6f7d75;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
}

.arrow-icon {
  width: 22px;
  height: 22px;
  color: white;
}

.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.checkout-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.info-text {
  margin-top: 0.5rem;
  color: #2563eb;
  font-size: 0.95rem;
}

.info-text.warning {
  color: #92400e;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}

.empty-state,
.success-box {
  margin-top: 2rem;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}

.error-text {
  color: #b3261e;
  margin-top: 1rem;
}
</style>
