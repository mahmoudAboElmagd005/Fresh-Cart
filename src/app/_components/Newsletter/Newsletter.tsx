"use client";

import { useState, type FormEvent, type SVGProps } from "react";

/** Responsive newsletter and mobile app signup panel. Tailwind CSS required. */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  return (
    <section className="relative isolate  bg-[linear-gradient(145deg,#f8fffc_0%,#ffffff_48%,#f4faf7_100%)] px-4 py-12 sm:px-8 lg:px-14 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-28 -z-10 size-80 rounded-full bg-[#00bc7c]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 -z-10 size-72 rounded-full bg-[#00bba6]/10 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl gap-12 rounded-[2rem] border border-[#e1fcee] bg-white/70 p-6 shadow-[0_25px_50px_-12px_rgba(0,188,125,0.10)] backdrop-blur sm:p-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,1fr)] lg:gap-10 lg:p-14">
        <div className="flex flex-col justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009865] to-[#00bba6] text-white shadow-lg shadow-[#00bc7c]/25">
              <MailIcon className="size-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#009865]">
                Newsletter
              </p>
              <p className="text-xs font-medium text-[#697282]">
                50,000+ subscribers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-3xl text-3xl font-bold leading-tight text-[#101727] sm:text-4xl sm:leading-[1.2]">
              Get the Freshest Updates{" "}
              <span className="text-[#009865]">Delivered Free</span>
            </h2>
            <p className="text-base font-medium leading-7 text-[#697282] sm:text-lg">
              Weekly recipes, seasonal offers &amp; exclusive member perks.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {[
              "Fresh Picks Weekly",
              "Free Delivery Codes",
              "Members-Only Deals",
            ].map((benefit) => (
              <li
                key={benefit}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#d0fae4] bg-white/80 px-4 py-2.5 text-sm font-medium text-[#354152] shadow-sm"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-[#d0fae4] text-[#009865]">
                  <CheckIcon className="size-4" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setSubscribed(false);
                }}
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-2xl border-2 border-[#e5e7eb] bg-white px-5 py-4 text-base text-[#101727] outline-none transition placeholder:text-[#99a1ae] focus:border-[#00bc7c] focus:ring-4 focus:ring-[#00bc7c]/10"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#009865] to-[#00bc7c] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#00bc7c]/25 transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-[#00bc7c]/25"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
                <ArrowIcon className="size-4" />
              </button>
            </div>
            <p
              aria-live="polite"
              className="pl-1 text-xs font-medium text-[#697282]"
            >
              {subscribed
                ? "Thanks for subscribing. Watch your inbox for fresh updates!"
                : "✨ Unsubscribe anytime. No spam, ever."}
            </p>
          </form>
        </div>

        <div className="flex items-stretch border-t border-[#d0fae4] pt-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="relative isolate flex w-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#101727] to-[#1b2938] p-6 text-white sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-[#00bc7c]/20 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 -left-10 -z-10 size-32 rounded-full bg-[#00bba6]/20 blur-2xl"
            />
            <span className="w-fit rounded-full border border-[#00bc7c]/30 bg-[#00bc7c]/20 px-3 py-1.5 text-xs font-semibold text-[#00d491]">
              📱 MOBILE APP
            </span>
            <h3 className="mt-6 text-2xl font-bold leading-8">
              Shop Faster on Our App
            </h3>
            <p className="mt-2 text-sm font-medium leading-6 text-[#c5cbd3]">
              Get app-exclusive deals &amp; 15% off your first order.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="#app-store"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15"
              >
                <AppleIcon className="size-6 shrink-0" />
                <span>
                  <span className="block text-[10px] font-medium uppercase tracking-wide text-[#c5cbd3]">
                    Download on
                  </span>
                  <span className="block text-sm font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#google-play"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 transition hover:bg-white/15"
              >
                <PlayIcon className="size-6 shrink-0" />
                <span>
                  <span className="block text-[10px] font-medium uppercase tracking-wide text-[#c5cbd3]">
                    Get it on
                  </span>
                  <span className="block text-sm font-semibold">
                    Google Play
                  </span>
                </span>
              </a>
            </div>
            <div className="mt-auto flex items-center gap-2 pt-7 text-sm font-medium">
              <span className="text-[#fdc700]" aria-label="5 out of 5 stars">
                ★★★★★
              </span>
              <span className="text-[#c5cbd3]">4.9 • 100K+ downloads</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
      {...props}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}
function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.37 12.4c.02 2.1 1.84 2.8 1.86 2.81-.02.05-.29 1.02-.96 2.02-.58.86-1.18 1.72-2.13 1.74-.93.02-1.23-.56-2.3-.56-1.07 0-1.4.54-2.28.58-.91.03-1.6-.93-2.18-1.8-1.2-1.73-2.12-4.9-.89-7.04a3.36 3.36 0 0 1 2.83-1.72c.88-.02 1.72.6 2.27.6.54 0 1.56-.74 2.63-.63.45.02 1.72.18 2.53 1.38-.06.04-1.51.88-1.5 2.62ZM14.64 6.8a3.3 3.3 0 0 0 .76-2.38 3.35 3.35 0 0 0-2.2 1.13 3.1 3.1 0 0 0-.78 2.3 2.77 2.77 0 0 0 2.22-1.05Z" />
    </svg>
  );
}
function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.3 3.2a1.6 1.6 0 0 0-.3 1v15.6a1.6 1.6 0 0 0 .3 1l8.4-8.8L4.3 3.2Zm9.3 7.8 2.2-2.3L6.2 2.9l7.4 8.1Zm0 2-7.4 8.1 9.6-5.8-2.2-2.3Zm8.1-2.2-4-2.4-2.5 2.6 2.5 2.6 4-2.4c.8-.5.8-1.5 0-2Z" />
    </svg>
  );
}
