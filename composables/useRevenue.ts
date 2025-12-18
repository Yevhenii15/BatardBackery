import { computed, type ComputedRef } from "vue";
import type { Booking } from "~/composables/useBooking";

type RevenueRow = [string, { revenue: number; qty: number }];

export function useRevenue(bookings: ComputedRef<Booking[]>) {
  const revenueBookings = computed(() =>
    bookings.value.filter((b) => b.status !== "cancelled")
  );

  const bookingTotal = (b: Booking): number => {
    if (!Array.isArray(b.items)) return 0;

    return b.items.reduce((sum, item) => {
      const price = typeof item.price === "number" ? item.price : 0;
      const qty = typeof item.quantity === "number" ? item.quantity : 1;
      return sum + price * qty;
    }, 0);
  };

  const totalOrders = computed(() => revenueBookings.value.length);

  const totalRevenue = computed(() =>
    revenueBookings.value.reduce((sum, b) => sum + bookingTotal(b), 0)
  );

  const totalItemsSold = computed(() =>
    revenueBookings.value.reduce((sum, b) => {
      if (!Array.isArray(b.items)) return sum;
      return (
        sum + b.items.reduce((inner, item) => inner + (item.quantity ?? 1), 0)
      );
    }, 0)
  );

  const averageOrderValue = computed(() =>
    totalOrders.value ? totalRevenue.value / totalOrders.value : 0
  );

  const revenueByCategory = computed<RevenueRow[]>(() => {
    const map = new Map<string, { revenue: number; qty: number }>();

    for (const b of revenueBookings.value) {
      const items = b.items || [];
      const pickups = b.pickups || [];

      for (const item of items) {
        const pickup = pickups[item.pickupIndex];
        const catName = pickup?.categoryName || "Uncategorized";

        const price = typeof item.price === "number" ? item.price : 0;
        const qty = typeof item.quantity === "number" ? item.quantity : 1;

        const current = map.get(catName) ?? { revenue: 0, qty: 0 };
        current.revenue += price * qty;
        current.qty += qty;
        map.set(catName, current);
      }
    }

    return Array.from(map.entries()).sort(
      (a, b) => b[1].revenue - a[1].revenue
    );
  });

  const revenueByProduct = computed<RevenueRow[]>(() => {
    const map = new Map<string, { revenue: number; qty: number }>();

    for (const b of revenueBookings.value) {
      const items = b.items || [];

      for (const item of items as any[]) {
        const name = item.name || "Unknown product";

        const price = typeof item.price === "number" ? item.price : 0;
        const qty = typeof item.quantity === "number" ? item.quantity : 1;

        const current = map.get(name) ?? { revenue: 0, qty: 0 };
        current.revenue += price * qty;
        current.qty += qty;
        map.set(name, current);
      }
    }

    return Array.from(map.entries()).sort(
      (a, b) => b[1].revenue - a[1].revenue
    );
  });

  const formatCurrency = (value: number) => `${value.toFixed(2)} DKK`;

  return {
    revenueBookings,
    bookingTotal,
    totalOrders,
    totalRevenue,
    totalItemsSold,
    averageOrderValue,
    revenueByCategory,
    revenueByProduct,
    formatCurrency,
  };
}
