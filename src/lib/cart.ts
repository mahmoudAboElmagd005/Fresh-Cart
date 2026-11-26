import type { GuestCartItem } from "@/lib/guestCart";

export interface CartLine {
  productId: string;
  title: string;
  imageCover: string;
  category: string;
  price: number;
  count: number;
}

// Assumes the v2 cart response contains data.products with product/count/price.
export function normalizeCart(res: any): CartLine[] {
  const payload = res?.data?.data ?? res?.data ?? res;
  const products =
    payload?.products ?? payload?.cart?.products ?? res?.products ?? [];
  if (!Array.isArray(products)) return [];

  return products
    .map((item: any) => {
      const product = item?.product;
      const productId =
        typeof product === "string" ? product : (product?._id ?? product?.id);

      return {
        productId,
        title: product?.title ?? "Product",
        imageCover: product?.imageCover ?? "",
        category: product?.category?.name ?? "",
        price: Number(item?.price ?? product?.price ?? 0),
        count: Number(item?.count ?? 1),
      } as CartLine;
    })
    .filter((line: CartLine) => Boolean(line.productId));
}

export function guestToLines(items: GuestCartItem[]): CartLine[] {
  return items.map((item) => ({
    productId: item.productId,
    title: item.product.title,
    imageCover: item.product.imageCover,
    category: item.product.category?.name ?? "",
    price: item.price,
    count: item.count,
  }));
}
