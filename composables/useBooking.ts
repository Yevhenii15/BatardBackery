
import { ref } from "vue";
import { useApiClient } from "./useApiClient";

export interface BookingCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface BookingItemInput {
  productId: string;
  quantity: number;
  pickupIndex: number;
}

export interface BookingPickupInput {
  categoryId: string;
  date: string; 
  timeSlot: string; 
  orderNotes?: string;
}

export interface BookingCreateInput {
  customer: BookingCustomer;
  pickups: BookingPickupInput[];
  items: BookingItemInput[];
}


export interface BookingItem {
  productId: string;
  name: string;
  photo: string;
  quantity: number;
  price: number;
  subtotalPrice: number;
  pickupIndex: number;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  bookingNumber: string;
  customer: BookingCustomer;
  pickups: {
    categoryId: string;
    categoryName: string;
    date: string;
    timeSlot: string;
    orderNotes?: string;
  }[];
  items: BookingItem[];
  totalPrice: number;
  status: BookingStatus;
  archived: boolean;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingUpdatePayload {
  status?: BookingStatus;
  archived?: boolean;
}

const bookings = ref<Booking[]>([]);
const booking = ref<Booking | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useBooking() {
  const api = useApiClient();

  // Public: create booking
  const createBooking = async (data: BookingCreateInput) => {
    loading.value = true;
    error.value = null;

    try {
      const created = await api<Booking>("/api/booking", {
        method: "POST",
        body: data,
      });
      booking.value = created;
      alert("Booking created successfully!");
      return created;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to create booking";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Admin: list bookings
  const getBookings = async (archived = false) => {
    loading.value = true;
    error.value = null;

    try {
      bookings.value = await api<Booking[]>(
        `/api/booking?archived=${archived}`
      );
    } catch (err: any) {
      error.value = err?.statusMessage || "Failed to fetch bookings";
    } finally {
      loading.value = false;
    }
  };

  // Admin: get booking by id
  const getBookingById = async (id: string) => {
    loading.value = true;
    booking.value = null;

    try {
      const data = await api<Booking>(`/api/booking/${id}`, { method: "GET" });
      booking.value = data;
      return data;
    } catch (err) {
      booking.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };
  const getBookingByNumber = async (bookingNumber: string) => {
    loading.value = true;
    error.value = null;
    booking.value = null;

    try {
      const data = await api<Booking>(`/api/booking/number/${bookingNumber}`, {
        method: "GET",
      });
      booking.value = data;
      return data;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to load booking";
      booking.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };
  // Admin: update booking (status / archived)
  const updateBooking = async (id: string, payload: BookingUpdatePayload) => {
    loading.value = true;
    error.value = null;

    try {
      const updated = await api<Booking>(`/api/booking/${id}`, {
        method: "PUT",
        body: payload,
      });

      booking.value = updated;
      const index = bookings.value.findIndex((b) => b._id === id);
      if (index !== -1) bookings.value[index] = updated;

      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to update booking";
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Admin: delete booking
  const deleteBooking = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      await api(`/api/booking/${id}`, { method: "DELETE" });
      bookings.value = bookings.value.filter((b) => b._id !== id);
      if (booking.value?._id === id) booking.value = null;
      return true;
    } catch (err: any) {
      error.value =
        err?.data?.message || err?.statusMessage || "Failed to delete booking";
      return false;
    } finally {
      loading.value = false;
    }
  };
  // composables/useBooking.ts 
  const checkCapacity = async (date: string, cartItems: any[]) => {
    if (!date || !cartItems.length) {
      return { ok: false, byProduct: {} as Record<string, any> };
    }

    const { data, error } = await useFetch("/api/booking/check-capacity", {
      method: "POST",
      body: {
        date,
        items: cartItems.map((i) => ({ productId: i.productId })),
      },
    });

    if (error.value) {
      console.error("checkCapacity error", error.value);
      return { ok: false, byProduct: {} as Record<string, any> };
    }

    return data.value as {
      ok: boolean;
      byProduct: Record<
        string,
        {
          capacity: number;
          stock: number;
          alreadyBooked: number;
          remaining: number;
        }
      >;
    };
  };
  const lookupBooking = async (bookingNumber: string, lastName: string) => {
    loading.value = true;
    error.value = null;
    booking.value = null;

    try {
      const encodedNumber = encodeURIComponent(bookingNumber);
      const encodedLast = encodeURIComponent(lastName);

      const data = await api<Booking>(
        `/api/booking/lookup?bookingNumber=${encodedNumber}&lastName=${encodedLast}`,
        { method: "GET" }
      );

      booking.value = data;
      return data;
    } catch (err: any) {
      if (err?.status === 404 || err?.statusCode === 404) {
        error.value =
          "We couldn’t find a booking with that number and surname. Please check your details.";
      } else {
        error.value =
          err?.data?.message || err?.statusMessage || "Failed to load booking.";
      }
      booking.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };
  return {
    bookings,
    booking,
    loading,
    error,

    createBooking,
    getBookings,
    getBookingById,
    getBookingByNumber,
    updateBooking,
    deleteBooking,
    checkCapacity,
    lookupBooking,
  };
}
