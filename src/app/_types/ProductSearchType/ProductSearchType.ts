import type { Product } from "@/app/_types/ProductType/ProductType";

export type ProductSort = "relevance" | "price" | "-price" | "-ratingsAverage";

export type ProductSearchFilters = {
  q: string;
  categories: string[];
  brands: string[];
  min: string;
  max: string;
  sort: ProductSort;
  page: number;
};

export type ProductSearchResult = {
  products: Product[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  error: boolean;
  clientSideBrandFallback: boolean;
};
