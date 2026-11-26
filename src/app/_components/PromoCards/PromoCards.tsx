import Link from "next/link";

const promos = [
  {
    icon: "🔥",
    badge: "Deal of the Day",
    title: "Fresh Organic Fruits",
    description: "Get up to 40% off on selected organic fruits",
    discount: "40% OFF",
    code: "ORGANIC40",
    cta: "Shop Now",
    gradient: "bg-gradient-to-br from-[#00BC7C] to-[#007A55]",
    ctaColor: "text-emerald-600",
  },
  {
    icon: "✨",
    badge: "New Arrivals",
    title: "Exotic Vegetables",
    description: "Get up to 25% off on fresh exotic vegetables",
    discount: "25% OFF",
    code: "FRESH25",
    cta: "Discover Now",
    gradient: "bg-gradient-to-tr from-[#FF6800] to-[#FF2B57]",
    ctaColor: "text-orange-600",
  },
];

export function PromoCards() {
  return (
    <section className="font-exo">
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-8 md:grid-cols-2">
        {promos.map((promo) => (
          <div
            key={promo.title}
            className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-lg ${promo.gradient}`}
          >
            {/* دواير الديكور */}
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 right-16 size-32 rounded-full bg-white/10" />

            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm">
                <span>{promo.icon}</span>
                <span>{promo.badge}</span>
              </div>

              <h3 className="mb-2 text-2xl font-bold md:text-3xl">
                {promo.title}
              </h3>

              <p className="mb-4 text-white/80">{promo.description}</p>

              <div className="mb-6 flex items-center gap-4">
                <div className="text-3xl font-bold">{promo.discount}</div>
                <div className="text-sm text-white/70">
                  Use code:{" "}
                  <span className="font-bold text-white">{promo.code}</span>
                </div>
              </div>

              <Link
                href="/products"
                className={`inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold transition-colors hover:bg-gray-100 ${promo.ctaColor}`}
              >
                {promo.cta}
                <svg
                  className="size-4"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}