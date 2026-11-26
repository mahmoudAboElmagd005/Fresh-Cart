import { getAllProducts } from "@/APIs/services/route.services";
import { ProductCard } from "../productCard/productCard";

export default async function FeaturedProducts() {
  const allProducts = await getAllProducts();

  return (
    <section className="mx-auto container  px-4 py-12">
      {/* العنوان */}
      <div className="flex items-center gap-3 my-8">
        <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-[#22C55E] to-[#15803D]" />
        <h2 className="text-3xl font-bold leading-9 text-[#1D2838]">
          Featured <span className="text-[#16A34A]">Products</span>
        </h2>
      </div>

      {/* الكروت */}
      <div className="grid cols-1">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-[#697282]">No products available right now.</p>
        )}
      </div>
    </section>
  );
}
