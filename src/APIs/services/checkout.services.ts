import "server-only";
import type { ShippingAddress } from "@/app/_schemas/checkout.schema";

const BASE_URL = "https://ecommerce.routemisr.com";

type ApiResult =
  | { ok: true; message: string; raw: unknown; sessionUrl?: string }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function postOrder(
  url: string,
  token: string,
  shippingAddress: ShippingAddress,
): Promise<ApiResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { token, "content-type": "application/json" },
      body: JSON.stringify({ shippingAddress }),
      cache: "no-store",
    });

    const text = await response.text();
    let raw: unknown;
    try {
      raw = text ? JSON.parse(text) : {};
    } catch {
      raw = {};
    }

    if (
      !response.ok ||
      (isRecord(raw) &&
        (raw.statusMsg === "fail" || raw.status === "error"))
    ) {
      return {
        ok: false,
        message:
          isRecord(raw) && typeof raw.message === "string"
            ? raw.message
            : "Could not place your order. Please try again.",
      };
    }

    const message =
      isRecord(raw) && typeof raw.message === "string"
        ? raw.message
        : "Your order was placed successfully";

    if (url.includes("checkout-session")) {
      const data = isRecord(raw) && isRecord(raw.data) ? raw.data : undefined;
      const session =
        (isRecord(raw) && isRecord(raw.session) ? raw.session : undefined) ??
        (data && isRecord(data.session) ? data.session : undefined);
      const sessionUrl =
        (session && typeof session.url === "string" ? session.url : undefined) ??
        (data && typeof data.url === "string" ? data.url : undefined) ??
        (isRecord(raw) && typeof raw.url === "string" ? raw.url : undefined);

      if (!sessionUrl) {
        return { ok: false, message: "Stripe did not return a checkout URL." };
      }

      return { ok: true, message, raw, sessionUrl };
    }

    return { ok: true, message, raw };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export function placeCashOrder(
  token: string,
  cartId: string,
  shippingAddress: ShippingAddress,
) {
  return postOrder(
    `${BASE_URL}/api/v2/orders/${encodeURIComponent(cartId)}`,
    token,
    shippingAddress,
  );
}

export function createStripeCheckoutSession(
  token: string,
  cartId: string,
  shippingAddress: ShippingAddress,
  origin: string,
) {
  const query = new URLSearchParams({ url: origin });
  return postOrder(
    `${BASE_URL}/api/v1/orders/checkout-session/${encodeURIComponent(cartId)}?${query.toString()}`,
    token,
    shippingAddress,
  );
}
