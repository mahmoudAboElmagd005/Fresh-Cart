"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaCheck,
  FaCartShopping,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaHeart,
  FaList,
  FaMagnifyingGlass,
  FaRegHeart,
  FaRotate,
  FaSliders,
  FaSpinner,
  FaStar,
  FaStarHalfStroke,
  FaRegStar,
  FaTableCellsLarge,
} from "react-icons/fa6";
import type { Brand, Category, Product } from "@/app/_types/ProductType/ProductType";
import type { ProductSearchFilters, ProductSearchResult } from "@/app/_types/ProductSearchType/ProductSearchType";
import { addProductToCart } from "@/app/_actions/addToCart.action";
import { addWishlistProductAction, removeWishlistProductAction } from "@/app/_actions/wishlist.actions";
import { addToGuestCart } from "@/lib/guestCart";
import { publishCartItemDelta, publishWishlistItemDelta } from "@/lib/navbarCountEvents";
import { updateCachedWishlistProduct } from "@/lib/wishlistClientCache";
import ProductImage from "@/app/_components/ProductImage/ProductImage";

type View = "grid" | "list";

function valueList(params: URLSearchParams, key: string) {
  return params.getAll(key).flatMap((value) => value.split(",")).filter(Boolean);
}

function filtersFromParams(params: URLSearchParams): ProductSearchFilters {
  const sortValue = params.get("sort") ?? "relevance";
  const sort: ProductSearchFilters["sort"] = ["price", "-price", "-ratingsAverage"].includes(sortValue)
    ? sortValue as ProductSearchFilters["sort"]
    : "relevance";
  const page = Number(params.get("page"));

  return {
    q: params.get("q")?.trim() ?? "",
    categories: valueList(params, "category"),
    brands: valueList(params, "brand"),
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
    sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

function stateKey(filters: ProductSearchFilters, view: View) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categories.length) params.set("category", filters.categories.join(","));
  if (filters.brands.length) params.set("brand", filters.brands.join(","));
  if (filters.min) params.set("min", filters.min);
  if (filters.max) params.set("max", filters.max);
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (view === "list") params.set("view", "list");
  return params.toString();
}

function formatPrice(price: number) {
  return `${price.toLocaleString("en-US")} EGP`;
}

function SearchHeader({
  q,
  onChange,
  onSearch,
}: {
  q: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="border-b border-[#F2F4F6] bg-white">
      <div className="mx-auto flex max-w-[1536px] flex-col gap-4 px-4 py-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium">
          <Link href="/" className="text-[#697282] hover:text-[#16A34A]">Home</Link>
          <span aria-hidden="true" className="text-[#D0D5DB]">/</span>
          <span className="text-[#101727]">Search Results</span>
        </nav>
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch(new FormData(event.currentTarget).get("q")?.toString() ?? "");
          }}
          className="relative w-full max-w-2xl"
        >
          <FaMagnifyingGlass aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
          <input
            type="search"
            name="q"
            value={q}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Search for products..."
            aria-label="Search for products"
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3.5 pl-12 pr-4 text-lg font-medium text-[#354152] placeholder:text-[#354152]/50 focus:border-[#16A34A] focus:outline-none focus:ring-4 focus:ring-[#16A34A]/10"
          />
        </form>
      </div>
    </header>
  );
}

function FilterCheckboxList({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: Array<{ _id: string; name: string }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <section>
      <h2 className="mb-4 text-base font-bold text-[#101727]">{title}</h2>
      <div className="max-h-52 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => {
          const checked = selected.includes(item._id);
          const id = `${title.toLowerCase()}-${item._id}`;
          return (
            <label key={item._id} htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-[#495565]">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item._id)}
                className="size-4 shrink-0 appearance-none rounded-[2px] border border-[#767676] bg-white checked:border-[#16A34A] checked:bg-[#16A34A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16A34A]"
              />
              <span className="relative -ml-[26px] grid size-4 shrink-0 place-items-center text-[10px] text-white" aria-hidden="true">{checked ? "✓" : ""}</span>
              <span>{item.name}</span>
            </label>
          );
        })}
        {items.length === 0 && <p className="text-sm text-[#697282]">No {title.toLowerCase()} available.</p>}
      </div>
    </section>
  );
}

function PriceRangeFilter({
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  onQuickSelect,
}: {
  max: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onQuickSelect: (value: string) => void;
}) {
  const quickOptions = [
    { label: "Under 500", value: "500" },
    { label: "Under 1K", value: "1000" },
    { label: "Under 5K", value: "5000" },
    { label: "Under 10K", value: "10000" },
  ];

  return (
    <section>
      <h2 className="mb-4 text-base font-bold text-[#101727]">Price Range</h2>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs font-medium text-[#697282]">
          Min (EGP)
          <input type="number" min="0" value={minValue} onChange={(event) => onMinChange(event.target.value)} placeholder="0" className="mt-1 h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm font-medium text-[#354152] placeholder:text-[#354152]/50 focus:border-[#16A34A] focus:outline-none" />
        </label>
        <label className="text-xs font-medium text-[#697282]">
          Max (EGP)
          <input type="number" min="0" value={maxValue} onChange={(event) => onMaxChange(event.target.value)} placeholder="No limit" className="mt-1 h-9 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm font-medium text-[#354152] placeholder:text-[#354152]/50 focus:border-[#16A34A] focus:outline-none" />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {quickOptions.map((option) => {
          const active = max === option.value;
          return (
            <button key={option.value} type="button" onClick={() => onQuickSelect(option.value)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${active ? "bg-[#16A34A] text-white" : "bg-[#F2F4F6] text-[#495565] hover:bg-[#DCFCE7]"}`}>
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FiltersSidebar({
  categories,
  brands,
  filters,
  minValue,
  maxValue,
  onToggleCategory,
  onToggleBrand,
  onMinChange,
  onMaxChange,
  onQuickSelect,
  onClear,
  isActive,
}: {
  categories: Category[];
  brands: Brand[];
  filters: ProductSearchFilters;
  minValue: string;
  maxValue: string;
  onToggleCategory: (id: string) => void;
  onToggleBrand: (id: string) => void;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  onQuickSelect: (value: string) => void;
  onClear: () => void;
  isActive: boolean;
}) {
  return (
    <aside className="sticky top-24 self-start rounded-2xl border border-[#F2F4F6] bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#101727]">Filters</h2>
        {isActive && <button type="button" onClick={onClear} className="text-sm font-medium text-[#16A34A] hover:underline">Clear filters</button>}
      </div>
      <div className="flex flex-col gap-6">
        <FilterCheckboxList title="Categories" items={categories} selected={filters.categories} onToggle={onToggleCategory} />
        <div className="border-t border-[#F2F4F6]" />
        <PriceRangeFilter max={filters.max} minValue={minValue} maxValue={maxValue} onMinChange={onMinChange} onMaxChange={onMaxChange} onQuickSelect={onQuickSelect} />
        <div className="border-t border-[#F2F4F6]" />
        <FilterCheckboxList title="Brands" items={brands} selected={filters.brands} onToggle={onToggleBrand} />
      </div>
    </aside>
  );
}

function ProductsToolbar({
  view,
  sort,
  onView,
  onSort,
  onToggleFilters,
}: {
  view: View;
  sort: ProductSearchFilters["sort"];
  onView: (view: View) => void;
  onSort: (sort: ProductSearchFilters["sort"]) => void;
  onToggleFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onToggleFilters} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#354152] lg:hidden"><FaSliders aria-hidden="true" />Filters</button>
        <div className="flex gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1">
          <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => onView("grid")} className={`grid size-9 place-items-center rounded-md ${view === "grid" ? "bg-[#16A34A] text-white" : "text-[#697282] hover:bg-gray-50"}`}><FaTableCellsLarge aria-hidden="true" /></button>
          <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => onView("list")} className={`grid size-9 place-items-center rounded-md ${view === "list" ? "bg-[#16A34A] text-white" : "text-[#697282] hover:bg-gray-50"}`}><FaList aria-hidden="true" /></button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-[#697282]">
        <span>Sort by:</span>
        <span className="relative">
          <select aria-label="Sort by" value={sort} onChange={(event) => onSort(event.target.value as ProductSearchFilters["sort"])} className="appearance-none rounded-lg border border-[#E5E7EB] bg-white py-2 pl-4 pr-9 text-sm font-medium text-[#354152] focus:border-[#16A34A] focus:outline-none">
            <option value="relevance">Relevance</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratingsAverage">Top Rated</option>
          </select>
          <FaChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#495565]" />
        </span>
      </label>
    </div>
  );
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Rated ${rating} out of 5 by ${count} customers`}>
      <span className="flex gap-0.5 text-[#FBC700]" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => rating >= star - 0.25
          ? <FaStar key={star} />
          : rating >= star - 0.75
            ? <FaStarHalfStroke key={star} />
            : <FaRegStar key={star} className="text-[#E5E7EB]" />)}
      </span>
      <span className="text-xs font-medium text-[#697282]">{rating.toFixed(1)} ({count})</span>
    </div>
  );
}

function WishlistButton({
  productId,
  initialWishlisted,
}: {
  productId: string;
  initialWishlisted: boolean;
}) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  useEffect(() => setWishlisted(initialWishlisted), [initialWishlisted]);

  async function toggle() {
    if (loading) return;
    const previous = wishlisted;
    setWishlisted(!previous);
    setLoading(true);
    try {
      const result = previous
        ? await removeWishlistProductAction(productId)
        : await addWishlistProductAction(productId);
      if (result.status === "unauthenticated") {
        setWishlisted(previous);
        router.push("/login");
      } else if (result.status === "error") {
        setWishlisted(previous);
        toast.error(result.message);
      } else {
        updateCachedWishlistProduct(productId, !previous);
        publishWishlistItemDelta(previous ? -1 : 1);
        toast.success(result.message);
        router.refresh();
      }
    } catch {
      setWishlisted(previous);
      toast.error("Could not update your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wishlisted} disabled={loading} onClick={() => void toggle()} className="grid size-8 place-items-center rounded-full bg-white text-sm text-[#495565] shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-colors hover:text-[#FA2B36] disabled:opacity-60">
      {loading ? <FaSpinner className="animate-spin" aria-hidden="true" /> : wishlisted ? <FaHeart className="text-[#FA2B36]" aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
    </button>
  );
}

function AddToCartButton({ product, view }: { product: Product; view: View }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outOfStock = product.quantity <= 0;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function add() {
    if (loading || outOfStock) return;
    setLoading(true);
    try {
      const result = await addProductToCart(product._id, 1);
      if (result.status === "guest") addToGuestCart(result.item);
      if (result.status === "success" || result.status === "guest") {
        publishCartItemDelta(1);
        toast.success(result.message || "Added to cart");
        setAdded(true);
        timer.current = setTimeout(() => setAdded(false), 1600);
      } else if (result.status === "unauthenticated") {
        router.push("/login");
      } else {
        toast.error(result.message || "Could not add this product to cart.");
      }
    } catch {
      toast.error("Could not add this product to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" aria-label={`Add ${product.title} to cart`} disabled={loading || outOfStock} onClick={() => void add()} className={`inline-flex shrink-0 items-center justify-center gap-2 bg-[#16A34A] text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 ${view === "list" ? "rounded-lg px-4 py-2.5 text-sm font-semibold" : "size-10 rounded-full"}`}>
      {loading ? <FaSpinner className="animate-spin" aria-hidden="true" /> : added ? <FaCheck aria-hidden="true" /> : <FaCartShopping aria-hidden="true" />}
      {view === "list" && "Add to Cart"}
    </button>
  );
}

function ProductCard({
  product,
  view,
  wishlisted,
}: {
  product: Product;
  view: View;
  wishlisted: boolean;
}) {
  const hasDiscount = Boolean(product.priceAfterDiscount && product.priceAfterDiscount < product.price);
  const finalPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const discount = hasDiscount ? Math.round((product.price - finalPrice) / product.price * 100) : 0;
  const imageSize = view === "list" ? "h-60 w-full sm:h-48 sm:w-48" : "h-60 w-full";

  return (
    <article className={`relative flex h-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white font-exo transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${view === "list" ? "flex-col sm:flex-row" : "flex-col"}`}>
      <div className={`relative shrink-0 ${imageSize}`}>
        <Link href={`/products/${product._id}`} aria-label={`View ${product.title}`} className="absolute inset-0">
          <ProductImage src={product.imageCover} alt={product.title} fill sizes={view === "list" ? "(max-width: 640px) 100vw, 192px" : "(max-width: 1280px) 50vw, 25vw"} className="object-contain p-3" />
        </Link>
        {hasDiscount && <span className="absolute left-3 top-3 z-10 rounded-sm bg-[#FA2B36] px-2 py-1 text-xs font-medium text-white">-{discount}%</span>}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <WishlistButton productId={product._id} initialWishlisted={wishlisted} />
          <Link href={`/products/${product._id}`} aria-label={`View ${product.title}`} className="grid size-8 place-items-center rounded-full bg-white text-sm text-[#495565] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:text-[#16A34A]"><FaEye aria-hidden="true" /></Link>
          <button type="button" aria-label="Compare" onClick={() => toast.info("Coming soon")} className="grid size-8 place-items-center rounded-full bg-white text-sm text-[#495565] shadow-[0_1px_3px_rgba(0,0,0,0.1)] hover:text-[#16A34A]"><FaRotate aria-hidden="true" /></button>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-medium leading-4 text-[#697282]">{product.category.name}</p>
        <Link href={`/products/${product._id}`} className="line-clamp-2 min-h-12 text-base font-medium leading-6 text-[#354152] hover:text-[#16A34A]">{product.title}</Link>
        <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className={`text-lg font-bold ${hasDiscount ? "text-[#16A34A]" : "text-[#1D2838]"}`}>{formatPrice(finalPrice)}</span>
            {hasDiscount && <span className="text-sm font-medium text-[#697282] line-through">{formatPrice(product.price)}</span>}
          </div>
          <AddToCartButton product={product} view={view} />
        </div>
      </div>
    </article>
  );
}

function ProductCardSkeleton({ view }: { view: View }) {
  return (
    <div className={`animate-pulse overflow-hidden rounded-lg border border-[#E5E7EB] bg-white font-exo ${view === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"}`}>
      <div className={`relative shrink-0 bg-white ${view === "list" ? "h-60 w-full sm:h-48 sm:w-48" : "h-60 w-full"}`}>
        <div className="absolute left-3 top-3 h-6 w-12 rounded-sm bg-gray-100" />
        <div className="absolute right-3 top-3 flex flex-col gap-2"><div className="size-8 rounded-full bg-gray-100" /><div className="size-8 rounded-full bg-gray-100" /><div className="size-8 rounded-full bg-gray-100" /></div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="h-3 w-20 rounded bg-gray-100" />
        <div className="h-6 w-4/5 rounded bg-gray-100" />
        <div className="mt-1 h-4 w-28 rounded bg-gray-100" />
        <div className="mt-auto flex items-center justify-between pt-2"><div className="h-6 w-24 rounded bg-gray-100" /><div className="size-10 rounded-full bg-gray-100" /></div>
      </div>
    </div>
  );
}

function ProductGrid({ products, view, wishlistIds }: { products: Product[]; view: View; wishlistIds: string[] }) {
  if (view === "list") {
    return <div className="flex flex-col gap-4">{products.map((product) => <ProductCard key={product._id} product={product} view={view} wishlisted={wishlistIds.includes(product._id)} />)}</div>;
  }
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} view={view} wishlisted={wishlistIds.includes(product._id)} />)}</div>;
}

function Pagination({ currentPage, totalPages, onPage }: { currentPage: number; totalPages: number; onPage: (page: number) => void }) {
  if (totalPages <= 1) return null;
  let pages: number[];
  if (totalPages <= 5) pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  else if (currentPage <= 3) pages = [1, 2, 3, 4, totalPages];
  else if (currentPage >= totalPages - 2) pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  else pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2 pt-4">
      <button type="button" aria-label="Previous page" disabled={currentPage <= 1} onClick={() => onPage(currentPage - 1)} className="grid size-10 place-items-center rounded-lg border border-[#E5E7EB] text-[#495565] disabled:opacity-50"><FaChevronLeft /></button>
      {pages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-[#697282]" aria-hidden="true">…</span>}
          <button type="button" aria-current={page === currentPage ? "page" : undefined} onClick={() => onPage(page)} className={`grid size-10 place-items-center rounded-lg text-base font-medium ${page === currentPage ? "bg-[#16A34A] text-white" : "border border-[#E5E7EB] text-[#495565] hover:bg-gray-50"}`}>{page}</button>
        </span>
      ))}
      <button type="button" aria-label="Next page" disabled={currentPage >= totalPages} onClick={() => onPage(currentPage + 1)} className="grid size-10 place-items-center rounded-lg border border-[#E5E7EB] text-[#495565] disabled:opacity-50"><FaChevronRight /></button>
    </nav>
  );
}

function EmptyResults({ onClear }: { onClear: () => void }) {
  return <div className="rounded-2xl border border-[#F2F4F6] bg-white px-6 py-14 text-center"><div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-[#F2F4F6] text-2xl text-[#99A1AE]"><FaBoxOpen /></div><h2 className="text-xl font-bold text-[#101727]">No products found</h2><p className="mt-2 text-sm text-[#697282]">Try adjusting your search or filters.</p><button type="button" onClick={onClear} className="mt-5 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white">Clear filters</button></div>;
}

export default function ProductsSearchClient({
  loadedKey: initialLoadedKey,
  initialProducts,
  categories,
  brands,
  wishlistIds,
}: {
  loadedKey: string;
  initialProducts: ProductSearchResult;
  categories: Category[];
  brands: Brand[];
  wishlistIds: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);
  const filters = filtersFromParams(currentParams);
  const view: View = currentParams.get("view") === "list" ? "list" : "grid";
  const currentKey = stateKey(filters, view);
  const [result, setResult] = useState(initialProducts);
  const [loadedKey, setLoadedKey] = useState(initialLoadedKey);
  const [searchValue, setSearchValue] = useState(filters.q);
  const [minValue, setMinValue] = useState(filters.min);
  const [maxValue, setMaxValue] = useState(filters.max);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [, startTransition] = useTransition();
  const resultRef = useRef<HTMLElement>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priceDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPageRef = useRef(filters.page);

  useEffect(() => {
    setResult(initialProducts);
    setLoadedKey(initialLoadedKey);
  }, [initialProducts, initialLoadedKey]);

  useEffect(() => {
    setSearchValue(filters.q);
  }, [filters.q]);

  useEffect(() => {
    setMinValue(filters.min);
    setMaxValue(filters.max);
  }, [filters.min, filters.max]);

  const updateParams = useCallback((changes: Record<string, string | null>, resetPage = true, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    if (resetPage && !("page" in changes)) params.set("page", "1");
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    startTransition(() => replace ? router.replace(href, { scroll: false }) : router.push(href, { scroll: false }));
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (searchValue === filters.q) return;
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => updateParams({ q: searchValue || null }), 500);
    return () => { if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current); };
  }, [searchValue, filters.q, updateParams]);

  useEffect(() => {
    if (minValue === filters.min && maxValue === filters.max) return;
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    priceDebounceRef.current = setTimeout(() => updateParams({ min: minValue || null, max: maxValue || null }), 500);
    return () => { if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current); };
  }, [minValue, maxValue, filters.min, filters.max, updateParams]);

  useEffect(() => {
    if (filters.page !== lastPageRef.current) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      lastPageRef.current = filters.page;
    }
  }, [filters.page]);

  const loading = currentKey !== loadedKey;
  const hasActiveFilters = Boolean(filters.q || filters.categories.length || filters.brands.length || filters.min || filters.max || filters.sort !== "relevance");

  function toggleValue(key: "category" | "brand", selected: string[], id: string) {
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    updateParams({ [key]: next.length ? next.join(",") : null });
  }

  function setView(nextView: View) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextView === "grid") params.delete("view");
    else params.set("view", "list");
    const query = params.toString();
    window.history.pushState(null, "", query ? `${pathname}?${query}` : pathname);
    setLoadedKey(stateKey(filters, nextView));
  }

  function clearFilters() {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (priceDebounceRef.current) clearTimeout(priceDebounceRef.current);
    updateParams({ q: null, category: null, brand: null, min: null, max: null, sort: null, page: null, view: null }, false);
    setSearchValue("");
    setMinValue("");
    setMaxValue("");
  }

  function changePage(page: number) {
    updateParams({ page: String(page) }, false);
  }

  const gridContent = loading
    ? <div className={view === "grid" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>{Array.from({ length: 12 }, (_, index) => <ProductCardSkeleton key={index} view={view} />)}</div>
    : result.error
      ? <div role="alert" className="rounded-2xl border border-[#F2F4F6] bg-white px-6 py-12 text-center"><p className="font-semibold text-[#101727]">We couldn&apos;t load products.</p><button type="button" onClick={() => router.refresh()} className="mt-4 rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-semibold text-white">Try again</button></div>
      : result.products.length === 0
        ? <EmptyResults onClear={clearFilters} />
        : <ProductGrid products={result.products} view={view} wishlistIds={wishlistIds} />;

  return (
    <div className="min-h-screen bg-[#F8FAFB]/50 pb-8 font-exo">
      <SearchHeader q={searchValue} onChange={setSearchValue} onSearch={(value) => {
        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
        setSearchValue(value.trim());
        updateParams({ q: value.trim() || null });
      }} />
      <main className="mx-auto max-w-[1536px] px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <div className={`${filtersOpen ? "block" : "hidden"} w-full lg:block lg:w-64 lg:shrink-0`}>
            <FiltersSidebar
              categories={categories}
              brands={brands}
              filters={filters}
              minValue={minValue}
              maxValue={maxValue}
              onToggleCategory={(id) => toggleValue("category", filters.categories, id)}
              onToggleBrand={(id) => toggleValue("brand", filters.brands, id)}
              onMinChange={setMinValue}
              onMaxChange={setMaxValue}
              onQuickSelect={(value) => {
                const next = filters.max === value ? "" : value;
                setMaxValue(next);
                updateParams({ max: next || null });
              }}
              onClear={clearFilters}
              isActive={hasActiveFilters}
            />
          </div>
          <section ref={resultRef} id="products-results" className="min-w-0 flex-1 scroll-mt-24">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-[#101727]">Search Results</h1>
                <p className="mt-1 text-sm font-medium text-[#697282]">{loading ? "Finding products…" : `Showing ${result.totalResults.toLocaleString("en-US")} products`}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <ProductsToolbar
                view={view}
                sort={filters.sort}
                onView={setView}
                onSort={(sort) => updateParams({ sort: sort === "relevance" ? null : sort })}
                onToggleFilters={() => setFiltersOpen((open) => !open)}
              />
              {gridContent}
              {!loading && !result.error && result.products.length > 0 && <Pagination currentPage={result.currentPage} totalPages={result.totalPages} onPage={changePage} />}
              {result.clientSideBrandFallback && <p className="text-xs text-[#697282]">Multiple-brand selection uses a client-side fallback after fetching up to 1,000 matching products.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
