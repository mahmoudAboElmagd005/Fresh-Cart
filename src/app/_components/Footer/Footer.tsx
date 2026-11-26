import Link from "next/link";
import {
  FaTruck,
  FaRotateLeft,
  FaShieldHalved,
  FaHeadset,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaCreditCard,
} from "react-icons/fa6";

const features = [
  { icon: FaTruck, title: "Free Shipping", sub: "On orders over 500 EGP" },
  { icon: FaRotateLeft, title: "Easy Returns", sub: "14-day return policy" },
  { icon: FaShieldHalved, title: "Secure Payment", sub: "100% secure checkout" },
  { icon: FaHeadset, title: "24/7 Support", sub: "Contact us anytime" },
];

const columns = [
  {
    title: "Shop",
    links: [
      { name: "All Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "Brands", href: "/brands" },
      { name: "Electronics", href: "/categories/electronics" },
      { name: "Men's Fashion", href: "/categories/mens-fashion" },
      { name: "Women's Fashion", href: "/categories/womens-fashion" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "My Account", href: "/account/settings" },
      { name: "Order History", href: "/orders" },
      { name: "Wishlist", href: "/wishlist" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Sign In", href: "/login" },
      { name: "Create Account", href: "/register" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Help Center", href: "/help" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns & Refunds", href: "/returns" },
      { name: "Track Order", href: "/track" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
];

const payments = ["Visa", "Mastercard", "PayPal"];

export default function Footer() {
  return (
    <footer className="font-exo">
      {/* ===== شريط المميزات ===== */}
      <div className="border-y border-[#DCFCE7] bg-[#F0FDF4]">
        <div className="mx-auto grid max-w-[1504px] grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 lg:grid-cols-4 lg:gap-6">
          {features.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-lg text-[#16A34A]">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-5 text-[#101727]">
                  {title}
                </p>
                <p className="text-xs font-medium leading-4 text-[#697282]">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== الفوتر الغامق ===== */}
      <div className="bg-[#101727]">
        <div className="mx-auto grid max-w-[1504px] grid-cols-1 gap-10 px-4 pb-12 pt-12 md:grid-cols-[1.6fr_repeat(4,1fr)] lg:gap-12">
          {/* البراند */}
          <div>
            <Link
              href="/"
              aria-label="FreshCart home"
              className="inline-flex rounded-lg bg-white px-4 py-2"
            >
              <img
                src="/figma-navbar/logo-desktop.svg"
                alt="FreshCart"
                className="h-8 w-auto"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm font-medium leading-6 text-[#99A1AE]">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>

            <ul className="mt-5 flex flex-col gap-3 text-sm font-medium leading-5 text-[#99A1AE]">
              <li className="flex items-center gap-3">
                <FaPhone className="shrink-0 text-[#22C55E]" aria-hidden="true" />
                <a href="tel:+18001234567" className="transition-colors hover:text-white">
                  +1 (800) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-[#22C55E]" aria-hidden="true" />
                <a
                  href="mailto:support@freshcart.com"
                  className="transition-colors hover:text-white"
                >
                  support@freshcart.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaLocationDot
                  className="mt-0.5 shrink-0 text-[#22C55E]"
                  aria-hidden="true"
                />
                <span>123 Commerce Street, New York, NY 10001</span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full bg-[#1D2838] text-[#99A1AE] transition-colors hover:bg-[#16A34A] hover:text-white"
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* أعمدة اللينكات */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-lg font-semibold leading-7 text-white">
                {col.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium leading-5 text-[#99A1AE] transition-colors hover:text-[#22C55E]"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* الحقوق + وسائل الدفع */}
        <div className="border-t border-[#1D2838]">
          <div className="mx-auto flex max-w-[1504px] flex-col items-center gap-3 px-4 py-6 text-sm font-medium leading-5 text-[#697282] md:flex-row md:justify-between">
            <p>© 2026 FreshCart. All rights reserved.</p>
            <ul className="flex items-center gap-4">
              {payments.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <FaCreditCard aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
