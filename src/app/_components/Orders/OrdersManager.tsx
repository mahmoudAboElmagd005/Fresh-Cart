"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaBox,
  FaCalendarDays,
  FaChevronDown,
  FaChevronUp,
  FaCircleCheck,
  FaClock,
  FaHashtag,
  FaLocationDot,
  FaPhone,
  FaReceipt,
  FaTruckFast,
} from "react-icons/fa6";
import { getUserOrdersAction } from "@/app/_actions/orders.actions";
import type { OrderItem, UserOrder } from "@/app/_types/OrderType/OrderType";

type LoadState = "loading" | "error" | "empty" | "ready";

const currency = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function money(value: number) {
  return currency.format(value);
}

function quantity(order: UserOrder) {
  return order.cartItems.reduce((sum, item) => sum + item.count, 0);
}

function statusOf(order: UserOrder) {
  if (order.isDelivered) return "delivered" as const;
  if (order.isPaid) return "on-the-way" as const;
  return "processing" as const;
}

function dateLabel(value: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function OrdersHeader({ count }: { count: number }) {
  return (
    <header className="mb-8 flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="transition hover:text-green-700">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-gray-900">My Orders</span>
        </nav>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-305 from-green-500 to-green-600 text-xl text-white shadow-lg shadow-green-500/25"><FaBoxOpen aria-hidden="true" /></span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#101727]">My Orders</h1>
            <p className="mt-1 text-sm font-medium text-[#697282]">Track and manage your {count} {count === 1 ? "order" : "orders"}</p>
          </div>
        </div>
        <Link href="/products" className="inline-flex items-center justify-center gap-2 self-start rounded-xl px-4 py-2 text-sm font-medium text-[#16A34A] transition hover:bg-[#DCFCE7] sm:self-auto">
          <FaArrowLeft aria-hidden="true" className="text-xs" /> Continue Shopping
        </Link>
      </div>
    </header>
  );
}

function OrderStatusBadge({ order }: { order: UserOrder }) {
  const status = statusOf(order);
  const config = {
      processing: {
      label: "Processing",
      Icon: FaClock,
      badge: "bg-[#FEF3C6] text-[#E17100]",
    },
    "on-the-way": {
      label: "On the way",
      Icon: FaTruckFast,
      badge: "bg-[#DCFCE7] text-[#155CFB]",
    },
    delivered: {
      label: "Delivered",
      Icon: FaCircleCheck,
      badge: "bg-[#DCFCE7] text-[#16A34A]",
    },
  }[status];
  const { Icon } = config;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${config.badge}`}>
      <Icon aria-hidden="true" />
      {config.label}
    </span>
  );
}

function OrderItemRow({ item }: { item: OrderItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-linear-305 from-gray-50 to-white ring-1 ring-gray-100">
        {item.imageCover ? (
          <Image src={item.imageCover} alt={item.title} fill sizes="64px" className="object-contain p-1" />
        ) : (
          <FaBoxOpen aria-hidden="true" className="text-xl text-gray-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p dir="auto" className="line-clamp-2 text-sm font-semibold text-gray-900">{item.title}</p>
      <p className="mt-1 text-sm font-medium text-[#697282]">{item.count} × {money(item.price)} EGP</p>
      </div>
      <p className="shrink-0 text-right text-lg font-bold text-[#101727]">{money(item.price * item.count)}<small className="block text-xs font-medium text-[#99A1AE]">EGP</small></p>
    </div>
  );
}

function DeliveryAddressCard({ order }: { order: UserOrder }) {
  return (
    <section className="rounded-xl border border-[#F2F4F6] bg-white p-4 sm:p-5" aria-label="Delivery address">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span className="grid size-6 place-items-center rounded-lg bg-[#DCFCE7] text-xs text-[#155CFB]"><FaLocationDot aria-hidden="true" /></span> Delivery Address
      </h3>
      <div className="space-y-2 text-sm font-medium text-[#495565]">
        {order.shippingAddress.city && <p dir="auto" className="text-base text-[#101727]">{order.shippingAddress.city}</p>}
        {order.shippingAddress.details && <p dir="auto">{order.shippingAddress.details}</p>}
        {order.shippingAddress.phone && (
          <p dir="auto" className="flex items-center gap-2"><FaPhone aria-hidden="true" className="text-xs text-[#99A1AE]" />{order.shippingAddress.phone}</p>
        )}
        {!order.shippingAddress.city && !order.shippingAddress.details && !order.shippingAddress.phone && (
          <p className="text-gray-400">Address details unavailable</p>
        )}
      </div>
    </section>
  );
}

function OrderSummaryCard({ order }: { order: UserOrder }) {
  const subtotal = order.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
  return (
    <section className="rounded-xl border border-[#FDE585] bg-[#FEF3C6] p-4" aria-label="Order summary">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#101727]">
        <span className="grid size-6 place-items-center rounded-lg bg-[#FD9900] text-xs text-white"><FaReceipt aria-hidden="true" /></span> Order Summary
      </h3>
      <dl className="space-y-3 text-sm font-medium text-[#495565]">
        <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{money(subtotal)} EGP</dd></div>
        <div className="flex justify-between gap-4"><dt>Shipping</dt><dd>{order.shippingPrice === 0 ? "Free" : `${money(order.shippingPrice)} EGP`}</dd></div>
        {order.taxPrice > 0 && <div className="flex justify-between gap-4"><dt>Tax</dt><dd>{money(order.taxPrice)} EGP</dd></div>}
        <div className="flex justify-between gap-4 border-t border-[#E5E7EB]/50 pt-3 font-semibold text-[#101727]"><dt>Total</dt><dd className="text-lg font-bold">{money(order.totalOrderPrice)} EGP</dd></div>
      </dl>
      <p className="mt-3 text-xs capitalize text-gray-500">Payment: {order.paymentMethodType}</p>
    </section>
  );
}

function OrderCard({ order, expanded, onToggle }: { order: UserOrder; expanded: boolean; onToggle: () => void }) {
  const totalItems = quantity(order);
  const imageItem = order.cartItems[0];
  const extraImages = Math.max(0, order.cartItems.length - 1);
  const panelId = `order-details-${order.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <article className={`overflow-hidden rounded-2xl border bg-white transition-shadow ${expanded ? "border-[#BBF7D0] shadow-lg shadow-[#DCFCE7]/50" : "border-[#F2F4F6] shadow-sm hover:shadow-md"}`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="relative size-28 shrink-0 self-center rounded-2xl border border-[#F2F4F6] bg-linear-305 from-gray-50 to-white p-2.5 sm:self-start">
            <div className="relative size-full overflow-hidden rounded-xl bg-[#F8FAFB]">
              {imageItem?.imageCover ? <Image src={imageItem.imageCover} alt={imageItem.title} fill sizes="112px" className="object-contain p-2" /> : <FaBoxOpen aria-hidden="true" className="absolute inset-0 m-auto text-2xl text-[#99A1AE]" />}
            </div>
            {extraImages > 0 && <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-[#101727] text-xs font-bold text-white shadow-lg">+{extraImages}</span>}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2"><OrderStatusBadge order={order} /></div>
                <h2 className="flex items-center gap-1.5 truncate text-lg font-bold text-[#101727]"><FaHashtag aria-hidden="true" className="shrink-0 text-sm text-[#99A1AE]" />Order {order.orderNumber}</h2>
              </div>
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-lg ${statusOf(order) === "processing" ? "bg-[#F2F4F6] text-[#495565]" : statusOf(order) === "on-the-way" ? "bg-[#F2E7FE] text-[#980FFA]" : "bg-[#DCFCE7] text-[#16A34A]"}`}>
                {statusOf(order) === "processing" ? <FaBox aria-hidden="true" /> : statusOf(order) === "on-the-way" ? <FaTruckFast aria-hidden="true" /> : <FaCircleCheck aria-hidden="true" />}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-[#697282]">
              <span className="inline-flex items-center gap-1.5"><FaCalendarDays aria-hidden="true" className="text-[#99A1AE]" />{dateLabel(order.createdAt)}</span><span className="size-1 rounded-full bg-[#D0D5DB]" />
              <span className="inline-flex items-center gap-1.5"><FaBoxOpen aria-hidden="true" className="text-[#99A1AE]" />{totalItems} {totalItems === 1 ? "item" : "items"}</span><span className="size-1 rounded-full bg-[#D0D5DB]" />
              {order.shippingAddress.city && <span dir="auto" className="inline-flex items-center gap-1.5"><FaLocationDot aria-hidden="true" className="text-[#155CFB]" />{order.shippingAddress.city}</span>}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[#F2F4F6] pt-3 sm:border-0 sm:pt-0">
              <p className="flex items-baseline gap-1 text-2xl font-bold text-[#101727]">{money(order.totalOrderPrice)} <small className="text-sm font-medium text-[#99A1AE]">EGP</small></p>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={onToggle}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${expanded ? "bg-[#16A34A] text-white shadow-md shadow-green-500/20" : "bg-[#F2F4F6] text-[#354152] hover:bg-gray-200"}`}
              >
                {expanded ? "Hide" : "Details"}
                {expanded ? <FaChevronUp aria-hidden="true" className="text-xs" /> : <FaChevronDown aria-hidden="true" className="text-xs" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div id={panelId} className="border-t border-[#F2F4F6] bg-[#F8FAFB]/50 p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:gap-5">
            <span>Order ID: <span className="font-medium text-gray-700">{order.orderNumber}</span></span>
            <span>Placed on: <span className="font-medium text-gray-700">{dateLabel(order.createdAt)}</span></span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <section aria-label="Items ordered">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#101727]"><span className="grid size-6 place-items-center rounded-lg bg-[#DCFCE7] text-xs text-[#16A34A]"><FaBoxOpen aria-hidden="true" /></span>Order Items</h3>
              {order.cartItems.length ? <ul className="space-y-3">{order.cartItems.map((item) => <li key={item.key} className="rounded-xl border border-[#F2F4F6] bg-white p-4"><OrderItemRow item={item} /></li>)}</ul> : <p className="text-sm text-gray-500">Item details unavailable</p>}
            </section>
            <div className="grid content-start gap-4">
              <DeliveryAddressCard order={order} />
              <OrderSummaryCard order={order} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading orders" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-4"><div className="size-14 rounded-xl bg-gray-100" /><div className="flex-1 space-y-3"><div className="h-4 w-44 rounded bg-gray-100" /><div className="h-3 w-64 max-w-full rounded bg-gray-100" /></div><div className="h-8 w-28 rounded bg-gray-100" /></div>
        </div>
      ))}
    </div>
  );
}

function OrdersEmptyState() {
  return (
    <section className="rounded-3xl border border-[#F2F4F6] bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-gray-100 text-2xl text-[#99A1AE]"><FaBoxOpen aria-hidden="true" /></div>
      <h2 className="text-xl font-bold text-gray-950">No orders yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">When you place an order, it will show up here.</p>
      <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-xl bg-linear-305 from-green-500 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition hover:brightness-95">Start Shopping</Link>
    </section>
  );
}

export default function OrdersManager() {
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      const result = await getUserOrdersAction();
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        setError(result.message);
        setState("error");
        return;
      }
      setOrders(result.orders);
      setExpanded(result.orders[0] ? { [result.orders[0].key]: true } : {});
      setState(result.orders.length ? "ready" : "empty");
    } catch {
      setError("Something went wrong while loading your orders.");
      setState("error");
    }
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <main className="min-h-[70vh] bg-gray-50/70 px-4 py-10 sm:px-6 lg:px-8 font-exo">
      <div className="mx-auto w-full max-w-[1536px]">
        <OrdersHeader count={orders.length} />
        {state === "loading" && <OrdersSkeleton />}
        {state === "error" && (
          <section role="alert" className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center shadow-sm">
            <p className="font-semibold text-gray-900">We couldn&apos;t load your orders</p>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button type="button" onClick={() => void loadOrders()} className="mt-5 rounded-xl bg-linear-305 from-green-500 to-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">Try again</button>
          </section>
        )}
        {state === "empty" && <OrdersEmptyState />}
        {state === "ready" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.key}
                order={order}
                expanded={Boolean(expanded[order.key])}
                onToggle={() => setExpanded((current) => ({ ...current, [order.key]: !current[order.key] }))}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
