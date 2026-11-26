"use server";

import { revalidatePath } from "next/cache";
import { getApiToken } from "@/lib/getApiToken";

type GuestCartEntry = { productId: string; count: number };

async function readResponse(res: Response) {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function mergeGuestCart(items: GuestCartEntry[]) {
  const apiToken = await getApiToken();
  if (!apiToken) {
    return { status: "error", message: "You must be logged in" };
  }
  if (!Array.isArray(items)) {
    return { status: "error", message: "Invalid cart items" };
  }

  for (const item of items) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !item.productId ||
      !Number.isInteger(item.count) ||
      item.count < 1
    ) {
      continue;
    }

    try {
      const addRes = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
        method: "POST",
        headers: {
          token: apiToken,
          "content-type": "application/json",
        },
        body: JSON.stringify({ productId: item.productId }),
        cache: "no-store",
      });
      const addData = await readResponse(addRes);

      if (!addRes.ok || addData?.statusMsg === "fail") continue;

      if (item.count > 1) {
        await fetch(
          `https://ecommerce.routemisr.com/api/v2/cart/${encodeURIComponent(item.productId)}`,
          {
            method: "PUT",
            headers: {
              token: apiToken,
              "content-type": "application/json",
            },
            body: JSON.stringify({ count: item.count }),
            cache: "no-store",
          },
        );
      }
    } catch {
      // Keep merging the remaining guest cart items after an individual failure.
    }
  }

  revalidatePath("/", "layout");
  return { status: "success" };
}
