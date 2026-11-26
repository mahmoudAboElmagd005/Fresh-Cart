"use server";

import { getUserOrders } from "@/APIs/services/orders.service";
import { getApiToken } from "@/lib/getApiToken";

export async function getUserOrdersAction() {
  const token = await getApiToken();
  if (!token) {
    return { status: "unauthenticated" as const, message: "Please sign in to view your orders." };
  }

  const result = await getUserOrders(token);
  if (!result.ok) return { status: "error" as const, message: result.message };
  return { status: "success" as const, orders: result.orders };
}
