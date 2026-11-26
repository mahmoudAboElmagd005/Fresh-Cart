"use client";

import { useState } from "react";
import type { ProductDetails } from "@/app/_types/ProductType/ProductType";
import Stars from "../stars/stars";
import { FaBox, FaStar, FaTruck, FaCheck } from "react-icons/fa6";

const keyFeatures = [
  "Premium Quality Product",
  "100% Authentic Guarantee",
  "Fast & Secure Packaging",
  "Quality Tested",
];

type TabId = "details" | "reviews" | "shipping";

const tabBase =
  "flex shrink-0 items-center gap-2 px-6 py-4 text-base font-medium leading-6 transition-colors";

export default function ProductTabs({ product }: { product: ProductDetails }) {
  const [tab, setTab] = useState<TabId>("details");

  const description = product.description.replace(/\s+/g, " ").trim();
  const reviews = product.reviews ?? [];

  const info = [
    { label: "Category", value: product.category.name },
    { label: "Subcategory", value: product.subcategory[0]?.name ?? "-" },
    { label: "Brand", value: product.brand.name },
    { label: "Items Sold", value: `${product.sold}+ sold` },
  ];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: "details",
      label: "Product Details",
      icon: <FaBox className="text-sm" aria-hidden="true" />,
    },
    {
      id: "reviews",
      label: `Reviews (${product.ratingsQuantity})`,
      icon: <FaStar className="text-sm" aria-hidden="true" />,
    },
    {
      id: "shipping",
      label: "Shipping & Returns",
      icon: <FaTruck className="text-sm" aria-hidden="true" />,
    },
  ];

  return (
    <section className="mx-auto w-full container px-4 pb-8 font-exo">
      <div className="overflow-hidden rounded-lg bg-white pb-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        {/* Tabs */}
        <div
          role="tablist"
          className="flex overflow-x-auto border-b border-[#E5E7EB]"
        >
          {tabs.map(({ id, label, icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`${tabBase} ${
                  active
                    ? "border-b-2 border-[#16A34A] bg-[#F0FCF3]/50 text-[#16A34A]"
                    : "text-[#495565] hover:text-[#16A34A]"
                }`}
              >
                {icon}
                {label}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-6 flex flex-col gap-6 px-6">
          {tab === "details" && (
            <>
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold leading-7 text-[#101727]">
                  About this Product
                </h2>
                <p className="text-base font-medium leading-6 text-[#495565]">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3 rounded-lg bg-[#F8FAFB] p-4">
                  <h3 className="text-base font-medium leading-6 text-[#101727]">
                    Product Information
                  </h3>
                  <dl className="flex flex-col gap-2">
                    {info.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-start justify-between gap-4"
                      >
                        <dt className="text-sm font-medium leading-5 text-[#697282]">
                          {label}
                        </dt>
                        <dd className="text-right text-sm font-medium leading-5 text-[#101727]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex flex-col gap-3 rounded-lg bg-[#F8FAFB] p-4">
                  <h3 className="text-base font-medium leading-6 text-[#101727]">
                    Key Features
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {keyFeatures.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm font-medium leading-5 text-[#495565]"
                      >
                        <FaCheck
                          className="text-xs text-[#16A34A]"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {tab === "reviews" && (
            <div className="flex flex-col gap-4">
              {reviews.length === 0 ? (
                <p className="text-base font-medium text-[#495565]">
                  No reviews yet.
                </p>
              ) : (
                reviews.map((r) => (
                  <div
                    key={r._id}
                    className="flex flex-col gap-2 rounded-lg bg-[#F8FAFB] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-[#101727]">
                        {r.user.name}
                      </span>
                      <span className="text-xs font-medium text-[#697282]">
                        {r.createdAt.slice(0, 10)}
                      </span>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="text-sm font-medium leading-5 text-[#495565]">
                      {r.review}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "shipping" && (
            <div className="flex flex-col gap-3 text-base font-medium leading-6 text-[#495565]">
              <p>Free delivery on orders over 500 EGP.</p>
              <p>You can return this item within 30 days for a full refund.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
