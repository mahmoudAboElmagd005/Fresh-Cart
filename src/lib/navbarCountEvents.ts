type CountUpdate = { count?: number; delta?: number };

export const CART_COUNT_EVENT = "freshcart:cart-count";
export const WISHLIST_COUNT_EVENT = "freshcart:wishlist-count";

function publishCountUpdate(eventName: string, update: CountUpdate) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<CountUpdate>(eventName, { detail: update }));
}

export function publishCartItemCount(count: number) {
  publishCountUpdate(CART_COUNT_EVENT, { count });
}

export function publishCartItemDelta(delta: number) {
  publishCountUpdate(CART_COUNT_EVENT, { delta });
}

export function publishWishlistItemCount(count: number) {
  publishCountUpdate(WISHLIST_COUNT_EVENT, { count });
}

export function publishWishlistItemDelta(delta: number) {
  publishCountUpdate(WISHLIST_COUNT_EVENT, { delta });
}

export function applyCountUpdate(current: number, update?: CountUpdate) {
  if (typeof update?.count === "number") return Math.max(0, update.count);
  if (typeof update?.delta === "number") return Math.max(0, current + update.delta);
  return current;
}
