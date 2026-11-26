"use client";

import { useState } from "react";
import { FaMinus, FaPlus, FaCartShopping, FaBolt } from "react-icons/fa6";
import AddBtn from "../_components/AddBtn/AddBtn";

type Props = {
  productId: string;
  unitPrice: number;
  available: number;
};

export default function PurchaseActions({
  productId,
  unitPrice,
  available,
}: Props) {
  const [qty, setQty] = useState(1);
  const outOfStock = available <= 0;

  return (
    <>
      {/* Quantity */}
      <div className="mt-6 flex flex-col gap-2">
        <span className="text-sm font-medium leading-5 text-[#354152]">
          Quantity
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center overflow-hidden rounded-lg border-2 border-[#E5E7EB]">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="px-4 py-3.5 text-[#495565] disabled:opacity-50 cursor-pointer hover:bg-gray-100 hover:text-[#16A34A] transition-all"
            >
              <FaMinus />
            </button>
            <span className="w-16 text-center text-lg font-medium leading-7 text-[#354152]">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => Math.min(available, q + 1))}
              disabled={qty >= available}
              className="px-4 py-3.5 text-[#495565] disabled:opacity-50 cursor-pointer hover:bg-gray-100 hover:text-[#16A34A] transition-all"
            >
              <FaPlus />
            </button>
          </div>
          <span className="text-sm font-medium leading-5 text-[#697282]">
            {available} available
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-6 flex items-center justify-between rounded-lg bg-[#F8FAFB] p-4">
        <span className="text-base font-medium leading-6 text-[#495565]">
          Total Price:
        </span>
        <span className="text-2xl font-bold leading-8 text-[#16A34A]">
          {(unitPrice * qty).toFixed(2)} EGP
        </span>
      </div>

      {/* Add to Cart / Buy Now */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <AddBtn
          productId={productId}
          count={qty}
          disabled={outOfStock}
          style="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3.5 text-base font-medium leading-6 text-white shadow-[0_10px_15px_-3px_rgba(22,163,74,0.25),0_4px_6px_-4px_rgba(22,163,74,0.25)] transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          title={{
            icon: <FaCartShopping aria-hidden="true" />,
            text: "Add to Cart",
          }}
        />
        <button
          type="button"
          disabled={outOfStock}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#101727] px-6 py-3.5 text-base font-medium leading-6 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <FaBolt aria-hidden="true" />
          Buy Now
        </button>
      </div>
    </>
  );
}
