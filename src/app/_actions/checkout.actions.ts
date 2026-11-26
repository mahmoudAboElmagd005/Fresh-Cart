"use server";

import { revalidatePath } from "next/cache";
import { getAddresses } from "@/APIs/services/account.services";
import {
  createStripeCheckoutSession,
  placeCashOrder,
} from "@/APIs/services/checkout.services";
import { getCart } from "@/app/_actions/cart.actions";
import { shippingAddressSchema } from "@/app/_schemas/checkout.schema";
import type { AccountAddress } from "@/app/_types/AccountType/AccountType";
import type { CartLine } from "@/lib/cart";
import { normalizeCart } from "@/lib/cart";
import { getApiToken } from "@/lib/getApiToken";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readCartMetadata(raw: unknown) {
  const top = isRecord(raw) ? raw : {};
  const firstData = isRecord(top.data) ? top.data : top;
  const cartData = isRecord(firstData.data) ? firstData.data : firstData;
  const cart = isRecord(cartData.cart) ? cartData.cart : cartData;
  const cartId =
    (typeof top.cartId === "string" && top.cartId) ||
    (typeof firstData.cartId === "string" && firstData.cartId) ||
    (typeof cartData.cartId === "string" && cartData.cartId) ||
    (typeof cart._id === "string" && cart._id) ||
    undefined;
  const total = [
    top.totalCartPrice,
    firstData.totalCartPrice,
    cartData.totalCartPrice,
    cart.totalCartPrice,
  ].find((value): value is number => typeof value === "number");

  return { cartId, total };
}

export async function getCheckoutDataAction() {
  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to continue." };
  }

  const [cartResult, addressesResult] = await Promise.all([
    getCart(),
    getAddresses(token),
  ]);

  if (cartResult.status === "unauthenticated") {
    return { status: "unauthenticated" as const, message: cartResult.message };
  }
  if (cartResult.status !== "success") {
    return { status: "error" as const, message: cartResult.message };
  }
  if (!addressesResult.ok) {
    return { status: "error" as const, message: addressesResult.message };
  }

  const items: CartLine[] = normalizeCart(cartResult);
  const { cartId, total } = readCartMetadata(cartResult.data);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0);

  return {
    status: "success" as const,
    cartId: cartId ?? "",
    items,
    addresses: addressesResult.data as AccountAddress[],
    total: total ?? subtotal,
  };
}

function validateShippingAddress(input: unknown) {
  const parsed = shippingAddressSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Invalid shipping address.",
    };
  }
  return { ok: true as const, data: parsed.data };
}

export async function placeCashOrderAction(cartId: string, input: unknown) {
  if (typeof cartId !== "string" || !cartId.trim()) {
    return { status: "error" as const, message: "Could not identify your cart." };
  }
  const address = validateShippingAddress(input);
  if (!address.ok) return { status: "error" as const, message: address.message };

  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to continue." };
  }

  const result = await placeCashOrder(token, cartId, address.data);
  if (!result.ok) return { status: "error" as const, message: result.message };

  revalidatePath("/cart");
  revalidatePath("/checkout");
  revalidatePath("/", "layout");
  return { status: "success" as const, message: result.message };
}

export async function createStripeCheckoutSessionAction(
  cartId: string,
  input: unknown,
  origin: string,
) {
  if (typeof cartId !== "string" || !cartId.trim()) {
    return { status: "error" as const, message: "Could not identify your cart." };
  }
  const address = validateShippingAddress(input);
  if (!address.ok) return { status: "error" as const, message: address.message };

  let safeOrigin: string;
  try {
    const parsedOrigin = new URL(origin);
    if (
      parsedOrigin.protocol !== "https:" &&
      !(parsedOrigin.protocol === "http:" && parsedOrigin.hostname === "localhost")
    ) {
      return { status: "error" as const, message: "Invalid checkout return URL." };
    }
    safeOrigin = parsedOrigin.origin;
  } catch {
    return { status: "error" as const, message: "Invalid checkout return URL." };
  }

  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to continue." };
  }

  const result = await createStripeCheckoutSession(
    token,
    cartId,
    address.data,
    safeOrigin,
  );
  if (!result.ok) return { status: "error" as const, message: result.message };
  if (!result.sessionUrl) {
    return { status: "error" as const, message: "Stripe did not return a checkout URL." };
  }
  return {
    status: "success" as const,
    message: result.message,
    sessionUrl: result.sessionUrl,
  };
}
