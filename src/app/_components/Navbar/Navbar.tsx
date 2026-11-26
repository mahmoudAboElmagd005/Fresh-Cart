"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getNavbarCountsAction } from "@/app/_actions/navbar.actions";
import { getGuestCart } from "@/lib/guestCart";
import {
  applyCountUpdate,
  CART_COUNT_EVENT,
  WISHLIST_COUNT_EVENT,
} from "@/lib/navbarCountEvents";
import { FaRegUserCircle } from "react-icons/fa";
import {
  FaTruck,
  FaGift,
  FaPhone,
  FaRegEnvelope,
  FaRegUser,
  FaUserPlus,
  FaMagnifyingGlass,
  FaChevronDown,
  FaHeadset,
  FaRegHeart,
  FaCartShopping,
  FaBars,
  FaRegAddressCard,
  FaXmark,
  FaBoxOpen,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";

function TopBar({
  userName,
  isLoggedIn,
}: {
  userName: string | null;
  isLoggedIn: boolean;
}) {
  return (
    <div className="font-exo hidden border-b border-[#f3f4f6] lg:block">
      <div className="container mx-auto">
        <div className="flex h-10 items-center justify-between  text-sm font-medium">
          <div className="flex items-center gap-6 text-[#6a7282]">
            <span className="flex items-center gap-2">
              <FaTruck className="text-[#16A34A]" aria-hidden="true" />
              Free Shipping on Orders 500 EGP
            </span>
            <span className="flex items-center gap-2">
              <FaGift className="text-[#16A34A]" aria-hidden="true" />
              New Arrivals Daily
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#6a7282]">
              <a
                href="tel:+18001234567"
                className="flex items-center gap-1.5 transition-all hover:text-[#16A34A]"
              >
                <FaPhone aria-hidden="true" />
                +1 (800) 123-4567
              </a>
              <a
                href="mailto:support@freshcart.com"
                className="flex items-center gap-1.5 transition-all hover:text-[#16A34A]"
              >
                <FaRegEnvelope aria-hidden="true" />
                support@freshcart.com
              </a>
            </div>
            <span className="h-4 w-px bg-[#e5e7eb]" />
            {isLoggedIn ? (
              <div className="flex items-center gap-4 text-[#4a5565]">
                <a
                  href="/account/settings"
                  className="flex items-center gap-1.5 transition-all hover:text-[#16A34A]"
                >
                  <FaRegUser aria-hidden="true" />
                  {userName}
                </a>
                <button
                  onClick={() => signOut({ redirectTo: "/login" })}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg
                    data-prefix="fas"
                    data-icon="right-from-bracket"
                    className="svg-inline--fa fa-right-from-bracket size-4"
                    role="img"
                    viewBox="0 0 512 512"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M505 273c9.4-9.4 9.4-24.6 0-33.9L361 95c-6.9-6.9-17.2-8.9-26.2-5.2S320 102.3 320 112l0 80-112 0c-26.5 0-48 21.5-48 48l0 32c0 26.5 21.5 48 48 48l112 0 0 80c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2L505 273zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
                    />
                  </svg>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-[#4a5565]">
                <a
                  href="/login"
                  className="flex items-center gap-1.5 transition-all hover:text-[#16A34A]"
                >
                  <FaRegUser aria-hidden="true" />
                  Sign In
                </a>

                <a
                  href="/register"
                  className="flex items-center gap-1.5 transition-all hover:text-[#16A34A]"
                >
                  <FaUserPlus aria-hidden="true" />
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchForm() {
  return (
    <form
      action="/search"
      className="font-exo relative flex min-w-0 flex-1 justify-center"
    >
      <input
        type="search"
        name="q"
        placeholder="Search for products, brands and more..."
        className="h-12 w-full rounded-full border border-[#e5e7eb] bg-[#f9fafb]/50 py-3 pl-5 pr-14 text-sm text-[#364153] outline-none transition-all placeholder:text-[#364153]/50 focus:border-[#16a34a] focus:outline-2 focus:outline-[#16a34a]"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-[6px] top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#16a34a] text-white"
      >
        <FaMagnifyingGlass className="text-sm" aria-hidden="true" />
      </button>
    </form>
  );
}

const categories = [
  { name: "All Categories", href: "/categories" },
  { name: "Electronics", href: "/categories/6439d2d167d9aa4ca970649f" },
  { name: "Women's Fashion", href: "/categories/6439d58a0049ad0b52b9003f" },
  { name: "Men's Fashion", href: "/categories/6439d5b90049ad0b52b90048" },
  { name: "Beauty & Health", href: "/categories/6439d30b67d9aa4ca97064b1" },
];

const linkClass = "py-2 transition-colors hover:text-[#16a34a] ";
function CountBadge({
  count,
  bg = "bg-[#16a34a]",
  loading = false,
}: {
  count: number;
  bg?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <span
        aria-hidden="true"
        className="absolute -right-0.5 -top-0.5 size-5 animate-pulse rounded-full bg-gray-200 ring-2 ring-white"
      />
    );
  }
  if (count <= 0) return null;
  return (
    <span
      className={`absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full ${bg} px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

function AccountDropdown({
  userName,
  userEmail,
}: {
  userName: string | null;
  userEmail: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const menuLinks = [
    { href: "/account/settings", label: "My Profile", Icon: FaRegUser },
    { href: "/orders", label: "My Orders", Icon: FaBoxOpen },
    { href: "/wishlist", label: "My Wishlist", Icon: FaRegHeart },
    { href: "/account/addresses", label: "Addresses", Icon: FaRegAddressCard },
    { href: "/account/settings", label: "Settings", Icon: FaGear },
  ];

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={`group relative flex size-11 items-center justify-center rounded-full text-gray-500 transition-colors ${isOpen ? "bg-gray-100 " : "  hover:bg-gray-100 hover:text-[#16A34A]"}`}
      >
        <FaRegUserCircle aria-hidden="true" className="text-xl" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[60] w-64 pt-3">
          <div
            role="menu"
            aria-label="Account menu"
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_32px_rgba(16,23,39,0.16)]"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-lg text-[#16A34A]">
                <FaRegUserCircle aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[#354152]">
                  {userName || "My Account"}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[#99A1AE]">
                  {userEmail || ""}
                </span>
              </span>
            </div>

            <nav aria-label="Account" className="py-2">
              {menuLinks.map(({ href, label, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#495565] transition-colors hover:bg-[#F8FAFB] hover:text-[#16A34A]"
                >
                  <Icon aria-hidden="true" className="w-4 text-[#99A1AE]" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-100 p-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  void signOut({ redirectTo: "/login" });
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
              >
                <FaRightFromBracket aria-hidden="true" className="w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DesktopBar({
  userName,
  userEmail,
  isLoggedIn,
  cartCount,
  wishlistCount,
  countsLoading,
}: {
  userName: string | null;
  userEmail: string | null;
  isLoggedIn: boolean;
  cartCount: number;
  wishlistCount: number;
  countsLoading: boolean;
}) {
  return (
    <div className="font-exo sticky top-0 z-40 hidden bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] lg:block">
      <div className="container mx-auto">
        <div className="flex h-[72px] items-center gap-8 ">
          <a href="/" aria-label="FreshCart home" className="shrink-0">
            <img
              src="/figma-navbar/logo-desktop.svg"
              alt="FreshCart"
              className="h-8 w-[165.16px]"
            />
          </a>

          <SearchForm />

          <nav
            aria-label="Main navigation"
            className="hidden shrink-0 items-center gap-6 text-base font-medium text-[#364153] xl:flex"
          >
            <Link href="/" className={linkClass}>
              Home
            </Link>
            <Link href="/products" className={linkClass}>
              Shop
            </Link>

            {/* Categories + dropdown */}
            <div className="group relative">
              <Link
                href="/categories"
                className={`${linkClass} flex items-center gap-1.5 group-hover:text-[#16a34a]`}
              >
                Categories
                <FaChevronDown
                  className="text-[10px] transition-transform duration-200 group-hover:rotate-180"
                  aria-hidden="true"
                />
              </Link>

              <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <ul className="w-56 rounded-2xl border border-[#f3f4f6] bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                  {categories.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="block rounded-xl px-4 py-2.5 text-[15px] text-[#4a5565] transition-colors hover:bg-[#f0fdf4] hover:text-[#16a34a]"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/brands" className={linkClass}>
              Brands
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a]">
                <FaHeadset aria-hidden="true" />
              </span>
              <span className="text-xs leading-4">
                <span className="block text-[#99a1af]">Support</span>
                <span className="block font-semibold text-[#364153]">
                  24/7 Help
                </span>
              </span>
            </Link>
            <Link
              href="/wishlist"
              aria-label={
                countsLoading
                  ? "Wishlist, loading count"
                  : `Wishlist, ${wishlistCount} items`
              }
              className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 hover:text-[#16a34a] text-gray-500 "
            >
              <FaRegHeart aria-hidden="true" className="text-xl " />
              <CountBadge
                count={wishlistCount}
                bg="bg-red-500"
                loading={countsLoading}
              />
            </Link>
            <Link
              href="/cart"
              aria-label={
                countsLoading
                  ? "Cart, loading count"
                  : `Cart, ${cartCount} items`
              }
              className="group relative rounded-full p-2.5 transition-colors hover:bg-gray-100 hover:text-[#16a34a] text-gray-500 "
            >
              <FaCartShopping aria-hidden="true" className="text-xl " />
              <CountBadge count={cartCount} loading={countsLoading} />
            </Link>
            {isLoggedIn ? (
              <AccountDropdown userName={userName} userEmail={userEmail} />
            ) : (
              <Link
                href="/login"
                className="ml-2 hidden items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green-600/20 transition-colors hover:bg-green-700 lg:flex"
              >
                <FaRegUser className="text-xs" aria-hidden="true" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function MobileBar({
  userName,
  isLoggedIn,
  cartCount,
  wishlistCount,
  countsLoading,
}: {
  userName: string | null;
  isLoggedIn: boolean;
  cartCount: number;
  wishlistCount: number;
  countsLoading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  // قفل السكرول لما الـ drawer مفتوح + إغلاق بزرار Escape
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-x-0 bg-white z-50  font-exo lg:hidden">
      {/* الشريط العلوي */}
      <div className="sticky inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <Link href="/" aria-label="FreshCart home">
          <img
            src="/figma-navbar/logo.svg"
            alt="FreshCart"
            className="h-6 w-[123.87px]"
          />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/wishlist"
            aria-label={
              countsLoading
                ? "Wishlist, loading count"
                : `Wishlist, ${wishlistCount} items`
            }
            className="relative p-2.5 rounded-full hover:bg-gray-100 hover:text-[#16A34A] transition-colors group  text-gray-500"
          >
            <FaRegHeart
              aria-hidden="true"
              className="
            svg-inline--fa fa-heart text-xl  group-hover:text-primary-600 transition-colors"
            />
            <CountBadge count={wishlistCount} loading={countsLoading} />
          </Link>
          <Link
            href="/cart"
            aria-label={
              countsLoading ? "Cart, loading count" : `Cart, ${cartCount} items`
            }
            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors group  text-gray-500 hover:text-[#16A34A]"
          >
            <FaCartShopping
              aria-hidden="true"
              className="
            svg-inline--fa fa-heart text-xl  group-hover:text-primary-600 transition-colors"
            />
            <CountBadge count={cartCount} loading={countsLoading} />
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="ml-1 flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#16a34a] text-white"
          >
            <FaBars aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-[320px] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl transition-all duration-300 ${
          isOpen
            ? "visible translate-x-0 opacity-100"
            : "invisible translate-x-full opacity-0"
        }`}
      >
        {/* الهيدر */}
        <div className="flex h-[73px] shrink-0 items-center justify-between border-b border-[#f3f4f6] px-4">
          <Link href="/" onClick={close} aria-label="FreshCart home">
            <img
              src="/figma-navbar/logo.svg"
              alt="FreshCart"
              className="h-6 w-[123.87px]"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#f3f4f6] text-[#4a5565] transition-colors hover:bg-[#e5e7eb]"
          >
            <FaXmark aria-hidden="true" />
          </button>
        </div>

        {/* البحث */}
        <form
          action="/products"
          onSubmit={close}
          className="relative border-b border-[#f3f4f6] p-4"
        >
          <input
            type="search"
            name="search"
            placeholder="Search products..."
            className="h-11 w-full rounded-full border border-[#e5e7eb] bg-[#f9fafb] pl-4 pr-12 text-sm text-[#364153] outline-none transition-all placeholder:text-[#99a1af] focus:border-[#16a34a]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#16a34a] text-white"
          >
            <FaMagnifyingGlass className="text-xs" aria-hidden="true" />
          </button>
        </form>

        {/* لينكات التنقل */}
        <nav className="border-b border-[#f3f4f6] px-4 py-3">
          <ul className="flex flex-col text-base font-medium text-[#364153]">
            {[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/products" },
              { name: "Categories", href: "/categories" },
              { name: "Brands", href: "/brands" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={close}
                  className="block px-4 py-3.5 transition-colors hover:text-[#16a34a]"
                >
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wishlist + Cart */}
        <div className="flex flex-col gap-1 border-b border-[#f3f4f6] px-4 py-3">
          <Link
            href="/wishlist"
            onClick={close}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-[#364153] transition-colors hover:bg-[#f9fafb]"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#fef2f2] text-red-500">
              <FaRegHeart aria-hidden="true" />
            </span>
            <span className="flex-1">Wishlist</span>
            {countsLoading ? (
              <span
                aria-hidden="true"
                className="h-3 w-6 animate-pulse rounded bg-gray-200"
              />
            ) : (
              wishlistCount > 0 && (
                <span className="text-sm font-bold text-[#16A34A]">
                  {wishlistCount}
                </span>
              )
            )}
          </Link>
          <Link
            href="/cart"
            onClick={close}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium text-[#364153] transition-colors hover:bg-[#f9fafb]"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-[#f0fdf4] text-[#16a34a]">
              <FaCartShopping aria-hidden="true" />
            </span>
            <span className="flex-1">Cart</span>
            {countsLoading ? (
              <span
                aria-hidden="true"
                className="h-3 w-6 animate-pulse rounded bg-gray-200"
              />
            ) : (
              cartCount > 0 && (
                <span className="text-sm font-bold text-[#16A34A]">
                  {cartCount}
                </span>
              )
            )}
          </Link>
        </div>

        {/* Sign In / Sign Up */}

        {isLoggedIn ? (
          <div className="p-4">
            <a
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f0fdf4] transition-colors"
              href="/account/settings"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  data-prefix="far"
                  data-icon="user"
                  className="svg-inline--fa fa-user text-gray-500 size-4"
                  role="img"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700">{userName}</span>
            </a>
            <button
              onClick={() => signOut({ redirectTo: "/login" })}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors w-full text-left"
            >
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  data-prefix="fas"
                  data-icon="right-from-bracket"
                  className="svg-inline--fa fa-right-from-bracket text-red-500 size-4"
                  role="img"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M505 273c9.4-9.4 9.4-24.6 0-33.9L361 95c-6.9-6.9-17.2-8.9-26.2-5.2S320 102.3 320 112l0 80-112 0c-26.5 0-48 21.5-48 48l0 32c0 26.5 21.5 48 48 48l112 0 0 80c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2L505 273zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
                  />
                </svg>
              </div>
              <span className="font-medium text-red-600">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 border-b border-[#f3f4f6] p-4">
            <Link
              href="/login"
              onClick={close}
              className="flex h-12 items-center justify-center rounded-xl bg-[#16a34a] font-semibold text-white transition-colors hover:bg-[#15803d]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={close}
              className="flex h-12 items-center justify-center rounded-xl border-2 border-[#16a34a] font-semibold text-[#16a34a] transition-colors hover:bg-[#f0fdf4]"
            >
              Sign Up
            </Link>
          </div>
        )}

        {/* Need Help */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
              <FaHeadset aria-hidden="true" />
            </span>
            <div className="text-sm leading-5">
              <p className="font-semibold text-[#364153]">Need Help?</p>
              <Link
                href="/contact"
                onClick={close}
                className="font-medium text-[#16a34a] hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
export default function Navbar({
  isLoggedIn,
  userName,
  userEmail,
}: {
  isLoggedIn: boolean;
  userName: string | null;
  userEmail: string | null;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [countsLoading, setCountsLoading] = useState(isLoggedIn);

  useEffect(() => {
    const onCartCount = (event: Event) => {
      const update = (event as CustomEvent<{ count?: number; delta?: number }>)
        .detail;
      setCartCount((current) => applyCountUpdate(current, update));
    };
    const onWishlistCount = (event: Event) => {
      const update = (event as CustomEvent<{ count?: number; delta?: number }>)
        .detail;
      setWishlistCount((current) => applyCountUpdate(current, update));
    };
    const onStorage = (event: StorageEvent) => {
      if (!isLoggedIn && event.key === "guestCart") {
        const count = getGuestCart().reduce(
          (total, item) => total + item.count,
          0,
        );
        setCartCount(count);
      }
    };

    let cancelled = false;
    if (isLoggedIn) {
      setCountsLoading(true);
      void getNavbarCountsAction().then((counts) => {
        if (cancelled) return;
        setCartCount(counts.cartCount);
        setWishlistCount(counts.wishlistCount);
        setCountsLoading(false);
      });
    } else {
      setCountsLoading(false);
      setCartCount(
        getGuestCart().reduce((total, item) => total + item.count, 0),
      );
    }
    window.addEventListener(CART_COUNT_EVENT, onCartCount);
    window.addEventListener(WISHLIST_COUNT_EVENT, onWishlistCount);
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener(CART_COUNT_EVENT, onCartCount);
      window.removeEventListener(WISHLIST_COUNT_EVENT, onWishlistCount);
      window.removeEventListener("storage", onStorage);
    };
  }, [isLoggedIn]);

  return (
    <>
      <TopBar userName={userName} isLoggedIn={isLoggedIn} />
      <DesktopBar
        userName={userName}
        userEmail={userEmail}
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        countsLoading={countsLoading}
      />
      <MobileBar
        userName={userName}
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        countsLoading={countsLoading}
      />
    </>
  );
}
