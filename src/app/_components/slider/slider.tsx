"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import slideImage from "../../_assets/div.swiper-slide.png";

const slides = [
  {
    image: slideImage,
    title: "Fresh Products Delivered\nto your Door",
    subtitle: "Get 20% off your first order",
    primary: { label: "Shop Now", href: "/products" },
    secondary: { label: "View Deals", href: "/deals" },
  },
  {
    image: slideImage,
    title: "Premium Quality\nGuaranteed",
    subtitle: "Fresh from farm to your table",
    primary: { label: "Shop Now", href: "/products" },
    secondary: { label: "Learn More", href: "/about" },
  },
  {
    image: slideImage,
    title: "Fast & Free\nDelivery",
    subtitle: "Same day delivery available",
    primary: { label: "Order Now", href: "/products" },
    secondary: { label: "Contact Us", href: "/contact" },
  },
];

const svgProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const features = [
  {
    title: "Free Shipping",
    description: "On orders over 500 EGP",
    iconBg: "bg-blue-50",
    iconColor: "text-[#2B7FFF]",
    icon: (
      <svg {...svgProps}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Secure Payment",
    description: "100% secure transactions",
    iconBg: "bg-[#EBFCF4]",
    iconColor: "text-[#00BC7C]",
    icon: (
      <svg {...svgProps}>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Easy Returns",
    description: "14-day return policy",
    iconBg: "bg-orange-50",
    iconColor: "text-[#FF6800]",
    icon: (
      <svg {...svgProps}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "Dedicated support team",
    iconBg: "bg-purple-50",
    iconColor: "text-[#AC46FF]",
    icon: (
      <svg {...svgProps}>
        <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
      </svg>
    ),
  },
];

export function Slider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [active, setActive] = useState(0);

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => setActive(swiper.realIndex)}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-72 w-full bg-gradient-to-r from-[#0aad0a] to-[#4cc94c] h-96 ">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center font-exo">
                  <div className="container mx-auto px-6  ">
                    <h2 className="whitespace-pre-line text-2xl font-bold leading-9 text-white text-3xl">
                      {slide.title}
                    </h2>
                    <p className="mt-4 text-base font-medium text-white">
                      {slide.subtitle}
                    </p>

                    <div className="mt-4 flex flex-wrap  gap-2 opacity-95 ">
                      <a
                        href={slide.primary.href}
                        className="rounded-lg border-2 border-white/50 bg-white px-6 py-2 text-base font-semibold text-[#0aad0a] transition hover:bg-white/90"
                      >
                        {slide.primary.label}
                      </a>
                      <a
                        href={slide.secondary.href}
                        className="rounded-lg border-2 border-white/50 px-6 py-2 text-base font-semibold text-white transition hover:bg-white/10"
                      >
                        {slide.secondary.label}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* السهم الشمال */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-4 top-1/2 z-10 size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0aad0a] shadow-lg transition hover:bg-white lg:flex hidden"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M8.5 1.5L2 8l6.5 6.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* السهم اليمين */}
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-4 top-1/2 z-10 size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0aad0a] shadow-lg transition hover:bg-white lg:flex hidden"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M1.5 1.5L8 8l-6.5 6.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* النقط */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => swiperRef.current?.slideToLoop(i)}
              className={`h-3 rounded-md bg-white transition-all duration-300 ${
                i === active ? "w-8" : "w-3 opacity-50"
              }`}
            />
          ))}
        </div>
      </section>
      <section className="bg-[#F8FAFB] px-4 py-8 sm:px-8 lg:px-16 xl:px-56">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
            >
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-full ${f.iconBg} ${f.iconColor}`}
              >
                {f.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-5 text-[#1D2838]">
                  {f.title}
                </h3>
                <p className="text-xs font-medium leading-4 text-[#697282]">
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
