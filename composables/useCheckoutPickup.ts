import { ref, watch } from "vue";
import type { Ref } from "vue";
import type { CartItem } from "./useCart";
import type { Category } from "./useCategory";

export interface PickupGroupState {
  key: string;
  categoryIds: string[];
  categoryNames: string;
  items: CartItem[];
  date: string;
  timeSlot: string;
  orderNotes: string;
}

export function useCheckoutPickup(
  items: Ref<CartItem[]>,
  categories: Ref<Category[]>
) {
  const today = new Date().toISOString().slice(0, 10);
  const pickupDate = ref<string>(today);
  const pickupGroups = ref<PickupGroupState[]>([]);

  const rebuildPickupGroups = () => {
    if (!items.value.length || !categories.value.length) {
      pickupGroups.value = [];
      return;
    }

    const map = new Map<string, PickupGroupState>();

    for (const item of items.value) {
      const cat = categories.value.find((c) => c._id === item.categoryId);
      if (!cat) continue;

      const key = [
        cat.weekdayTime?.from,
        cat.weekdayTime?.to,
        cat.weekendsTime?.from,
        cat.weekendsTime?.to,
        cat.slotSizeMinutes,
        cat.leadTimeMinutes,
      ].join("|");

      let group = map.get(key);

      if (!group) {
        group = {
          key,
          categoryIds: [cat._id],
          categoryNames: cat.categoryName,
          items: [],
          date: pickupDate.value,
          timeSlot: "",
          orderNotes: "",
        };
        map.set(key, group);
      } else {
        if (!group.categoryIds.includes(cat._id)) {
          group.categoryIds.push(cat._id);
          group.categoryNames += ", " + cat.categoryName;
        }
      }

      group.items.push(item);
    }

    pickupGroups.value = Array.from(map.values());
  };

  const parseTime = (t: string | undefined): [number, number] => {
    const [h, m] = (t ?? "00:00").split(":").map(Number);
    return [h || 0, m || 0];
  };

  // ✅ rounds to next slot boundary (keeps slots like 13:00, 13:15, 13:30...)
  const roundUpToSlot = (value: number, origin: number, step: number) => {
    const diff = value - origin;
    if (diff <= 0) return origin;
    return origin + Math.ceil(diff / step) * step;
  };

  const timeSlots = (group: PickupGroupState): string[] => {
    if (!group.date) return [];

    const catId = group.categoryIds[0];
    const cat = categories.value.find((c) => c._id === catId);
    if (!cat) return [];

    const date = new Date(group.date + "T00:00:00");
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;

    const range = isWeekend ? cat.weekendsTime : cat.weekdayTime;
    if (!range?.from || !range?.to) return [];

    const [fromH, fromM] = parseTime(range.from);
    const [toH, toM] = parseTime(range.to);

    let start = fromH * 60 + fromM;
    const end = toH * 60 + toM;

    const slotSize = cat.slotSizeMinutes || 15;
    const lead = cat.leadTimeMinutes || 0;

    // ✅ TODAY: apply lead time and then round up to next allowed slot
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    if (group.date === todayStr) {
      const nowMinutes = now.getHours() * 60 + now.getMinutes() + lead;
      start = roundUpToSlot(
        Math.max(start, nowMinutes),
        fromH * 60 + fromM,
        slotSize
      );
    }

    if (start > end) return [];

    const slots: string[] = [];
    for (let m = start; m <= end; m += slotSize) {
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }

    return slots;
  };

  watch([items, categories], rebuildPickupGroups, { immediate: true });

  watch(
    pickupDate,
    (newDate) => {
      pickupGroups.value.forEach((g) => {
        g.date = newDate;
        g.timeSlot = "";
      });
    },
    { immediate: true }
  );

  return {
    today,
    pickupDate,
    pickupGroups,
    timeSlots,
    rebuildPickupGroups,
  };
}
