import Link from "next/link";
import Image from "next/image";
import { getAllCategories } from "@/APIs/services/Subcategories.service";

export default async function CategoriesPage() {
  const categories = await getAllCategories(); // Category[] جاهزة

  return (
    <div className="min-h-screen bg-gray-50/50 pb-52">
      {/* Header */}
      <div className="bg-linear-274 from-green-600 via-green-500 to-green-400 px-6 md:px-12 xl:px-48">
        <div className="mx-auto flex w-full max-w-[1536px] flex-col items-start gap-6 px-4 py-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-medium leading-5">
            <Link
              href="/"
              className="text-white/70 transition hover:text-white"
            >
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">Categories</span>
          </nav>

          {/* Title */}
          <div className="flex items-center gap-5">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.3)] backdrop-blur-xs">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold leading-10 text-white">
                All Categories
              </h1>
              <p className="text-base font-medium leading-6 text-white/80">
                Browse our wide range of product categories
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="mx-auto mt-10 w-full max-w-[1504px] px-4">
        <div className="grid grid-cols-2 gap-[17.6px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category._id}`}
              className="group flex  w-full flex-col items-center rounded-2xl border border-gray-100 bg-white p-[25px] shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="232px"
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Name */}
              <h2 className="mt-4 text-center text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-green-600">
                {category.name}
              </h2>

              {/* View Subcategories */}
              <div className="mt-2 flex items-center gap-1 text-xs font-medium leading-4 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View Subcategories</span>
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 5h10M7 1l4 4-4 4" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
