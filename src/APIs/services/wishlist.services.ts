import "server-only";
import type { WishlistProduct } from "@/app/_types/WishlistType/WishlistType";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeProducts(value: unknown): WishlistProduct[] | undefined {
  const candidates = isRecord(value)
    ? [value.products, value.data, value]
    : [value];
  const list = candidates.find(Array.isArray);
  if (!Array.isArray(list)) return undefined;

  return list
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .map((item) => {
      const category = isRecord(item.category) ? item.category : undefined;
      return {
        _id: typeof item._id === "string" ? item._id : "",
        title: typeof item.title === "string" ? item.title : undefined,
        imageCover:
          typeof item.imageCover === "string" ? item.imageCover : undefined,
        price: typeof item.price === "number" ? item.price : undefined,
        priceAfterDiscount:
          typeof item.priceAfterDiscount === "number"
            ? item.priceAfterDiscount
            : undefined,
        quantity: typeof item.quantity === "number" ? item.quantity : undefined,
        category: category
          ? {
              name:
                typeof category.name === "string" ? category.name : undefined,
            }
          : undefined,
      };
    })
    .filter((product) => product._id.length > 0);
}

async function requestWishlist(
  token: string,
  method: "GET" | "POST" | "DELETE",
  productId?: string,
) {
  try {
    const response = await fetch(
      method === "DELETE" && productId
        ? `${BASE_URL}/${encodeURIComponent(productId)}`
        : BASE_URL,
      {
        method,
        headers: {
          token,
          ...(method === "POST" ? { "content-type": "application/json" } : {}),
        },
        ...(method === "POST" ? { body: JSON.stringify({ productId }) } : {}),
        cache: "no-store",
      },
    );

    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    if (
      !response.ok ||
      (isRecord(body) &&
        (body.statusMsg === "fail" || body.status === "error"))
    ) {
      return {
        ok: false as const,
        message:
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Wishlist request failed. Please try again.",
      };
    }

    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : method === "DELETE"
          ? "Removed from wishlist"
          : method === "POST"
            ? "Added to wishlist"
            : "Wishlist loaded";

    if (method !== "GET") return { ok: true as const, message };

    const products = normalizeProducts(body);
    if (!products) {
      return { ok: false as const, message: "Unexpected wishlist response" };
    }

    return { ok: true as const, message, products };
  } catch {
    return { ok: false as const, message: "Network error. Please try again." };
  }
}

export function getWishlist(token: string) {
  return requestWishlist(token, "GET").then((result) => {
    if (result.ok && !("products" in result)) {
      return { ok: false as const, message: "Unexpected wishlist response" };
    }
    return result;
  });
}

export function addWishlistProduct(token: string, productId: string) {
  return requestWishlist(token, "POST", productId);
}

export function removeWishlistProduct(token: string, productId: string) {
  return requestWishlist(token, "DELETE", productId);
}
