import { ProductCard } from "../productCard/productCard";
import NotFoundProducts from "../notFoundProducts/notFoundProducts";
import { getAllProducts } from "@/APIs/services/route.services";

export default async function ProductsGrid({
  category,
  brand,
}: {
  category?: string;
  brand?: string;
}) {
  const products = await getAllProducts(category, brand);

  return (
    <>
      <p className="mb-6 text-sm text-gray-500">
        Showing {products.length} products
      </p>

      {products.length === 0 ? (
        <NotFoundProducts />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
