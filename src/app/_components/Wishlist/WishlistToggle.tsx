"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa6";
import {
  addWishlistProductAction,
  removeWishlistProductAction,
} from "@/app/_actions/wishlist.actions";
import { publishWishlistItemDelta } from "@/lib/navbarCountEvents";
import { getCachedWishlistIds, updateCachedWishlistProduct } from "@/lib/wishlistClientCache";
import type { WishlistProduct } from "@/app/_types/WishlistType/WishlistType";
import { addGuestWishlistProduct, removeGuestWishlistProduct } from "@/lib/guestWishlist";

export default function WishlistToggle({
  productId,
  product,
  className,
  label,
}: {
  productId: string;
  product: WishlistProduct;
  className: string;
  label?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "added">("loading");

  useEffect(() => {
    let active = true;

    void getCachedWishlistIds()
      .then((ids) => {
        if (!active) return;
        setStatus(ids.has(productId) ? "added" : "idle");
      })
      .catch(() => {
        if (active) setStatus("idle");
      });

    return () => {
      active = false;
    };
  }, [productId]);

  async function handleToggle() {
    if (status === "loading") return;
    const wasAdded = status === "added";
    setStatus("loading");

    try {
      const result = wasAdded
        ? await removeWishlistProductAction(productId)
        : await addWishlistProductAction(productId);
      if (result.status === "unauthenticated") {
        if (wasAdded) removeGuestWishlistProduct(productId);
        else addGuestWishlistProduct(product);
        updateCachedWishlistProduct(productId, !wasAdded);
      }
      else if (result.status === "error") {
        setStatus(wasAdded ? "added" : "idle");
        return;
      }

      setStatus(wasAdded ? "idle" : "added");
      if (result.status === "success") updateCachedWishlistProduct(productId, !wasAdded);
      publishWishlistItemDelta(wasAdded ? -1 : 1);
      router.refresh();
    } catch {
      setStatus(wasAdded ? "added" : "idle");
    }
  }

  return (
    <button
      type="button"
      aria-label={status === "added" ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={status === "added"}
      title={status === "added" ? "Remove from wishlist" : "Add to wishlist"}
      disabled={status === "loading"}
      onClick={() => void handleToggle()}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {status === "loading" ? (
        <FaSpinner className="animate-spin" aria-hidden="true" />
      ) : status === "added" ? (
        <FaHeart className="text-[#FA2B36]" aria-hidden="true" />
      ) : (
        <FaRegHeart aria-hidden="true" />
      )}
      {label && (status === "added" ? "Added to Wishlist" : label)}
    </button>
  );
}
