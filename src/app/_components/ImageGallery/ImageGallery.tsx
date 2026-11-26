"use client";

import { useState } from "react";

export default function ImageGallery({
  cover,
  images,
  title,
}: {
  cover: string;
  images: string[];
  title: string;
}) {
  const all = Array.from(new Set([cover, ...images]));
  const [selected, setSelected] = useState(all[0]);

  const handleSelect = (
    img: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setSelected(img);
    // سكرول تلقائي للصورة المضغوطة وتتوسّط في الصف
    e.currentTarget.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="w-full shrink-0 lg:w-96">
      <div className="rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <img
          key={selected}
          src={selected}
          alt={title}
          className="h-[469px] w-full animate-[fadeIn_0.35s_ease-out] object-contain"
        />

        {all.length > 1 && (
          <div className="mt-2 flex gap-0.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {all.map((img) => (
              <button
                key={img}
                type="button"
                onClick={(e) => handleSelect(img, e)}
                aria-label="Show image"
                aria-pressed={img === selected}
                className={`h-32 w-24 shrink-0 border-4 transition-all duration-200 ${
                  img === selected ? "border-[#697282]" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}