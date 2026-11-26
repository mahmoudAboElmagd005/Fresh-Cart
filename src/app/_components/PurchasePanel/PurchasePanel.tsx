import { FaShareNodes } from "react-icons/fa6";
import PurchaseActions from "@/app/_actions/PurchaseActions";
import WishlistToggle from "@/app/_components/Wishlist/WishlistToggle";

type Props = {
  productId: string;
  price: number;
  priceAfterDiscount?: number;
  available: number;
};

export default function PurchasePanel({
  productId,
  price,
  priceAfterDiscount,
  available,
}: Props) {
  const hasDiscount =
    priceAfterDiscount !== undefined &&
    priceAfterDiscount > 0 &&
    priceAfterDiscount < price;
  const unitPrice = hasDiscount ? priceAfterDiscount : price;

  return (
    <>
      {/* Price */}
      <div className="mt-5 flex items-baseline gap-3">
        <p className="text-3xl font-bold leading-9 text-[#101727]">
          {unitPrice} EGP
        </p>
        {hasDiscount && (
          <span className="text-lg font-medium text-[#697282] line-through">
            {price} EGP
          </span>
        )}
      </div>

      {/* الجزء التفاعلي (Client) */}
      <PurchaseActions
        productId={productId}
        unitPrice={unitPrice}
        available={available}
      />

      {/* Wishlist / Share */}
      <div className="mt-3 flex gap-3">
        <WishlistToggle
          productId={productId}
          label="Add to Wishlist"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#E5E7EB] px-4 py-3 text-base font-medium leading-6 text-[#354152] transition-colors hover:bg-[#F8FAFB] cursor-pointer"
        />
        <button
          type="button"
          aria-label="Share"
          className="rounded-xl border-2 border-[#E5E7EB] px-4 py-3.5 text-[#354152] transition-colors hover:bg-[#F8FAFB] cursor-pointer"
        >
          <FaShareNodes />
        </button>
      </div>
    </>
  );
}
