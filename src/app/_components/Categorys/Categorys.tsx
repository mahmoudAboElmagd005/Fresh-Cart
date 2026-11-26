import { getAllCategories } from "@/APIs/services/Subcategories.service";
import { Category } from "./../../_types/CategoriesType/CategoriesType";
const categorises = [
  { name: "Music", image: "https://placehold.co/80x80" },
  { name: "Men's Fashion", image: "https://placehold.co/80x80" },
  { name: "Women's Fashion", image: "https://placehold.co/80x80" },
  { name: "SuperMarket", image: "https://placehold.co/80x80" },
  { name: "Baby & Toys", image: "https://placehold.co/80x80" },
  { name: "Home", image: "https://placehold.co/80x80" },
  { name: "Books", image: "https://placehold.co/80x80" },
  { name: "Beauty & Health", image: "https://placehold.co/80x80" },
  { name: "Mobiles", image: "https://placehold.co/80x80" },
  { name: "Electronics", image: "https://placehold.co/80x80" },
];

export default async function Categories() {
  const categories = await getAllCategories();

  return (
    <section className="font-exo py-10">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8">
        {/* العنوان */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#00BC7C] to-[#007A55]" />
            <h2 className="text-3xl font-bold leading-9 text-[#1D2838]">
              Shop By <span className="text-[#009865]">Category</span>
            </h2>
          </div>

          <a
            href="/categories"
            className="flex items-center gap-2 text-base font-medium text-[#16A34A] transition hover:opacity-80"
          >
            View All Categories
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => (
            <a
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="flex flex-col items-center gap-3 overflow-hidden rounded-lg bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition  hover:shadow-md"
            >
              <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#DCFCE7]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-center text-base font-medium leading-6 text-[#354152]">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
