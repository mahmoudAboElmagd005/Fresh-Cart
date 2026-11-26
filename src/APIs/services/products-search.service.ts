import "server-only";

import type { Product, ProductsResponse } from "@/app/_types/ProductType/ProductType";
import type { ProductSearchFilters, ProductSearchResult } from "@/app/_types/ProductSearchType/ProductSearchType";

export const PRODUCTS_PER_PAGE = 12;

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

function normalizeProduct(value: unknown): Product | undefined {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as Record<string, unknown>;
  if (typeof raw._id !== "string" || typeof raw.title !== "string") return undefined;
  const category = raw.category && typeof raw.category === "object"
    ? raw.category as Record<string, unknown>
    : {};
  const brand = raw.brand && typeof raw.brand === "object"
    ? raw.brand as Record<string, unknown>
    : {};
  const number = (item: unknown, fallback = 0) => {
    const parsed = Number(item);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return {
    ...(raw as unknown as Product),
    _id: raw._id,
    id: typeof raw.id === "string" ? raw.id : raw._id,
    title: raw.title,
    slug: typeof raw.slug === "string" ? raw.slug : raw._id,
    description: typeof raw.description === "string" ? raw.description : "",
    quantity: number(raw.quantity),
    price: number(raw.price),
    priceAfterDiscount: number(raw.priceAfterDiscount, 0) || undefined,
    sold: number(raw.sold),
    imageCover: typeof raw.imageCover === "string" ? raw.imageCover : "",
    images: Array.isArray(raw.images) ? raw.images.filter((image): image is string => typeof image === "string") : [],
    ratingsAverage: number(raw.ratingsAverage),
    ratingsQuantity: number(raw.ratingsQuantity),
    category: {
      _id: typeof category._id === "string" ? category._id : "",
      name: typeof category.name === "string" ? category.name : "Other",
      slug: typeof category.slug === "string" ? category.slug : "",
      image: typeof category.image === "string" ? category.image : "",
    },
    subcategory: Array.isArray(raw.subcategory) ? raw.subcategory as Product["subcategory"] : [],
    brand: {
      _id: typeof brand._id === "string" ? brand._id : "",
      name: typeof brand.name === "string" ? brand.name : "Other",
      slug: typeof brand.slug === "string" ? brand.slug : "",
      image: typeof brand.image === "string" ? brand.image : "",
    },
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : "",
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : "",
  };
}

function emptyResult(page: number): ProductSearchResult {
  return {
    products: [],
    totalResults: 0,
    currentPage: page,
    totalPages: 0,
    error: true,
    clientSideBrandFallback: false,
  };
}

export async function searchProducts(
  filters: ProductSearchFilters,
): Promise<ProductSearchResult> {
  const multiBrandFallback = filters.brands.length > 1;
  const url = new URL(`${BASE_URL}/products`);
  url.searchParams.set("limit", String(multiBrandFallback ? 1000 : PRODUCTS_PER_PAGE));

  if (!multiBrandFallback) url.searchParams.set("page", String(filters.page));
  if (filters.q.trim()) url.searchParams.set("keyword", filters.q.trim());
  if (filters.categories.length) {
    url.searchParams.set("category[in]", filters.categories.join(","));
  }
  if (filters.brands.length === 1) url.searchParams.set("brand", filters.brands[0]);
  if (filters.min !== "" && Number.isFinite(Number(filters.min))) {
    url.searchParams.set("price[gte]", filters.min);
  }
  if (filters.max !== "" && Number.isFinite(Number(filters.max))) {
    url.searchParams.set("price[lte]", filters.max);
  }
  if (filters.sort !== "relevance" && !multiBrandFallback) {
    url.searchParams.set("sort", filters.sort);
  }

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return emptyResult(filters.page);
    const body = (await response.json()) as ProductsResponse;
    if (!Array.isArray(body.data)) return emptyResult(filters.page);

    let products = body.data
      .map(normalizeProduct)
      .filter((product): product is Product => Boolean(product));

    if (multiBrandFallback) {
      const brandIds = new Set(filters.brands);
      products = products.filter((product) => brandIds.has(product.brand._id));
      if (filters.sort !== "relevance") {
        products.sort((a, b) => {
          if (filters.sort === "price") return a.price - b.price;
          if (filters.sort === "-price") return b.price - a.price;
          return b.ratingsAverage - a.ratingsAverage;
        });
      }
      const totalResults = products.length;
      const totalPages = Math.ceil(totalResults / PRODUCTS_PER_PAGE);
      const start = (filters.page - 1) * PRODUCTS_PER_PAGE;
      products = products.slice(start, start + PRODUCTS_PER_PAGE);
      return {
        products,
        totalResults,
        currentPage: filters.page,
        totalPages,
        error: false,
        clientSideBrandFallback: true,
      };
    }

    const totalResults = Number(body.results) || products.length;
    const totalPages =
      Number(body.metadata?.numberOfPages) ||
      Math.ceil(totalResults / PRODUCTS_PER_PAGE);

    return {
      products,
      totalResults,
      currentPage: Number(body.metadata?.currentPage) || filters.page,
      totalPages,
      error: false,
      clientSideBrandFallback: false,
    };
  } catch {
    return emptyResult(filters.page);
  }
}
