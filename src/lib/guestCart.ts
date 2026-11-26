export interface GuestCartItem {
  productId: string;
  count: number;
  price: number;
  product: {
    _id: string;
    id: string;
    title: string;
    imageCover: string;
    category: { name: string };
  };
}

const GUEST_CART_KEY = "guestCart";

function saveGuestCart(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(GUEST_CART_KEY);
    if (!stored) return [];

    const items: unknown = JSON.parse(stored);
    return Array.isArray(items) ? (items as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

export function addToGuestCart(item: GuestCartItem): void {
  if (typeof window === "undefined") return;

  const items = getGuestCart();
  const existingItem = items.find(
    (cartItem) => cartItem.productId === item.productId,
  );

  if (existingItem) {
    existingItem.count += item.count;
  } else {
    items.push(item);
  }

  saveGuestCart(items);
}

export function updateGuestCount(productId: string, count: number): void {
  if (!Number.isInteger(count) || count < 1) return;

  saveGuestCart(
    getGuestCart().map((item) =>
      item.productId === productId ? { ...item, count } : item,
    ),
  );
}

export function removeGuestItem(productId: string): void {
  saveGuestCart(getGuestCart().filter((item) => item.productId !== productId));
}

export function clearGuestCart(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}
