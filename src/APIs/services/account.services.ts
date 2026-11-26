import "server-only";
import type { AccountAddress } from "@/app/_types/AccountType/AccountType";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

type ApiResult<T> =
  | { ok: true; message: string; data: T; raw: unknown }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

async function request<T>(
  path: string,
  token: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        token,
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
      cache: "no-store",
    });

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
        ok: false,
        message:
          isRecord(body) && typeof body.message === "string"
            ? body.message
            : "Request failed. Please try again.",
      };
    }

    return {
      ok: true,
      message:
        isRecord(body) && typeof body.message === "string"
          ? body.message
          : "Request completed successfully",
      data: (isRecord(body) && "data" in body ? body.data : body) as T,
      raw: body,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

function normalizeAddresses(value: unknown): AccountAddress[] | undefined {
  const candidates = isRecord(value)
    ? [value.addresses, value.data, value]
    : [value];
  const list = candidates.find(Array.isArray);
  if (!Array.isArray(list)) return undefined;

  return list
    .filter(
      (address): address is Record<string, any> =>
        isRecord(address) && typeof address._id === "string",
    )
    .map((address) => ({
      _id: address._id,
      name: typeof address.name === "string" ? address.name : "Address",
      details: typeof address.details === "string" ? address.details : "",
      phone: typeof address.phone === "string" ? address.phone : "",
      city: typeof address.city === "string" ? address.city : "",
    }));
}

export async function getAddresses(token: string) {
  const result = await request<unknown>("/addresses", token);
  if (!result.ok) return result;

  const addresses = normalizeAddresses(result.data);
  if (!addresses) {
    return { ok: false as const, message: "Unexpected addresses response" };
  }

  return { ...result, data: addresses };
}

export async function addAddress(
  token: string,
  body: { name: string; details: string; phone: string; city: string },
) {
  return request<unknown>("/addresses", token, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function removeAddress(token: string, addressId: string) {
  return request<unknown>(`/addresses/${encodeURIComponent(addressId)}`, token, {
    method: "DELETE",
  });
}

export async function updateProfile(
  token: string,
  body: { name: string; email: string; phone: string },
) {
  return request<unknown>("/users/updateMe/", token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function changePassword(
  token: string,
  body: { currentPassword: string; password: string; rePassword: string },
) {
  return request<unknown>("/users/changeMyPassword", token, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
