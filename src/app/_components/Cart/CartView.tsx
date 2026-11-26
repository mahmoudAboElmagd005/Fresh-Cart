"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBoxOpen,
  FaCartShopping,
  FaCheck,
  FaLock,
  FaMinus,
  FaPlus,
  FaShieldHalved,
  FaTag,
  FaTrash,
  FaTruck,
  FaTruckFast,
} from "react-icons/fa6";
import {
  clearCart,
  removeCartItem,
  updateCartItem,
} from "@/app/_actions/cart.actions";
import {
  clearGuestCart,
  getGuestCart,
  removeGuestItem,
  updateGuestCount,
} from "@/lib/guestCart";
import { guestToLines, type CartLine } from "@/lib/cart";
import { FaArrowRight } from "react-icons/fa";
import { publishCartItemCount } from "@/lib/navbarCountEvents";

const popularCategories = [
  { name: "Electronics", href: "/products" },
  { name: "Fashion", href: "/products" },
  { name: "Home", href: "/products" },
  { name: "Beauty", href: "/products" },
];

// 0 = الشحن مجاني دايمًا (زي الديزاين الأصلي)
const FREE_SHIPPING_THRESHOLD = 500;

const fmt = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const failed = (res: any) =>
  res?.status === "error" || res?.status === "unauthenticated";

const itemsLabel = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;

// لو التدرج مختلف عن Figma انسخ الـ hex الدقيق وغيّره هنا
const SOFT_GRADIENT = "bg-linear-to-r from-[#f0fdf4] to-grey-96";
const BRAND_GRADIENT = "bg-linear-to-r from-spring-green-36 to-spring-green-29";

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-grey-98">
      <main className="mx-auto max-w-[1536px] animate-pulse px-4 py-8 font-exo">
        <div className="mb-8 h-5 w-52 rounded bg-grey-96" />
        <div className="mb-8 h-16 max-w-md rounded-xl bg-grey-96" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="h-52 rounded-2xl bg-grey-96" />
            ))}
          </div>
          <div className="h-96 rounded-2xl bg-grey-96" />
        </div>
      </main>
    </div>
  );
}

export default function CartView({
  initialItems,
}: {
  initialItems: CartLine[] | null;
}) {
  const isGuest = initialItems === null;
  const [items, setItems] = useState<CartLine[]>(initialItems ?? []);
  const [ready, setReady] = useState(!isGuest);
  const [busy, setBusy] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isGuest) {
      setItems(guestToLines(getGuestCart()));
      setReady(true);
    }
  }, [isGuest]);

  useEffect(() => {
    if (initialItems) setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (ready) {
      publishCartItemCount(
        items.reduce((total, item) => total + item.count, 0),
      );
    }
  }, [items, ready]);

  if (!ready) return <CartSkeleton />;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );
  const itemCount = items.length;
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = FREE_SHIPPING_THRESHOLD
    ? Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
    : 100;

  async function changeCount(line: CartLine, delta: number) {
    const nextCount = line.count + delta;
    if (nextCount < 1 || busy || clearing) return;

    const previousItems = items;
    setBusy(line.productId);
    setItems((current) =>
      current.map((item) =>
        item.productId === line.productId
          ? { ...item, count: nextCount }
          : item,
      ),
    );

    try {
      if (isGuest) {
        updateGuestCount(line.productId, nextCount);
      } else if (failed(await updateCartItem(line.productId, nextCount))) {
        setItems(previousItems);
      }
    } catch {
      setItems(previousItems);
    } finally {
      setBusy(null);
    }
  }

  async function removeItem(line: CartLine) {
    if (busy || clearing) return;

    const previousItems = items;
    setBusy(line.productId);
    setItems((current) =>
      current.filter((item) => item.productId !== line.productId),
    );

    try {
      if (isGuest) {
        removeGuestItem(line.productId);
      } else if (failed(await removeCartItem(line.productId))) {
        setItems(previousItems);
      }
    } catch {
      setItems(previousItems);
    } finally {
      setBusy(null);
    }
  }

  async function clearAll() {
    if (clearing || busy || items.length === 0) return;

    const previousItems = items;
    setClearing(true);
    setItems([]);

    try {
      if (isGuest) {
        clearGuestCart();
      } else if (failed(await clearCart())) {
        setItems(previousItems);
      }
    } catch {
      setItems(previousItems);
    } finally {
      setClearing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-16 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-x-6 -bottom-3 h-8 rounded-full bg-gray-100 blur-xl" />
          <div className="relative flex size-32 items-center justify-center rounded-full bg-gray-100">
            <FaBoxOpen aria-hidden="true" className="text-5xl text-gray-300" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-3 max-w-md text-base text-gray-500">
          Looks like you haven&apos;t added anything to your cart yet. Start
          exploring our products!
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-green-600 to-green-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-green-600/25 transition hover:brightness-95"
        >
          Start Shopping
          <FaArrowRight aria-hidden="true" />
        </Link>

        <div className="mt-10 w-full border-t border-gray-100 pt-8">
          <p className="mb-4 text-sm text-gray-400">Popular Categories</p>
          <div className="flex flex-wrap justify-center gap-3">
            {popularCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="rounded-full bg-gray-50 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-green-50 hover:text-green-700"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-98">
      <main className="mx-auto flex max-w-[1536px] flex-col gap-8 px-4 pb-20 pt-8 font-exo">
        {/* Breadcrumb + header */}
        <div className="flex flex-col gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Link
              href="/"
              className="text-azure-46 transition hover:text-spring-green-36"
            >
              Home
            </Link>
            <span className="text-azure-46" aria-hidden="true">
              /
            </span>
            <span className="text-gray-900">Shopping Cart</span>
          </nav>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${BRAND_GRADIENT} text-white`}
              >
                <FaCartShopping className="size-6" aria-hidden="true" />
              </span>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
            <p className="text-base font-medium text-azure-46">
              You have{" "}
              <span className="font-semibold text-spring-green-36">
                {itemsLabel(itemCount)}
              </span>{" "}
              in your cart
            </p>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_480px]">
          {/* Items */}
          <section
            aria-label="Cart items"
            className="flex min-w-0 flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {items.map((line) => {
                const isBusy = busy === line.productId || clearing;

                return (
                  <article
                    key={line.productId}
                    aria-busy={isBusy}
                    className="flex flex-col gap-6 rounded-2xl border border-grey-96 bg-white p-5 shadow-sm sm:flex-row"
                  >
                    {/* Image + In Stock */}
                    <div className="flex shrink-0 flex-col">
                      <div className="flex size-32 items-center justify-center overflow-hidden rounded-xl border border-grey-96 bg-linear-to-br from-grey-98 via-white to-grey-96 p-3">
                        {line.imageCover ? (
                          <Image
                            src={line.imageCover}
                            alt={line.title}
                            width={102}
                            height={102}
                            className="size-full object-contain"
                          />
                        ) : (
                          <FaBoxOpen
                            className="text-3xl text-azure-64"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1 self-end rounded-full bg-spring-green-39 px-2 py-0.5 text-[10px] font-semibold leading-4 text-white">
                        <FaCheck className="size-2" aria-hidden="true" />
                        In Stock
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex flex-col gap-2 pb-3">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900">
                          <Link
                            href={`/products/${line.productId}`}
                            className="transition-colors hover:text-spring-green-36 hover:underline"
                          >
                            {line.title}
                          </Link>
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                          {line.category && (
                            <>
                              <span
                                className={`rounded-full ${SOFT_GRADIENT} px-2.5 py-1 text-xs font-medium text-spring-green-29`}
                              >
                                {line.category}
                              </span>
                              <span
                                className="text-xs font-medium text-azure-64"
                                aria-hidden="true"
                              >
                                •
                              </span>
                            </>
                          )}
                          <span className="text-xs font-medium text-azure-46">
                            SKU: {line.productId.slice(-6).toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-2 pb-4">
                        <span className="text-lg font-bold leading-7 text-spring-green-36">
                          {fmt(line.price)} EGP
                        </span>
                        <span className="text-xs font-medium text-azure-64">
                          per unit
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Quantity stepper */}
                        <div className="flex items-center rounded-xl border border-grey-91 bg-grey-98 p-1">
                          <button
                            type="button"
                            aria-label={`Decrease ${line.title} quantity`}
                            disabled={
                              line.count <= 1 || isBusy || busy !== null
                            }
                            onClick={() => void changeCount(line, -1)}
                            className={`flex size-8 items-center justify-center rounded-lg bg-white text-azure-46 hover:bg-gray-100 shadow-sm transition disabled:cursor-not-allowed ${
                              line.count <= 1 ? "opacity-40 shadow-none" : ""
                            }`}
                          >
                            <FaMinus className="size-3" aria-hidden="true" />
                          </button>
                          <span className="w-12 text-center text-base font-bold text-gray-900">
                            {line.count}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase ${line.title} quantity`}
                            disabled={isBusy || busy !== null}
                            onClick={() => void changeCount(line, 1)}
                            className="flex size-8 items-center justify-center rounded-lg bg-spring-green-36 text-white shadow-sm shadow-spring-green-36/30 transition hover:bg-spring-green-29 disabled:cursor-not-allowed"
                          >
                            <FaPlus className="size-3" aria-hidden="true" />
                          </button>
                        </div>

                        {/* Total + delete */}
                        <div className="flex items-center gap-4">
                          <div className="flex min-w-16 flex-col items-end gap-0.5">
                            <span className="text-xs font-medium text-azure-64">
                              Total
                            </span>
                            <span className="flex items-baseline gap-1">
                              <span className="text-xl font-bold leading-7 text-gray-900">
                                {fmt(line.price * line.count)}
                              </span>
                              <span className="text-sm font-medium text-azure-64">
                                EGP
                              </span>
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${line.title} from cart`}
                            disabled={isBusy || busy !== null}
                            onClick={() => void removeItem(line)}
                            className="flex size-10 items-center justify-center rounded-xl border border-red-89 bg-grey-97 text-red-58 transition hover:bg-red-89/40 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaTrash className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grey-91 pt-6">
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-medium text-spring-green-36 transition hover:text-spring-green-29"
              >
                <span aria-hidden="true">←</span>
                Continue Shopping
              </Link>
              <button
                type="button"
                disabled={clearing || busy !== null}
                onClick={() => void clearAll()}
                className="flex items-center gap-2 text-sm font-medium text-azure-64 transition hover:text-red-58 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTrash className="size-3.5" aria-hidden="true" />
                Clear all items
              </button>
            </div>
          </section>

          {/* Order summary */}
          <aside className="overflow-hidden rounded-2xl border border-grey-96 bg-white shadow-sm lg:sticky lg:top-24">
            <div className={`flex flex-col gap-1 ${BRAND_GRADIENT} px-6 py-4`}>
              <div className="flex items-center gap-2 text-white">
                <FaCartShopping className="size-4" aria-hidden="true" />
                <h2 className="text-lg font-bold leading-7">Order Summary</h2>
              </div>
              <p className="text-sm font-medium text-grey-93">
                {itemsLabel(itemCount)} in your cart
              </p>
            </div>

            <div className="flex flex-col gap-5 p-6">
              {/* Free shipping box */}
              <div
                className={`flex items-center gap-3 rounded-xl ${hasFreeShipping ? SOFT_GRADIENT : "bg-gradient-to-r from-orange-50 to-amber-50"}  p-4`}
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full  ${hasFreeShipping ? "text-spring-green-33 bg-grey-93" : "text-orange-500"}   `}
                >
                  <FaTruck className="size-4" aria-hidden="true" />
                </span>
                {hasFreeShipping ? (
                  <div>
                    <p className="text-base font-semibold text-spring-green-25">
                      Free Shipping!
                    </p>
                    <p className="text-sm font-medium text-spring-green-33">
                      You qualify for free delivery
                    </p>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      Add {fmt(amountForFreeShipping)} EGP for free shipping
                    </p>
                    <div
                      role="progressbar"
                      aria-label="Progress toward free shipping"
                      aria-valuemin={0}
                      aria-valuemax={FREE_SHIPPING_THRESHOLD}
                      aria-valuenow={Math.min(
                        subtotal,
                        FREE_SHIPPING_THRESHOLD,
                      )}
                      className={`mt-2 h-2 overflow-hidden rounded-full  ${hasFreeShipping ? "bg-grey-93" : "bg-orange-100"} `}
                    >
                      <div
                        className={`h-full rounded-full ${hasFreeShipping ? BRAND_GRADIENT : "bg-gradient-to-r from-orange-400 to-amber-400"} transition-all duration-300`}
                        style={{ width: `${shippingProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-azure-34">
                    Subtotal
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    {fmt(subtotal)} EGP
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-azure-34">
                    Shipping
                  </span>
                  <span
                    className={`text-base font-medium ${
                      hasFreeShipping ? "text-spring-green-33" : "text-azure-46"
                    }`}
                  >
                    {hasFreeShipping ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-grey-91 pt-3">
                  <span className="text-base font-semibold text-gray-900">
                    {hasFreeShipping ? "Total" : "Total before shipping"}
                  </span>
                  <span className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold leading-8 text-gray-900">
                      {fmt(subtotal)}
                    </span>
                    <span className="text-sm font-medium text-azure-46">
                      EGP
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled
                title="Coming soon"
                className="flex items-center justify-center gap-2 rounded-xl border border-azure-84 py-3 text-sm font-medium text-azure-34 disabled:cursor-not-allowed"
              >
                <FaTag className="size-3.5" aria-hidden="true" />
                Apply Promo Code
              </button>

              <Link
                href={isGuest ? "/login" : "/checkout"}
                className={`flex items-center justify-center gap-3 rounded-xl ${BRAND_GRADIENT} px-6 py-4 text-base font-semibold text-white shadow-lg shadow-spring-green-36/20 transition hover:brightness-95`}
              >
                <FaLock className="size-4" aria-hidden="true" />
                {isGuest ? "Login to Checkout" : "Secure Checkout"}
              </Link>

              <div className="flex items-center justify-center gap-4 py-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-azure-46">
                  <FaShieldHalved
                    className="size-3.5 text-spring-green-39"
                    aria-hidden="true"
                  />
                  Secure Payment
                </span>
                <span className="h-4 w-px bg-grey-91" aria-hidden="true" />
                <span className="flex items-center gap-1.5 text-xs font-medium text-azure-46">
                  <FaTruckFast
                    className="size-3.5 text-azure-58"
                    aria-hidden="true"
                  />
                  Fast Delivery
                </span>
              </div>

              <Link
                href="/products"
                className="py-2 text-center text-sm font-medium text-spring-green-36 transition hover:text-spring-green-29"
              >
                ← Continue Shopping
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
