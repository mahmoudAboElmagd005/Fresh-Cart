import Link from "next/link";
import type { ReactNode } from "react";
import {
  FaArrowRight,
  FaCircleQuestion,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaHeadset,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPaperPlane,
  FaPhone,
  FaTwitter,
} from "react-icons/fa6";
import PageHeader from "../_components/PageHeader/PageHeader";

export const metadata = { title: "Contact Us | FreshCart" };

interface InfoCard {
  title: string;
  icon: ReactNode;
  lines: string[];
  link?: { label: string; href: string };
}

const infoCards: InfoCard[] = [
  {
    title: "Phone",
    icon: <FaPhone />,
    lines: ["Mon-Fri from 8am to 6pm"],
    link: { label: "+1 (800) 123-4567", href: "tel:+18001234567" },
  },
  {
    title: "Email",
    icon: <FaEnvelope />,
    lines: ["We’ll respond within 24 hours"],
    link: { label: "support@freshcart.com", href: "mailto:support@freshcart.com" },
  },
  {
    title: "Office",
    icon: <FaLocationDot />,
    lines: ["123 Commerce Street", "New York, NY 10001", "United States"],
  },
  {
    title: "Business Hours",
    icon: <FaClock />,
    lines: [
      "Monday - Friday: 8am - 6pm",
      "Saturday: 9am - 4pm",
      "Sunday: Closed",
    ],
  },
];

const socials = [
  { label: "Facebook", icon: <FaFacebookF /> },
  { label: "Twitter", icon: <FaTwitter /> },
  { label: "Instagram", icon: <FaInstagram /> },
  { label: "LinkedIn", icon: <FaLinkedinIn /> },
];

const subjects = [
  "General Inquiry",
  "Order Issue",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Partnership",
  "Other",
];

const fieldClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-[#364153] outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20";
const labelClass = "text-sm font-medium text-[#364153]";
const cardClass =
  "rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        description="We’d love to hear from you. Get in touch with our team."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        icon={<FaHeadset className="text-3xl" aria-hidden="true" />}
      />

      <section className="container mx-auto px-4 py-10 font-exo">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ===== Left: info cards ===== */}
          <aside className="flex flex-col gap-4">
            {infoCards.map((card) => (
              <div key={card.title} className={`${cardClass} flex gap-4 p-6`}>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                  {card.icon}
                </span>
                <div className="flex flex-col gap-1 text-sm text-[#4a5565]">
                  <h3 className="text-base font-semibold text-[#0f172b]">
                    {card.title}
                  </h3>
                  {card.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {card.link && (
                    <a
                      href={card.link.href}
                      className="mt-1 text-base font-medium text-green-600 hover:underline"
                    >
                      {card.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div className={`${cardClass} p-6`}>
              <h3 className="text-base font-semibold text-[#0f172b]">
                Follow Us
              </h3>
              <div className="mt-4 flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-sm text-[#4a5565] transition-colors hover:bg-green-600 hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ===== Right: form + help ===== */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className={`${cardClass} p-6 sm:p-8`}>
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600">
                  <FaHeadset aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-[#0f172b]">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-[#4a5565]">
                    Fill out the form and we’ll get back to you
                  </p>
                </div>
              </div>

              <form className="mt-8 flex flex-col gap-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className={labelClass}>
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className={labelClass}>
                    Subject
                  </label>
                  <select
                    id="subject"
                    defaultValue=""
                    className={`${fieldClass} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className={labelClass}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="How can we help you?"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <button
                  type="button"
                  className="flex w-fit items-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-green-700"
                >
                  <FaPaperPlane aria-hidden="true" />
                  Send Message
                </button>
              </form>
            </div>

            <div className="flex gap-4 rounded-2xl border border-green-100 bg-green-50 p-6">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-green-600 shadow-sm">
                <FaCircleQuestion aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-[#0f172b]">
                  Looking for quick answers?
                </h3>
                <p className="text-sm text-[#4a5565]">
                  Check out our Help Center for frequently asked questions about
                  orders, shipping, returns, and more.
                </p>
                <Link
                  href="/help"
                  className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-600 hover:underline"
                >
                  Visit Help Center
                  <FaArrowRight className="text-xs" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}