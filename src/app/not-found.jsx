// app/not-found.jsx
import Link from "next/link";
import { FaArrowLeft, FaHouse } from "react-icons/fa6";
import FloatingBackground from "./_components/FloatingBackground/FloatingBackground";

export const metadata = {
  title: "Page Not Found | FreshCart",
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-16">
      <FloatingBackground />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <p className="bg-linear-305 from-green-500 to-green-600 bg-clip-text text-8xl font-extrabold text-transparent sm:text-9xl">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back to shopping.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-305 from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-500/25 transition hover:brightness-95"
          >
            <FaHouse aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FaArrowLeft aria-hidden="true" />
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
}
