import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "../_components/PageHeader/PageHeader";
import ProductsGrid from "../_components/ProductsGrid/ProductsGrid";
import Loading from "../_components/loading/loagin";
import { FaBoxOpen } from "react-icons/fa6";
import { getBrandById } from "@/APIs/services/brands.service/brands.service";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; brand?: string }>;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsContent({ searchParams }: ProductsPageProps) {
  const { category, brand } = await searchParams;
  const selectedBrand = brand ? await getBrandById(brand) : null;

  if (brand && !selectedBrand) notFound();

  const categoryHref = category
    ? `/products?category=${encodeURIComponent(category)}`
    : "/products";

  return (
    <>
      <PageHeader
        title={selectedBrand?.name ?? "All Products"}
        description={
          selectedBrand
            ? `Shop ${selectedBrand.name} products`
            : "Browse our wide selection of fresh products"
        }
        breadcrumbs={
          selectedBrand
            ? [
                { label: "Home", href: "/" },
                { label: "Brands", href: "/brands" },
                { label: selectedBrand.name },
              ]
            : [{ label: "Home", href: "/" }, { label: "Shop" }]
        }
        icon={
          selectedBrand ? (
            <img
              src={selectedBrand.image}
              alt={selectedBrand.name}
              className="size-10 rounded-lg bg-white object-contain p-1"
            />
          ) : (
            <FaBoxOpen className="text-3xl text-white" />
          )
        }
      />

      <section className="container mx-auto px-4 py-10 font-exo">
        {selectedBrand && (
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-[#697282]">Active Filters:</span>
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[#364153] transition-colors hover:border-[#16a34a] hover:text-[#16a34a]"
            >
              {selectedBrand.name}
              <span aria-hidden="true">×</span>
              <span className="sr-only">Remove brand filter</span>
            </Link>
            <Link
              href={categoryHref}
              className="font-medium text-[#16a34a] hover:underline"
            >
              Clear all
            </Link>
          </div>
        )}

        <Suspense
          key={`${category ?? "all"}-${brand ?? "all"}`}
          fallback={<Loading />}
        >
          <ProductsGrid category={category} brand={brand} />
        </Suspense>
      </section>
    </>
  );
}
