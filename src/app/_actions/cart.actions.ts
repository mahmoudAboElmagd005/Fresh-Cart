"use server";

import { revalidatePath } from "next/cache";
import { getApiToken } from "@/lib/getApiToken";

type CartRequestResult =
  | { status: "unauthenticated"; message: string }
  | { status: "error"; message: string }
  | { status: "success"; data: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function requestCart(
  path: string,
  method: "GET" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
): Promise<CartRequestResult> {
  const apiToken = await getApiToken();
  if (!apiToken) {
    return { status: "unauthenticated", message: "You must be logged in" };
  }

  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v2/cart${path}`, {
      method,
      headers: {
        token: apiToken,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });

    const responseText = await res.text();
    let data: unknown;
    try {
      data = responseText ? JSON.parse(responseText) : undefined;
    } catch {
      data = undefined;
    }

    if (!res.ok || (isRecord(data) && data.statusMsg === "fail")) {
      const message =
        isRecord(data) && typeof data.message === "string"
          ? data.message
          : "Cart request failed";
      return { status: "error", message };
    }

    if (method !== "GET") revalidatePath("/", "layout");
    return { status: "success", data };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

export async function getCart() {
  return requestCart("", "GET");
}

export async function updateCartItem(productId: string, count: number) {
  if (!productId || !Number.isInteger(count) || count < 1) {
    return { status: "error", message: "Invalid product or quantity" };
  }

  return requestCart(`/${encodeURIComponent(productId)}`, "PUT", { count });
}

export async function removeCartItem(productId: string) {
  if (!productId) {
    return { status: "error", message: "Invalid product" };
  }

  return requestCart(`/${encodeURIComponent(productId)}`, "DELETE");
}

export async function clearCart() {
  return requestCart("", "DELETE");
}
