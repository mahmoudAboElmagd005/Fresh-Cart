import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/app/_components/PageHeader/PageHeader";
import {
  getCategoryById,
  getSubCategoriesByCategory,
} from "@/APIs/services/Subcategories.service";

export default async function SubCategoriesPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [category, subCategories] = await Promise.all([
    getCategoryById(id),
    getSubCategoriesByCategory(id),
  ]);

  if (!category) notFound();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title={category.name}
        description="Choose a subcategory to browse products"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
        icon={
          <Image
            src={category.image}
            alt={category.name}
            width={48}
            height={48}
            unoptimized
            className="size-12 object-contain"
          />
        }
      />

      <div className="container mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-green-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span>Back to Categories</span>
        </Link>

        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {subCategories.length} Subcategories in {category.name}
          </h2>
        </div>

        {subCategories.length === 0 ? (
          <p className="text-gray-500">No subcategories found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {subCategories.map((sub) => (
              <Link
                key={sub._id}
                href={`/products?subcategory=${sub._id}`}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-green-50 transition-colors group-hover:bg-green-100">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                    aria-hidden="true"
                  >
                    <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-green-600">
                  {sub.name}
                </h3>

                <div className="flex items-center gap-2 text-sm text-green-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <span>Browse Products</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
