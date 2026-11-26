"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCartShopping,
  FaHeart,
  FaRegHeart,
  FaSpinner,
  FaTrash,
} from "react-icons/fa6";
import { addProductToCart } from "@/app/_actions/addToCart.action";
import {
  getWishlistAction,
  removeWishlistProductAction,
} from "@/app/_actions/wishlist.actions";
import type { WishlistProduct } from "@/app/_types/WishlistType/WishlistType";
import {
  publishCartItemDelta,
  publishWishlistItemCount,
} from "@/lib/navbarCountEvents";
import { updateCachedWishlistProduct } from "@/lib/wishlistClientCache";
import { getGuestWishlist, removeGuestWishlistProduct } from "@/lib/guestWishlist";

function WishlistHeader({ count }: { count: number }) {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-[1536px] flex-col gap-4 px-4 py-8">
        <nav aria-label="Breadcrumb" className="text-sm font-medium text-[#697282]">
          <Link href="/" className="transition hover:text-[#101727]">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#101727]">Wishlist</span>
        </nav>
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xl text-red-500">
            <FaHeart aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#101727]">My Wishlist</h1>
            <p className="mt-1 text-sm text-[#697282]">
              {count} {count === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function StockBadge({ quantity }: { quantity?: number }) {
  const inStock = (quantity ?? 0) > 0;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${inStock ? "bg-green-50 text-[#008235]" : "bg-red-50 text-red-500"}`}>
      <span className={`size-2 rounded-full ${inStock ? "bg-[#00C850]" : "bg-red-500"}`} aria-hidden="true" />
      {inStock ? "In Stock" : "Out of Stock"}
    </span>
  );
}

function formatPrice(price?: number) {
  return `${(price ?? 0).toLocaleString("en-EG")} EGP`;
}

function WishlistRow({
  product,
  removing,
  adding,
  onRemove,
  onAddToCart,
}: {
  product: WishlistProduct;
  removing: boolean;
  adding: boolean;
  onRemove: (product: WishlistProduct) => void;
  onAddToCart: (product: WishlistProduct) => void;
}) {
  const title = product.title || "Product";
  const inStock = (product.quantity ?? 0) > 0;
  const hasDiscount =
    typeof product.priceAfterDiscount === "number" &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < (product.price ?? 0);
  const image = product.imageCover;

  return (
    <article className="grid gap-5 border-b border-gray-100 px-4 py-5 last:border-b-0 md:grid-cols-[minmax(0,2fr)_minmax(110px,0.8fr)_minmax(120px,0.8fr)_minmax(210px,1fr)] md:items-center md:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          {image ? (
            <Image src={image} alt={title} fill sizes="80px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-gray-300"><FaRegHeart aria-hidden="true" /></span>
          )}
        </div>
        <div className="min-w-0">
          <Link href={`/products/${product._id}`} className="line-clamp-2 text-base font-medium text-[#101727] transition hover:text-green-700">
            {title}
          </Link>
          <p className="mt-1 truncate text-sm text-[#99A1AE]">{product.category?.name || "Uncategorized"}</p>
        </div>
      </div>

      <div className="md:text-center">
        <p className="text-xs font-medium text-[#697282] md:hidden">Price</p>
        <p className="font-semibold text-[#101727]">
          {formatPrice(hasDiscount ? product.priceAfterDiscount : product.price)}
        </p>
        {hasDiscount && <p className="text-sm text-[#99A1AE] line-through">{formatPrice(product.price)}</p>}
      </div>

      <div className="md:text-center">
        <p className="mb-2 text-xs font-medium text-[#697282] md:hidden">Status</p>
        <StockBadge quantity={product.quantity} />
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          disabled={!inStock || adding || removing}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none"
        >
          {adding ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaCartShopping aria-hidden="true" />}
          {adding ? "Adding..." : "Add to Cart"}
        </button>
        <button
          type="button"
          aria-label={`Remove ${title} from wishlist`}
          onClick={() => onRemove(product)}
          disabled={removing || adding}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-[#697282] transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {removing ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaTrash aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}

function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
        <FaRegHeart aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-[#101727]">Your wishlist is empty</h2>
      <p className="mt-2 text-sm text-[#697282]">Save items you love and they will show up here.</p>
      <Link href="/products" className="mt-6 rounded-xl bg-linear-273 from-green-600 via-green-500 to-green-400 px-6 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition hover:brightness-95">
        Browse Products
      </Link>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-gray-100" aria-label="Loading wishlist">
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-4"><div className="size-20 rounded-xl bg-gray-100" /><div className="flex flex-col gap-2"><div className="h-4 w-52 rounded bg-gray-100" /><div className="h-3 w-28 rounded bg-gray-100" /></div></div>
          <div className="h-5 w-24 rounded bg-gray-100" /><div className="h-7 w-24 rounded-full bg-gray-100" /><div className="h-10 w-40 rounded-lg bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function WishlistManager() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addingIds, setAddingIds] = useState<Set<string>>(new Set());

  const loadWishlist = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getWishlistAction();
      if (result.status !== "success") {
        if (result.status === "unauthenticated") {
          setProducts(getGuestWishlist());
        }
        else setError(result.message);
        return;
      }
      setProducts(result.products ?? []);
    } catch {
      setError("Could not load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWishlist();
  }, [loadWishlist]);

  useEffect(() => {
    if (!loading && !error) publishWishlistItemCount(products.length);
  }, [error, loading, products.length]);

  async function removeProduct(product: WishlistProduct) {
    if (removingIds.has(product._id)) return;
    const previousProducts = products;
    const restoreProduct = () => {
      setProducts((current) => {
        if (current.some((item) => item._id === product._id)) return current;
        const previousIndex = previousProducts.findIndex(
          (item) => item._id === product._id,
        );
        const next = [...current];
        next.splice(Math.min(previousIndex, next.length), 0, product);
        return next;
      });
    };
    setProducts((current) => current.filter((item) => item._id !== product._id));
    setRemovingIds((current) => new Set(current).add(product._id));

    try {
      const result = await removeWishlistProductAction(product._id);
      if (result.status === "unauthenticated") {
        removeGuestWishlistProduct(product._id);
        updateCachedWishlistProduct(product._id, false);
      } else if (result.status === "error") {
        restoreProduct();
        toast.error(result.message);
        return;
      }
      if (result.status === "success") {
        updateCachedWishlistProduct(product._id, false);
      }
      toast.success(result.message || "Removed from wishlist");
    } catch {
      restoreProduct();
      toast.error("Could not remove this item. Please try again.");
    } finally {
      setRemovingIds((current) => {
        const next = new Set(current);
        next.delete(product._id);
        return next;
      });
    }
  }

  async function addToCart(product: WishlistProduct) {
    if (addingIds.has(product._id) || (product.quantity ?? 0) < 1) return;
    setAddingIds((current) => new Set(current).add(product._id));
    try {
      const result = await addProductToCart(product._id);
      if (result.status === "success") {
        publishCartItemDelta(1);
        toast.success("message" in result && typeof result.message === "string" ? result.message : "Added to cart");
      } else if (result.status === "guest") {
        toast.info("Sign in to add items to your cart.");
      } else {
        toast.error("message" in result ? result.message : "Could not add this item to cart.");
      }
    } catch {
      toast.error("Could not add this item to cart. Please try again.");
    } finally {
      setAddingIds((current) => {
        const next = new Set(current);
        next.delete(product._id);
        return next;
      });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16">
      <WishlistHeader count={products.length} />
      <div className="mx-auto flex max-w-[1536px] flex-col gap-6 px-4 py-8">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {!loading && !error && products.length > 0 && (
            <div className="hidden grid-cols-[minmax(0,2fr)_minmax(110px,0.8fr)_minmax(120px,0.8fr)_minmax(210px,1fr)] border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-[#697282] md:grid">
              <span>Product</span><span className="text-center">Price</span><span className="text-center">Status</span><span className="text-right">Actions</span>
            </div>
          )}
          {loading ? <WishlistSkeleton /> : error ? (
            <div role="alert" className="px-6 py-14 text-center">
              <p className="font-medium text-red-600">{error}</p>
              <button type="button" onClick={() => void loadWishlist()} className="mt-4 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700">Retry</button>
            </div>
          ) : products.length === 0 ? <WishlistEmptyState /> : (
            products.map((product) => (
              <WishlistRow
                key={product._id}
                product={product}
                removing={removingIds.has(product._id)}
                adding={addingIds.has(product._id)}
                onRemove={removeProduct}
                onAddToCart={addToCart}
              />
            ))
          )}
        </section>
        <Link href="/products" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#697282] transition hover:text-[#101727]">
          <FaArrowLeft aria-hidden="true" /> Continue Shopping
        </Link>
      </div>
    </main>
  );
}
