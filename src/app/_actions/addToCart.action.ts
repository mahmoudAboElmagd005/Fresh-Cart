"use server";

import { revalidatePath } from "next/cache";
import { getApiToken } from "@/lib/getApiToken";
import { getProduct } from "@/APIs/services/route.services";
import { normalizeCart } from "@/lib/cart";
import type { GuestCartItem } from "@/lib/guestCart";

export async function addProductToCart(productId: string, count = 1) {
  if (!productId || !Number.isInteger(count) || count < 1) {
    return { status: "error", message: "Invalid product or quantity" };
  }

  const apiToken = await getApiToken();

  try {
    if (!apiToken) {
      const product = await getProduct(productId);
      if (!product) return { status: "error", message: "Product not found" };

      const item: GuestCartItem = {
        productId: product._id,
        count,
        price: product.price,
        product: {
          _id: product._id,
          id: product.id,
          title: product.title,
          imageCover: product.imageCover,
          category: { name: product.category.name },
        },
      };

      return { status: "guest", item };
    }

    const cartUrl = "https://ecommerce.routemisr.com/api/v2/cart";
    const cartRes = await fetch(cartUrl, {
      method: "GET",
      headers: { token: apiToken },
      cache: "no-store",
    });
    const cartData = await cartRes.json();
    if (!cartRes.ok || cartData?.statusMsg === "fail") {
      return {
        status: "error",
        message: cartData?.message ?? "Could not read your cart",
      };
    }

    const existing = normalizeCart({ status: "success", data: cartData }).find(
      (item) => item.productId === productId,
    );
    const res = await fetch(
      existing ? `${cartUrl}/${encodeURIComponent(productId)}` : cartUrl,
      {
      method: existing ? "PUT" : "POST",
      headers: {
        token: apiToken,
        "content-type": "application/json",
      },
      body: JSON.stringify(
        existing
          ? { count: existing.count + count }
          : { productId },
      ),
      cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok || data?.statusMsg === "fail") {
      return { status: "error", message: data?.message ?? "Failed to add" };
    }

    if (!existing && count > 1) {
      const quantityRes = await fetch(
        `${cartUrl}/${encodeURIComponent(productId)}`,
        {
          method: "PUT",
          headers: {
            token: apiToken,
            "content-type": "application/json",
          },
          body: JSON.stringify({ count }),
          cache: "no-store",
        },
      );
      const quantityData = await quantityRes.json();
      if (!quantityRes.ok || quantityData?.statusMsg === "fail") {
        return {
          status: "error",
          message: quantityData?.message ?? "Could not update product quantity",
        };
      }
    }

    revalidatePath("/", "layout");
    return { status: "success", ...data };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
