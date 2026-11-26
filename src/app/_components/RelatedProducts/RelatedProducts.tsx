"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/app/_types/ProductType/ProductType";
import { ProductCard } from "../productCard/productCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function RelatedProducts({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener("resize", updateButtons);
    return () => window.removeEventListener("resize", updateButtons);
  }, [updateButtons, products]);

  if (products.length === 0) return null;

  // 288px عرض الكارت + 16px (gap-4)
  const scrollBy = (dir: 1 | -1) =>
    scroller.current?.scrollBy({ left: dir * 304, behavior: "smooth" });

  return (
    <section className="mx-auto container w-full px-4 pb-12 font-exo">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#22C55E] to-[#15803D]" />
          <h2 className="text-2xl font-bold leading-8 text-[#1D2838]">
            You May Also <span className="text-[#009865]">Like</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            className="flex size-10 items-center justify-center rounded-full bg-[#F2F4F6] text-[#495565] transition-colors hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            className="flex size-10 items-center justify-center rounded-full bg-[#F2F4F6] text-[#495565] transition-colors hover:bg-[#E5E7EB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={updateButtons}
        className="flex snap-x snap-mandatory gap-4 overflow-hidden py-2"
      >
        {products.map((p) => (
          <div
            key={p._id}
            className="w-[288px] min-w-[288px] shrink-0 snap-start"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
