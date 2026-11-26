import type { WishlistProduct } from "@/app/_types/WishlistType/WishlistType";

const GUEST_WISHLIST_KEY = "guestWishlist";

export function getGuestWishlist(): WishlistProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(GUEST_WISHLIST_KEY) ?? "[]");
    return Array.isArray(value) ? value as WishlistProduct[] : [];
  } catch {
    return [];
  }
}

function save(items: WishlistProduct[]) {
  try { window.localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items)); } catch { /* Storage may be unavailable. */ }
}

export function addGuestWishlistProduct(product: WishlistProduct) {
  if (typeof window === "undefined") return;
  const items = getGuestWishlist();
  if (!items.some((item) => item._id === product._id)) save([...items, product]);
}

export function removeGuestWishlistProduct(productId: string) {
  if (typeof window === "undefined") return;
  save(getGuestWishlist().filter((item) => item._id !== productId));
}
