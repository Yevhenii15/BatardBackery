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
    if (Array.isArray(parsed)) items.value = parsed;
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

//  Shared limit logic (used everywhere)
const maxPerOrder = (p: Product | CartItem) => {
  const cap =
    typeof (p as any).dailyCapacity === "number"
      ? (p as any).dailyCapacity
      : Infinity;

  const stock =
    typeof (p as any).stock === "number" ? (p as any).stock : Infinity;

  const max = Math.min(cap, stock);

  // consistent with your pages: Infinity -> 99 fallback
  return max === Infinity ? 99 : max;
};

export function useCart() {
  loadFromStorage();

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  //  How many pieces of a product are already in the cart
  const alreadyInCart = (productId: string) =>
    items.value.reduce((sum, item) => {
      return item.productId === productId ? sum + item.quantity : sum;
    }, 0);

  //  Remaining pieces user can still add (based on capacity/stock and cart)
  const remainingForProduct = (p: Product | CartItem) => {
    const id = (p as any)._id || (p as any).productId;
    const max = maxPerOrder(p);
    const used = alreadyInCart(id);
    return Math.max(0, max - used);
  };

  const addItem = (product: Product, quantity = 1) => {
    const existing = items.value.find((i) => i.productId === product._id);

    // max allowed for this product today
    const max = maxPerOrder(product);

    if (existing) {
      // store limits in cart item if missing
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

    const max = maxPerOrder(item);
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

    //  exported helpers so pages don’t duplicate logic
    maxPerOrder,
    alreadyInCart,
    remainingForProduct,

    addItem,
    setQuantity,
    removeItem,
    clearCart,
  };
}
