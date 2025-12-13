<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <!-- Back button -->
      <div class="back-btn-wrapper">
        <NuxtLink to="/admin" class="back-btn">← </NuxtLink>
      </div>

      <!-- Header -->
      <h1 class="admin-title">All bookings</h1>
      <p class="admin-subtitle">Search, manage, and update customer bookings</p>

      <!-- Error -->
      <div v-if="error" class="alert-error">{{ error }}</div>

      <BookingSearch @search="searchBooking" @reset="reloadBookings" />

      <!-- Active bookings -->
      <div class="admin-card">
        <BookingTable
          title="Active bookings"
          subtitle="Pending and confirmed bookings"
          :items="activeBookings"
          :loading="loading"
          @updateBooking="handleUpdateBooking"
          @delete="removeBooking"
        />
      </div>

      <!-- Archived bookings -->
      <div class="admin-card">
        <BookingTable
          title="Archived bookings"
          subtitle="Completed or cancelled bookings"
          :items="archivedBookings"
          :loading="loadingArchived"
          @updateBooking="handleUpdateBooking"
          @delete="removeBooking"
        />
      </div>
      <!-- Revenue summary -->
      <div class="admin-card">
        <BookingRevenue :bookings="bookings" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBooking } from "~/composables/useBooking";

import BookingTable from "~/components/admin/booking/BookingTable.vue";
import BookingSearch from "~/components/admin/booking/BookingSearch.vue";
import BookingRevenue from "~/components/admin/booking/BookingRevenue.vue";

// composable
const {
  bookings,
  booking,
  loading,
  error,
  getBookings,
  getBookingById,
  getBookingByNumber,
  deleteBooking,
  updateBooking,
} = useBooking();

const loadingArchived = ref(false);

const activeBookings = computed(() =>
  bookings.value.filter((b) => !b.archived)
);

const archivedBookings = computed(() =>
  bookings.value.filter((b) => b.archived)
);

const reloadBookings = async () => {
  await getBookings(false);
  loadingArchived.value = true;
  await getBookings(true);
  loadingArchived.value = false;
};

onMounted(async () => {
  await getBookings(false); 
  loadingArchived.value = true;
  await getBookings(true); 
  loadingArchived.value = false;
});

// search by ID or booking number
const searchBooking = async (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    await reloadBookings();
    return;
  }

  let found: any = null;

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(trimmed);
  if (isObjectId) {
    const byId = await getBookingById(trimmed);
    if (byId) found = byId;
  }

  if (!found) {
    const byNumber = await getBookingByNumber(trimmed);
    if (byNumber) found = byNumber;
  }

  if (found) {
    bookings.value = [found];
  } else {
    window.alert("Booking not found");
    bookings.value = [];
  }
};


const handleUpdateBooking = async (payload: {
  id: string;
  status: string;
  archived: boolean;
}) => {
  let archived = payload.archived;

  if (payload.status === "completed" || payload.status === "cancelled") {
    archived = true;
  }

  await updateBooking(payload.id, {
    status: payload.status as any,
    archived,
  });

  bookings.value = bookings.value.map((b) =>
    b._id === payload.id ? { ...b, status: payload.status as any, archived } : b
  );

  if (booking.value && booking.value._id === payload.id) {
    booking.value.status = payload.status as any;
    booking.value.archived = archived;
  }
};

// delete booking
const removeBooking = async (id: string) => {
  if (!confirm("Delete this booking?")) return;
  await deleteBooking(id);

  bookings.value = bookings.value.filter((b) => b._id !== id);

  if (booking.value && booking.value._id === id) {
    booking.value = null;
  }
};
</script>

<style scoped>
.admin-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}
.back-btn-wrapper {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  display: inline-block;
  background: #3b4b3d;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s ease;
  font-weight: bold;
}

.back-btn:hover {
  background: #283529;
}

/* Outer dark background */
.admin-wrapper {
  background: #211a1a;
  min-height: 100vh;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* Green main container */
.admin-container {
  background: #5d7261;
  width: 90%;
  max-width: 1100px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.45);
  text-align: center;
}

/* Header */
.admin-title {
  font-size: 32px;
  font-family: Georgia, serif;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 10px;
}

.admin-subtitle {
  color: #e7e7e7;
  margin-bottom: 30px;
  font-size: 15px;
}

/* Error */
.alert-error {
  background: #c67b7b;
  color: #fff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}
</style>
