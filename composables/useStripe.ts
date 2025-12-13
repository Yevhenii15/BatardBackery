import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCart } from "./useCart";
import { useBooking, type BookingCreateInput } from "./useBooking";

const PENDING_BOOKING_KEY = "batard_pending_booking";

const success = ref(false);
const stripeError = ref<string | null>(null);

export function useStripeCheckout() {
  const route = useRoute();
  const { items, clearCart, totalPrice } = useCart();
  const { createBooking } = useBooking();

  const paymentStatus = computed<string | null>(() => {
    const q = route.query.payment;
    return typeof q === "string" ? q : null;
  });

  
  const storePendingBooking = (payload: BookingCreateInput) => {
    if (!import.meta.client) return;
    try {
      sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to store pending booking in sessionStorage", e);
    }
  };

 
  const finalizeBookingFromStripe = async (): Promise<boolean> => {
    stripeError.value = null;

    if (!import.meta.client) return false;
    if (success.value) return true;

    const raw = sessionStorage.getItem(PENDING_BOOKING_KEY);
    if (!raw) {
      return false;
    }

    let payload: BookingCreateInput;
    try {
      payload = JSON.parse(raw);
    } catch {
      stripeError.value =
        "Payment succeeded but booking data was invalid. Please contact us.";
      return false;
    }

    const created = await createBooking(payload);

    if (!created) {
      stripeError.value =
        "Payment succeeded but booking could not be created. Please contact us.";
      return false;
    }

    success.value = true;

    sessionStorage.removeItem(PENDING_BOOKING_KEY);
    clearCart();

    return true;
  };

 
  const startStripeCheckout = async () => {
    stripeError.value = null;

    if (!items.value.length) {
      stripeError.value = "Your cart is empty.";
      return;
    }

    try {
      const payload = {
        items: items.value.map((item: any) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: totalPrice.value,
      };

      const res = await $fetch<{ url: string }>("/api/stripe/checkout", {
        method: "POST",
        body: payload,
      });

      if (!res.url) {
        stripeError.value = "Could not start Stripe checkout.";
        return;
      }

      window.location.href = res.url;
    } catch (err) {
      console.error(err);
      stripeError.value =
        "Stripe checkout failed. Please try again or contact the bakery.";
    }
  };

  return {
    paymentStatus,
    success,
    stripeError,
    storePendingBooking,
    finalizeBookingFromStripe,
    startStripeCheckout,
  };
}