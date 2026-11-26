import type {
  Product,
  ProductDetails,
  ProductDetailsResponse,
  ProductsResponse,
} from "@/app/_types/ProductType/ProductType";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/products";
const REVALIDATE = 3600; // ثانية

export async function getAllProducts(
  categoryId?: string,
  brandId?: string,
): Promise<Product[]> {
  try {
    const url = new URL(BASE_URL);
    if (categoryId) url.searchParams.set("category[in]", categoryId);
    if (brandId) url.searchParams.set("brand", brandId);

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const data: ProductsResponse = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getProduct(
  id: string,
): Promise<ProductDetails | undefined> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return undefined;
    const json: ProductDetailsResponse = await res.json();
    return json.data;
  } catch {
    return undefined;
  }
}

export async function getRelated(
  categoryId: string,
  currentId: string,
): Promise<Product[]> {
  try {
    const url = new URL(BASE_URL);
    url.searchParams.set("category[in]", categoryId);

    const res = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json: ProductsResponse = await res.json();
    return (json.data ?? []).filter((p) => p._id !== currentId).slice(0, 10);
  } catch {
    return [];
  }
}
