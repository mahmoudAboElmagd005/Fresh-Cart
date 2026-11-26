import "server-only";
import type { OrderItem, UserOrder } from "@/app/_types/OrderType/OrderType";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

type OrdersResult =
  | { ok: true; orders: UserOrder[] }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getUserIdFromApiToken(token: string): string | undefined {
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const decoded: unknown = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (!isRecord(decoded)) return undefined;
    return typeof decoded.id === "string" && decoded.id.trim()
      ? decoded.id
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeOrder(value: unknown, index: number): UserOrder | undefined {
  if (!isRecord(value)) return undefined;

  const rawItems = Array.isArray(value.cartItems) ? value.cartItems : [];
  const cartItems: OrderItem[] = rawItems.map((rawItem, itemIndex) => {
    const item = isRecord(rawItem) ? rawItem : {};
    const product = isRecord(item.product) ? item.product : {};
    const productId =
      typeof product._id === "string"
        ? product._id
        : `${String(value._id ?? value.id ?? index)}-${itemIndex}`;

    return {
      key: productId,
      title: typeof product.title === "string" ? product.title : "Product",
      imageCover:
        typeof product.imageCover === "string" ? product.imageCover : "",
      count: Math.max(0, toNumber(item.count, 1)),
      price: Math.max(0, toNumber(item.price)),
    };
  });

  const address = isRecord(value.shippingAddress) ? value.shippingAddress : {};
  const rawId = value.id ?? value._id ?? `order-${index + 1}`;
  const orderNumber = String(rawId);

  return {
    key: String(value._id ?? rawId),
    orderNumber,
    createdAt: typeof value.createdAt === "string" ? value.createdAt : "",
    isPaid: value.isPaid === true,
    isDelivered: value.isDelivered === true,
    paymentMethodType:
      typeof value.paymentMethodType === "string"
        ? value.paymentMethodType
        : "cash",
    shippingPrice: Math.max(0, toNumber(value.shippingPrice)),
    taxPrice: Math.max(0, toNumber(value.taxPrice)),
    totalOrderPrice: Math.max(
      0,
      toNumber(
        value.totalOrderPrice,
        cartItems.reduce((sum, item) => sum + item.price * item.count, 0),
      ),
    ),
    shippingAddress: {
      details: typeof address.details === "string" ? address.details : "",
      phone: typeof address.phone === "string" ? address.phone : "",
      city: typeof address.city === "string" ? address.city : "",
    },
    cartItems,
  };
}

function extractOrders(body: unknown): unknown[] | undefined {
  if (Array.isArray(body)) return body;
  if (!isRecord(body)) return undefined;
  if (Array.isArray(body.data)) return body.data;
  if (isRecord(body.data) && Array.isArray(body.data.data)) {
    return body.data.data;
  }
  if (Array.isArray(body.orders)) return body.orders;
  return undefined;
}

export async function getUserOrders(token: string): Promise<OrdersResult> {
  const userId = getUserIdFromApiToken(token);
  if (!userId) {
    return {
      ok: false,
      message: "Could not read your user ID from the session token.",
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/orders/user/${encodeURIComponent(userId)}`,
      {
        headers: { token },
        cache: "no-store",
      },
    );

    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : [];
    } catch {
      body = undefined;
    }

    if (
      !response.ok ||
      (isRecord(body) &&
        (body.statusMsg === "fail" || body.status === "error"))
    ) {
      return {
        ok: false,
        message:
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Could not load your orders. Please try again.",
      };
    }

    const orders = extractOrders(body);
    if (!orders) {
      return { ok: false, message: "The orders API returned an unexpected response." };
    }

    return {
      ok: true,
      orders: orders
        .map((order, index) => normalizeOrder(order, index))
        .filter((order): order is UserOrder => Boolean(order)),
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
