import { Suspense } from "react";
import { getAllCategories } from "@/APIs/services/Subcategories.service";
import { getAllBrands } from "@/APIs/services/brands.service/brands.service";
import { searchProducts } from "@/APIs/services/products-search.service";
import type { ProductSearchFilters } from "@/app/_types/ProductSearchType/ProductSearchType";
import { getWishlist } from "@/APIs/services/wishlist.services";
import ProductsSearchClient from "@/app/_components/ProductsSearch/ProductsSearchClient";
import SearchLoading from "./loading";
import { getApiToken } from "@/lib/getApiToken";

type SearchValue = string | string[] | undefined;

function listValue(value: SearchValue): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.flatMap((entry) => entry.split(",")).map((entry) => entry.trim()).filter(Boolean);
}

function scalarValue(value: SearchValue): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseFilters(params: Record<string, SearchValue>): ProductSearchFilters {
  const requestedSort = scalarValue(params.sort);
  const sort: ProductSearchFilters["sort"] = ["price", "-price", "-ratingsAverage"].includes(requestedSort)
    ? requestedSort as ProductSearchFilters["sort"]
    : "relevance";
  const requestedPage = Number(scalarValue(params.page));

  return {
    q: scalarValue(params.q).trim(),
    categories: listValue(params.category),
    brands: listValue(params.brand),
    min: scalarValue(params.min),
    max: scalarValue(params.max),
    sort,
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
}

function filterKey(filters: ProductSearchFilters, view: string) {
  const key = new URLSearchParams();
  if (filters.q) key.set("q", filters.q);
  if (filters.categories.length) key.set("category", filters.categories.join(","));
  if (filters.brands.length) key.set("brand", filters.brands.join(","));
  if (filters.min) key.set("min", filters.min);
  if (filters.max) key.set("max", filters.max);
  if (filters.sort !== "relevance") key.set("sort", filters.sort);
  if (filters.page > 1) key.set("page", String(filters.page));
  if (view === "list") key.set("view", view);
  return key.toString();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, SearchValue>>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const token = await getApiToken();
  const [categories, brands, products, wishlistResult] = await Promise.all([
    getAllCategories(),
    getAllBrands(100),
    searchProducts(filters),
    token ? getWishlist(token) : Promise.resolve(undefined),
  ]);
  const wishlistIds = wishlistResult?.ok && "products" in wishlistResult && Array.isArray(wishlistResult.products)
    ? wishlistResult.products.map((product) => product._id)
    : [];
  const view = scalarValue(params.view) === "list" ? "list" : "grid";

  return (
    <Suspense fallback={<SearchLoading />}>
      <ProductsSearchClient
        loadedKey={filterKey(filters, view)}
        initialProducts={products}
        categories={categories}
        brands={brands}
        wishlistIds={wishlistIds}
      />
    </Suspense>
  );
}
