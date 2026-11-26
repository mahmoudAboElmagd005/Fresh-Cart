"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBolt,
  FaBoxOpen,
  FaCheck,
  FaCity,
  FaCircleInfo,
  FaCreditCard,
  FaLocationDot,
  FaLock,
  FaMapPin,
  FaMoneyBillWave,
  FaPhone,
  FaPlus,
  FaReceipt,
  FaRotateLeft,
  FaShieldHalved,
  FaSpinner,
  FaTruckFast,
} from "react-icons/fa6";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import {
  createStripeCheckoutSessionAction,
  getCheckoutDataAction,
  placeCashOrderAction,
} from "@/app/_actions/checkout.actions";
import type { AccountAddress } from "@/app/_types/AccountType/AccountType";
import type { CartLine } from "@/lib/cart";
import { publishCartItemCount } from "@/lib/navbarCountEvents";

const MANUAL_ADDRESS = "manual";
const fieldSchema = z.object({
  city: z.string(),
  details: z.string(),
  phone: z.string(),
});
type CheckoutFields = z.infer<typeof fieldSchema>;
type CheckoutData = {
  cartId: string;
  items: CartLine[];
  addresses: AccountAddress[];
  total: number;
};
type PaymentMethod = "cash" | "stripe";

const inputClass =
  "w-full rounded-xl border-2 border-[#E5E7EB] bg-white py-3.5 pl-14 pr-4 text-sm font-medium text-[#354152] outline-none transition placeholder:text-[#354152]/50 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/15";
const sectionHeaderClass =
  "bg-linear-to-r from-[#16A34A] to-[#15803D] px-6 py-4 text-white";

function money(value: number) {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function CheckoutHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium">
          <Link href="/" className="text-[#697282] transition hover:text-[#101727]">Home</Link>
          <span className="text-[#D0D5DB]" aria-hidden="true">/</span>
          <Link href="/cart" className="text-[#697282] transition hover:text-[#101727]">Cart</Link>
          <span className="text-[#D0D5DB]" aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#101727]">Checkout</span>
        </nav>
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#16A34A] to-[#15803D] text-xl text-white shadow-lg shadow-[#16A34A]/20">
            <FaReceipt aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-[#101727] sm:text-3xl">Complete Your Order</h1>
            <p className="mt-1 text-sm text-[#697282] sm:text-base">Review your items and complete your purchase</p>
          </div>
        </div>
      </div>
      <Link href="/cart" className="inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 font-medium text-[#16A34A] transition hover:bg-green-50">
        <FaArrowLeft aria-hidden="true" /> Back to Cart
      </Link>
    </div>
  );
}

function SavedAddressOption({
  address,
  value,
  selected,
  onSelect,
}: {
  address?: AccountAddress;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  const manual = !address;
  return (
    <label className={`flex cursor-pointer gap-4 rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#22C55E] ${selected ? "border-[#22C55E] bg-[#F0FDF4]" : "border-[#E5E7EB] bg-white hover:border-[#22C55E]/50"}`}>
      <input
        className="sr-only"
        type="radio"
        name="shipping-address"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
      />
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-[#22C55E] text-white" : "bg-[#F2F4F6] text-[#697282]"}`}>
        {manual ? <FaPlus aria-hidden="true" /> : <FaMapPin aria-hidden="true" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block font-semibold ${selected ? "text-[#15803D]" : "text-[#101727]"}`}>
          {manual ? "Use a different address" : address.name}
        </span>
        {manual ? (
          <span className="mt-1 block text-xs text-[#697282]">Enter a new shipping address manually</span>
        ) : (
          <>
            <span className="mt-1 block truncate text-sm text-[#495565]">{address.details}</span>
            <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#697282]">
              <span className="inline-flex items-center gap-1.5"><FaPhone aria-hidden="true" />{address.phone}</span>
              <span className="inline-flex items-center gap-1.5"><FaMapPin aria-hidden="true" />{address.city}</span>
            </span>
          </>
        )}
      </span>
      <span aria-hidden="true" className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#16A34A] bg-[#16A34A] text-white" : "border-[#D0D5DB] bg-white"}`}>
        {selected && <FaCheck className="size-3" />}
      </span>
    </label>
  );
}

function AddressForm({
  register,
  errors,
}: {
  register: UseFormRegister<CheckoutFields>;
  errors: FieldErrors<CheckoutFields>;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="checkout-city" className="text-sm font-semibold text-[#354152]">City <span className="text-[#FA2B36]">*</span></label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F2F4F6] text-[#697282]"><FaCity aria-hidden="true" /></span>
          <input id="checkout-city" placeholder="e.g. Cairo, Alexandria, Giza" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "checkout-city-error" : undefined} className={`${inputClass} ${errors.city ? "border-[#FA2B36]" : ""}`} {...register("city")} />
        </div>
        {errors.city && <p id="checkout-city-error" className="text-xs text-[#FA2B36]">{errors.city.message}</p>}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="checkout-details" className="text-sm font-semibold text-[#354152]">Street Address <span className="text-[#FA2B36]">*</span></label>
        <div className="relative">
          <span className="absolute left-4 top-4 flex size-8 items-center justify-center rounded-lg bg-[#F2F4F6] text-[#697282]"><FaLocationDot aria-hidden="true" /></span>
          <textarea id="checkout-details" rows={3} placeholder="Street name, building number, floor, apartment..." aria-invalid={Boolean(errors.details)} aria-describedby={errors.details ? "checkout-details-error" : undefined} className={`${inputClass} resize-y ${errors.details ? "border-[#FA2B36]" : ""}`} {...register("details")} />
        </div>
        {errors.details && <p id="checkout-details-error" className="text-xs text-[#FA2B36]">{errors.details.message}</p>}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="checkout-phone" className="text-sm font-semibold text-[#354152]">Phone Number <span className="text-[#FA2B36]">*</span></label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#F2F4F6] text-[#697282]"><FaPhone aria-hidden="true" /></span>
          <input id="checkout-phone" type="tel" placeholder="01xxxxxxxxx" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "checkout-phone-error" : undefined} className={`${inputClass} sm:pr-44 ${errors.phone ? "border-[#FA2B36]" : ""}`} {...register("phone")} />
          <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-xs font-medium text-[#99A1AE] sm:block">Egyptian numbers only</span>
        </div>
        <div className="flex justify-between gap-3">
          {errors.phone ? <p id="checkout-phone-error" className="text-xs text-[#FA2B36]">{errors.phone.message}</p> : <span />}
          <p className="text-xs font-medium text-[#99A1AE] sm:hidden">Egyptian numbers only</p>
        </div>
      </div>
    </div>
  );
}

function ShippingAddressCard({
  addresses,
  selectedAddressId,
  onSelectAddress,
  register,
  errors,
}: {
  addresses: AccountAddress[];
  selectedAddressId: string;
  onSelectAddress: (value: string) => void;
  register: UseFormRegister<CheckoutFields>;
  errors: FieldErrors<CheckoutFields>;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F2F4F6] bg-white shadow-sm">
      <div className={sectionHeaderClass}>
        <div className="flex items-center gap-3"><FaLocationDot aria-hidden="true" className="text-lg" /><h2 className="text-lg font-bold">Shipping Address</h2></div>
        <p className="mt-1 text-sm font-medium text-[#DCFCE7]">Where should we deliver your order?</p>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {addresses.length > 0 && (
          <fieldset className="flex flex-col gap-3 border-b border-[#F2F4F6] pb-5">
            <legend className="sr-only">Choose a saved shipping address</legend>
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-[#1D2838]"><FaMapPin className="text-[#22C55E]" aria-hidden="true" />Saved Addresses</h3>
              <p className="mt-1 text-sm font-medium text-[#495565]">Select a saved address or enter a new one below</p>
            </div>
            <div role="radiogroup" aria-label="Saved addresses" className="flex flex-col gap-3">
              {addresses.map((address) => (
                <SavedAddressOption key={address._id} address={address} value={address._id} selected={selectedAddressId === address._id} onSelect={onSelectAddress} />
              ))}
              <SavedAddressOption value={MANUAL_ADDRESS} selected={selectedAddressId === MANUAL_ADDRESS} onSelect={onSelectAddress} />
            </div>
          </fieldset>
        )}

        <div className="flex gap-3 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4] p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#155CFB]"><FaCircleInfo aria-hidden="true" /></span>
          <div><h3 className="text-sm font-medium text-[#193BB8]">Delivery Information</h3><p className="mt-1 text-xs font-medium text-[#155CFB]">Please ensure your address is accurate for smooth delivery</p></div>
        </div>

        {selectedAddressId === MANUAL_ADDRESS && <AddressForm register={register} errors={errors} />}
      </div>
    </section>
  );
}

function PaymentOption({
  value,
  selected,
  onSelect,
  title,
  subtitle,
  icon,
  brands,
}: {
  value: PaymentMethod;
  selected: boolean;
  onSelect: (value: PaymentMethod) => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  brands?: ReactNode;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#22C55E] sm:p-5 ${selected ? "border-[#22C55E] bg-linear-to-r from-[#F0FDF4] to-[#F2F4F6] shadow-sm" : "border-[#E5E7EB] bg-white hover:border-[#22C55E]/50"}`}>
      <input className="sr-only" type="radio" name="payment-method" value={value} checked={selected} onChange={() => onSelect(value)} />
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-xl text-xl ${selected ? "bg-linear-to-br from-[#22C55E] to-[#16A34A] text-white shadow-lg shadow-[#16A34A]/20" : "bg-[#F2F4F6] text-[#99A1AE]"}`}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={`block font-bold ${selected ? "text-[#15803D]" : "text-[#101727]"}`}>{title}</span>
        <span className="mt-1 block text-sm text-[#697282]">{subtitle}</span>
        {brands && <span className="mt-2 flex items-center gap-3 text-xl text-[#697282]">{brands}</span>}
      </span>
      <span aria-hidden="true" className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-[#16A34A] bg-[#16A34A] text-white" : "border-[#E5E7EB] bg-white"}`}>
        {selected && <FaCheck className="size-3.5" />}
      </span>
    </label>
  );
}

function PaymentMethodCard({
  paymentMethod,
  onSelectPayment,
}: {
  paymentMethod: PaymentMethod;
  onSelectPayment: (method: PaymentMethod) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#F2F4F6] bg-white shadow-sm">
      <div className={sectionHeaderClass}>
        <div className="flex items-center gap-3"><FaCreditCard aria-hidden="true" className="text-lg" /><h2 className="text-lg font-bold">Payment Method</h2></div>
        <p className="mt-1 text-sm font-medium text-[#DCFCE7]">Choose how you&apos;d like to pay</p>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-3">
          <PaymentOption value="cash" selected={paymentMethod === "cash"} onSelect={onSelectPayment} title="Cash on Delivery" subtitle="Pay when your order arrives at your doorstep" icon={<FaMoneyBillWave aria-hidden="true" />} />
          <PaymentOption value="stripe" selected={paymentMethod === "stripe"} onSelect={onSelectPayment} title="Pay Online" subtitle="Secure payment with Credit/Debit Card via Stripe" icon={<FaCreditCard aria-hidden="true" />} brands={<><FaCcVisa aria-label="Visa" /><FaCcMastercard aria-label="Mastercard" /><FaCcAmex aria-label="American Express" /></>} />
        </div>
        <div className="flex gap-3 rounded-xl border border-[#DCFCE7] bg-linear-to-r from-[#F0FDF4] to-[#F2F4F6] p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#00A63D]"><FaShieldHalved aria-hidden="true" /></span>
          <div><h3 className="text-sm font-medium text-[#016630]">Secure &amp; Encrypted</h3><p className="mt-1 text-xs font-medium text-[#00A63D]">Your payment info is protected with 256-bit SSL encryption</p></div>
        </div>
      </div>
    </section>
  );
}

function OrderItemRow({ item }: { item: CartLine }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-[#F8FAFB] p-3">
      <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#F2F4F6] bg-white p-1">
        {item.imageCover ? <Image src={item.imageCover} alt={item.title} fill sizes="56px" className="object-contain p-1" /> : <FaBoxOpen aria-hidden="true" className="text-[#99A1AE]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#101727]">{item.title}</p>
        <p className="mt-1 text-xs font-medium text-[#697282]">{item.count} × {money(item.price)} EGP</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-[#101727]">{money(item.price * item.count)}</p>
    </li>
  );
}

function OrderSummaryCard({
  items,
  total,
  submitting,
}: {
  items: CartLine[];
  total: number;
  submitting: boolean;
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.count, 0);
  return (
    <aside className="h-fit overflow-hidden rounded-2xl border border-[#F2F4F6] bg-white shadow-sm lg:sticky lg:top-24">
      <div className={sectionHeaderClass}>
        <div className="flex items-center gap-3"><FaBoxOpen aria-hidden="true" className="text-lg" /><h2 className="text-lg font-bold">Order Summary</h2></div>
        <p className="mt-1 text-sm font-medium text-[#DCFCE7]">{items.length} {items.length === 1 ? "item" : "items"}</p>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto">
          {items.map((item) => <OrderItemRow key={item.productId} item={item} />)}
        </ul>
        <div className="border-t border-[#F2F4F6]" />
        <div className="flex items-center justify-between text-sm font-medium text-[#495565]"><span>Subtotal</span><span>{money(subtotal)} EGP</span></div>
        <div className="flex items-center justify-between text-sm"><span className="inline-flex items-center gap-2 font-medium text-[#495565]"><FaTruckFast className="text-[#99A1AE]" aria-hidden="true" />Shipping</span><span className="font-semibold text-[#00A63D]">FREE</span></div>
        <div className="border-t border-[#F2F4F6]" />
        <div className="flex items-end justify-between"><span className="text-lg font-bold text-[#101727]">Total</span><span className="text-2xl font-bold text-[#16A34A]">{money(total)} <small className="text-sm font-medium text-[#697282]">EGP</small></span></div>
        <button form="checkout-form" type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#16A34A] to-[#15803D] px-5 py-4 text-base font-bold text-white shadow-lg shadow-[#16A34A]/20 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <><FaSpinner className="animate-spin" aria-hidden="true" />Placing order...</> : <><FaLock aria-hidden="true" />Place Order</>}
        </button>
        <div className="flex items-center justify-center gap-3 border-t border-[#F2F4F6] py-3 text-[11px] font-medium text-[#697282] sm:gap-4 sm:text-xs">
          <span className="inline-flex items-center gap-1.5"><FaShieldHalved className="text-[#00C850]" aria-hidden="true" />Secure</span>
          <span className="h-4 w-px bg-[#E5E7EB]" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5"><FaBolt className="text-[#2B7FFF]" aria-hidden="true" />Fast Delivery</span>
          <span className="h-4 w-px bg-[#E5E7EB]" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5"><FaRotateLeft className="text-[#FF6800]" aria-hidden="true" />Easy Returns</span>
        </div>
      </div>
    </aside>
  );
}

function CheckoutSkeleton() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1536px] animate-pulse flex-col gap-8 px-4 py-8">
      <div className="h-24 w-full max-w-2xl rounded-xl bg-[#F2F4F6]" />
      <div className="grid gap-8 lg:grid-cols-3"><div className="flex flex-col gap-6 lg:col-span-2"><div className="h-[390px] rounded-2xl bg-[#F2F4F6]" /><div className="h-[300px] rounded-2xl bg-[#F2F4F6]" /></div><div className="h-[540px] rounded-2xl bg-[#F2F4F6]" /></div>
    </main>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(MANUAL_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const formSchema = useMemo(
    () => fieldSchema.superRefine((values, context) => {
      if (selectedAddressId !== MANUAL_ADDRESS) return;
      if (values.city.trim().length < 2) {
        context.addIssue({ code: "custom", path: ["city"], message: "Enter a city with at least 2 characters" });
      }
      if (values.details.trim().length < 5) {
        context.addIssue({ code: "custom", path: ["details"], message: "Enter at least 5 characters for the street address" });
      }
      if (!/^01[0125][0-9]{8}$/.test(values.phone.trim())) {
        context.addIssue({ code: "custom", path: ["phone"], message: "Enter a valid Egyptian mobile number" });
      }
    }),
    [selectedAddressId],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFields>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { city: "", details: "", phone: "" },
    shouldFocusError: true,
  });

  const loadCheckout = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await getCheckoutDataAction();
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        setLoadError(result.message);
        return;
      }
      if (result.items.length === 0) {
        router.replace("/cart");
        return;
      }
      if (!result.cartId) {
        setLoadError("Could not identify your cart. Please return to the cart and try again.");
        return;
      }
      setData({
        cartId: result.cartId,
        items: result.items,
        addresses: result.addresses,
        total: result.total,
      });
    } catch {
      setLoadError("Could not load checkout details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadCheckout();
  }, [loadCheckout]);

  async function placeOrder(values: CheckoutFields) {
    if (!data) return;
    const savedAddress = data.addresses.find(
      (address) => address._id === selectedAddressId,
    );
    const shippingAddress = savedAddress
      ? {
          details: savedAddress.details,
          phone: savedAddress.phone,
          city: savedAddress.city,
        }
      : {
          details: values.details.trim(),
          phone: values.phone.trim(),
          city: values.city.trim(),
        };

    try {
      if (paymentMethod === "cash") {
        const result = await placeCashOrderAction(data.cartId, shippingAddress);
        if (result.status === "unauthenticated") {
          router.replace("/login");
          return;
        }
        if (result.status === "error") {
          toast.error(result.message);
          return;
        }
        toast.success(result.message);
        publishCartItemCount(0);
        window.setTimeout(() => router.replace("/"), 900);
        return;
      }

      const result = await createStripeCheckoutSessionAction(
        data.cartId,
        shippingAddress,
        window.location.origin,
      );
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      window.location.href = result.sessionUrl;
    } catch {
      toast.error("Could not place your order. Please try again.");
    }
  }

  if (loading) return <CheckoutSkeleton />;
  if (loadError || !data) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <p role="alert" className="font-medium text-[#FA2B36]">{loadError || "Could not load checkout details."}</p>
        <button type="button" onClick={() => void loadCheckout()} className="mt-5 rounded-xl bg-[#16A34A] px-5 py-3 font-semibold text-white hover:bg-[#15803D]">Retry</button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-[1536px] flex-col gap-8 px-4 py-8 font-exo">
      <CheckoutHeader />
      <form id="checkout-form" onSubmit={handleSubmit(placeOrder)} className="grid items-start gap-8 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <ShippingAddressCard
            addresses={data.addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            register={register}
            errors={errors}
          />
          <PaymentMethodCard paymentMethod={paymentMethod} onSelectPayment={setPaymentMethod} />
        </div>
        <OrderSummaryCard items={data.items} total={data.total} submitting={isSubmitting} />
      </form>
    </main>
  );
}
