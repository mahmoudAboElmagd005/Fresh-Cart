"use client";

import { getWishlistAction } from "@/app/_actions/wishlist.actions";
import { getGuestWishlist } from "@/lib/guestWishlist";

let wishlistIdsRequest: Promise<Set<string>> | undefined;

export function getCachedWishlistIds() {
  if (!wishlistIdsRequest) {
    wishlistIdsRequest = getWishlistAction()
      .then((result) =>
        result.status === "success"
          ? new Set((result.products ?? []).map((product) => product._id))
          : new Set(getGuestWishlist().map((product) => product._id)),
      )
      .catch(() => new Set<string>());
  }

  return wishlistIdsRequest;
}

export function updateCachedWishlistProduct(productId: string, saved: boolean) {
  if (!wishlistIdsRequest) return;
  void wishlistIdsRequest.then((ids) => {
    if (saved) ids.add(productId);
    else ids.delete(productId);
  });
}
