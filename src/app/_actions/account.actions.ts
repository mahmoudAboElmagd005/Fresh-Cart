"use server";

import { revalidatePath } from "next/cache";
import { changePassword, getAddresses, addAddress, removeAddress, updateProfile } from "@/APIs/services/account.services";
import { addressSchema, passwordChangeSchema, profileSchema } from "@/app/_schemas/account.schema";
import { getApiToken } from "@/lib/getApiToken";
import { updateAuthToken } from "@/lib/updateAuthToken";

type ActionFailure = {
  status: "error" | "unauthenticated";
  message: string;
};

function apiTokenFailure(): ActionFailure {
  return { status: "unauthenticated", message: "Please sign in to continue." };
}

export async function getAddressesAction() {
  const token = await getApiToken();
  if (!token) return apiTokenFailure();

  const result = await getAddresses(token);
  if (!result.ok) return { status: "error" as const, message: result.message };
  return { status: "success" as const, message: result.message, addresses: result.data };
}

export async function addAddressAction(input: unknown) {
  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "Invalid address" };
  }

  const token = await getApiToken();
  if (!token) return apiTokenFailure();

  const result = await addAddress(token, parsed.data);
  if (!result.ok) return { status: "error" as const, message: result.message };
  revalidatePath("/account/addresses");
  return { status: "success" as const, message: result.message };
}

export async function removeAddressAction(addressId: string) {
  if (typeof addressId !== "string" || !addressId.trim()) {
    return { status: "error" as const, message: "Invalid address" };
  }

  const token = await getApiToken();
  if (!token) return apiTokenFailure();

  const result = await removeAddress(token, addressId);
  if (!result.ok) return { status: "error" as const, message: result.message };
  revalidatePath("/account/addresses");
  return { status: "success" as const, message: result.message };
}

export async function updateProfileAction(input: unknown) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "Invalid profile" };
  }

  const token = await getApiToken();
  if (!token) return apiTokenFailure();

  const result = await updateProfile(token, parsed.data);
  if (!result.ok) return { status: "error" as const, message: result.message };

  await updateAuthToken({ name: parsed.data.name, email: parsed.data.email });
  revalidatePath("/account/settings");
  return { status: "success" as const, message: result.message };
}

function readNewApiToken(raw: unknown): string | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const response = raw as { token?: unknown; data?: unknown };
  if (typeof response.token === "string") return response.token;
  if (response.data && typeof response.data === "object") {
    const data = response.data as { token?: unknown; data?: unknown };
    if (typeof data.token === "string") return data.token;
    if (data.data && typeof data.data === "object") {
      const nested = data.data as { token?: unknown };
      if (typeof nested.token === "string") return nested.token;
    }
  }
  return undefined;
}

export async function changePasswordAction(input: unknown) {
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error" as const, message: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  const token = await getApiToken();
  if (!token) return apiTokenFailure();

  const result = await changePassword(token, parsed.data);
  if (!result.ok) return { status: "error" as const, message: result.message };

  const newApiToken = readNewApiToken(result.raw);
  if (!newApiToken || !(await updateAuthToken({ apiToken: newApiToken }))) {
    return {
      status: "warning" as const,
      message: "Password changed, but the session could not be refreshed. Please sign in again.",
    };
  }

  revalidatePath("/account/settings");
  return { status: "success" as const, message: result.message };
}
