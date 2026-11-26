import { Product } from "@/app/_types/ProductType/ProductType";
import Link from "next/link";
import Stars from "../stars/stars";
import { FaPlus, FaRegEye } from "react-icons/fa6";
import AddBtn from "../AddBtn/AddBtn";
import WishlistToggle from "@/app/_components/Wishlist/WishlistToggle";
import ProductImage from "@/app/_components/ProductImage/ProductImage";

const actionBtn =
  "flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-sm text-[#495565] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-colors";

export function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.priceAfterDiscount !== undefined &&
    product.priceAfterDiscount > 0 &&
    product.priceAfterDiscount < product.price;
  const finalPrice = hasDiscount ? product.priceAfterDiscount! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - finalPrice) / product.price) * 100)
    : 0;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-[#E5E7EB] bg-white font-exo transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* الصورة + أزرار الأكشن */}
      <div className="relative">
        <ProductImage
          src={product.imageCover}
          alt={product.title}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="h-60 w-full object-contain"
        />

        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-sm bg-[#FA2B36] px-2 py-1 text-xs font-medium leading-4 text-white">
            -{discountPercent}%
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <WishlistToggle
            productId={product._id}
            className={`${actionBtn} hover:text-red-500`}
          />

          <Link
            href={`/products/${product._id}`}
            aria-label="Quick view"
            className={`${actionBtn} hover:text-spring-green-36`}
          >
            <FaRegEye />
          </Link>
        </div>
      </div>

      {/* المحتوى */}
      <div className="flex flex-col gap-1 p-4">
        <p className="text-xs font-medium leading-4 text-[#697282]">
          {product.category.name}
        </p>

        <Link
          href={`/products/${product._id}`}
          className="line-clamp-2 min-h-12 text-base font-medium leading-6 text-[#354152] hover:text-[#16A34A]"
        >
          {product.title}
        </Link>

        <div className="flex items-center gap-2">
          <Stars rating={product.ratingsAverage} />
          <span className="text-xs font-medium leading-4 text-[#697282]">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-bold leading-7 ${
                hasDiscount ? "text-[#16A34A]" : "text-[#1D2838]"
              }`}
            >
              {finalPrice} EGP
            </span>
            {hasDiscount && (
              <span className="text-sm font-medium leading-5 text-[#697282] line-through">
                {product.price} EGP
              </span>
            )}
          </div>
          <AddBtn
            productId={product._id}
            style="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white transition-colors hover:bg-[#15803D] cursor-pointer"
            title={{ icon: <FaPlus />, text: "" }}
          />
        </div>
      </div>
    </div>
  );
}
