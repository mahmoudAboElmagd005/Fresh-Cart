"use server";

import { revalidatePath } from "next/cache";
import {
  addWishlistProduct,
  getWishlist,
  removeWishlistProduct,
} from "@/APIs/services/wishlist.services";
import { getApiToken } from "@/lib/getApiToken";

export async function getWishlistAction() {
  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to view your wishlist." };
  }

  const result = await getWishlist(token);
  if (!result.ok) return { status: "error" as const, message: result.message };
  if (!("products" in result)) {
    return { status: "error" as const, message: "Unexpected wishlist response" };
  }
  return { status: "success" as const, products: result.products };
}

export async function addWishlistProductAction(productId: string) {
  if (typeof productId !== "string" || !productId.trim()) {
    return { status: "error" as const, message: "Invalid product." };
  }

  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to continue." };
  }

  const result = await addWishlistProduct(token, productId);
  if (!result.ok) return { status: "error" as const, message: result.message };

  revalidatePath("/wishlist");
  return { status: "success" as const, message: result.message };
}

export async function removeWishlistProductAction(productId: string) {
  if (typeof productId !== "string" || !productId.trim()) {
    return { status: "error" as const, message: "Invalid product." };
  }

  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to continue." };
  }

  const result = await removeWishlistProduct(token, productId);
  if (!result.ok) return { status: "error" as const, message: result.message };

  revalidatePath("/wishlist");
  return { status: "success" as const, message: result.message };
}
