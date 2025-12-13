import { ref, computed } from "vue";
import type { Product } from "~/composables/useProduct";

export interface CartItem {
  productId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  categoryId: string;

  dailyCapacity?: number;
  stock?: number;
}

const STORAGE_KEY = "batard_cart";

const items = ref<CartItem[]>([]);
const initialized = ref(false);

const loadFromStorage = () => {
  if (initialized.value) return;
  initialized.value = true;

  if (import.meta.server) return;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as CartItem[];
    if (Array.isArray(parsed)) {
      items.value = parsed;
    }
  } catch (e) {
    console.error("Failed to parse cart from storage", e);
  }
};

const saveToStorage = () => {
  if (import.meta.server) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value));
  } catch (e) {
    console.error("Failed to save cart to storage", e);
  }
};

export function useCart() {
  loadFromStorage();

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  const calcMaxForProduct = (product: Product | CartItem) => {
    const cap =
      typeof (product as any).dailyCapacity === "number"
        ? (product as any).dailyCapacity
        : Infinity;
    const stock =
      typeof (product as any).stock === "number"
        ? (product as any).stock
        : Infinity;
    return Math.min(cap, stock);
  };

  const addItem = (product: Product, quantity = 1) => {
    const existing = items.value.find((i) => i.productId === product._id);

    const max = calcMaxForProduct(product);

    if (existing) {
      
      if (existing.dailyCapacity === undefined) {
        existing.dailyCapacity = product.dailyCapacity;
      }
      if (existing.stock === undefined) {
        existing.stock = product.stock;
      }

      const newQty = Math.min(existing.quantity + quantity, max);
      existing.quantity = newQty;
    } else {
      const qty = Math.min(quantity, max);
      items.value.push({
        productId: product._id,
        name: product.name,
        photo: product.photo || "",
        price: product.price,
        quantity: qty,
        categoryId: product.categoryId,
        dailyCapacity: product.dailyCapacity,
        stock: product.stock,
      });
    }

    saveToStorage();
    alert(`${product.name} has been added to the cart.`);
  };

  const setQuantity = (productId: string, quantity: number) => {
    const item = items.value.find((i) => i.productId === productId);
    if (!item) return;

    const max = calcMaxForProduct(item);
    const safeQty = Math.min(quantity, max);

    if (safeQty <= 0) {
      items.value = items.value.filter((i) => i.productId !== productId);
    } else {
      item.quantity = safeQty;
    }

    saveToStorage();
  };

  const removeItem = (productId: string) => {
    items.value = items.value.filter((i) => i.productId !== productId);
    saveToStorage();
  };

  const clearCart = () => {
    items.value = [];
    saveToStorage();
  };

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
  };
}
