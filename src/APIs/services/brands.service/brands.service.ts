// APIs/services/brands.service.ts
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export async function getAllBrands(limit?: number): Promise<Brand[]> {
  try {
    const url = new URL("https://ecommerce.routemisr.com/api/v1/brands");
    if (limit !== undefined) url.searchParams.set("limit", String(limit));
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function getBrandById(id: string): Promise<Brand | null> {
  try {
    const res = await fetch(
      `https://ecommerce.routemisr.com/api/v1/brands/${encodeURIComponent(id)}`,
      { cache: "force-cache" },
    );
    if (!res.ok) return null;
    const data: { data?: Brand } = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}
