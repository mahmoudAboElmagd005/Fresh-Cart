"use server";

import { auth } from "@/auth";
import { getWishlist } from "@/APIs/services/wishlist.services";
import { normalizeCart } from "@/lib/cart";
import { getApiToken } from "@/lib/getApiToken";

export async function getNavbarSessionAction() {
  try {
    const session = await auth();
    return {
      isLoggedIn: Boolean(session),
      userName: session?.user?.name ?? null,
      userEmail: session?.user?.email ?? null,
    };
  } catch {
    return { isLoggedIn: false, userName: null, userEmail: null };
  }
}

export async function getNavbarCountsAction() {
  try {
    const token = await getApiToken();
    if (!token) return { cartCount: 0, wishlistCount: 0 };

    const [cartResponse, wishlistResult] = await Promise.all([
      fetch("https://ecommerce.routemisr.com/api/v2/cart", {
        headers: { token },
        cache: "no-store",
      }).then((response) => (response.ok ? response.json() : undefined)),
      getWishlist(token),
    ]);

    const cartCount =
      cartResponse
        ? normalizeCart({ status: "success", data: cartResponse }).reduce(
            (total, item) => total + item.count,
            0,
          )
        : 0;
    const wishlistCount =
      wishlistResult.ok &&
      "products" in wishlistResult &&
      Array.isArray(wishlistResult.products)
        ? wishlistResult.products.length
        : 0;

    return { cartCount, wishlistCount };
  } catch {
    return { cartCount: 0, wishlistCount: 0 };
  }
}
