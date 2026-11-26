import Link from "next/link";
import { FaArrowRight, FaTags } from "react-icons/fa6";
import PageHeader from "../_components/PageHeader/PageHeader";
import { getAllBrands } from "@/APIs/services/brands.service/brands.service";

export const metadata = { title: "Top Brands | FreshCart" };

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <>
      <PageHeader
  title="Top Brands"
  description="Shop from your favorite brands"
  breadcrumbs={[{ label: "Home", href: "/" }, { label: "Brands" }]}
  icon={<FaTags className="text-3xl" aria-hidden="true" />}
  gradientClassName="bg-linear-89 from-violet-600 via-violet-500 to-violet-400"
/>

      <section className="font-exo container mx-auto px-4 py-10">
        {brands.length === 0 ? (
          <p className="py-20 text-center text-lg font-medium text-[#364153]">
            No brands found.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {brands.map((brand) => (
              <li key={brand._id}>
                <Link
                  href={`/products?brand=${brand._id}`}
                  className="group flex h-full flex-col gap-3 rounded-2xl border border-[#f3f4f6] bg-white p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl  p-4">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <span className="text-center text-sm font-semibold leading-5 text-[#0f172b]">
                      {brand.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium leading-4 text-green-600 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      View Products
                      <FaArrowRight className="text-[10px]" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}