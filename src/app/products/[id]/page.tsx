import { notFound } from "next/navigation";
import { FaTruck, FaRotateLeft, FaShieldHalved } from "react-icons/fa6";
import ImageGallery from "@/app/_components/ImageGallery/ImageGallery";
import ProductTabs from "@/app/_components/ProductTabs/ProductTabs";
import PurchasePanel from "@/app/_components/PurchasePanel/PurchasePanel";
import RelatedProducts from "@/app/_components/RelatedProducts/RelatedProducts";
import Stars from "@/app/_components/stars/stars";
import { getProduct, getRelated } from "@/APIs/services/route.services";

const features = [
  { icon: FaTruck, title: "Free Delivery", sub: "Orders over 500 EGP" },
  { icon: FaRotateLeft, title: "30 Days Return", sub: "Money back" },
  { icon: FaShieldHalved, title: "Secure Payment", sub: "100% Protected" },
];

export default async function ProductDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const product = await getProduct(id);
  if (!product) notFound();

  const related = await getRelated(product.category._id, product._id);
  const inStock = product.quantity > 0;

  return (
    <>
      <section className="mx-auto container flex w-full flex-col items-start gap-8 px-4 py-8 font-exo lg:flex-row">
        {/* ===== Images ===== */}
        <ImageGallery
          cover={product.imageCover}
          images={product.images}
          title={product.title}
        />

        {/* ===== Details ===== */}
        <div className="w-full flex-1 rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#F0FDF4] px-3 py-1.5 text-xs font-medium leading-4 text-[#15803D]">
              {product.category.name}
            </span>
            <span className="rounded-full bg-[#F2F4F6] px-3 py-1.5 text-xs font-medium leading-4 text-[#354152]">
              {product.brand.name}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-9 text-[#101727]">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <Stars rating={product.ratingsAverage} className="text-base" />
            <span className="text-sm font-medium leading-5 text-[#495565]">
              {product.ratingsAverage} ({product.ratingsQuantity} reviews)
            </span>
          </div>

          <div
            className={`mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              inStock ? "bg-[#F0FDF4]" : "bg-[#FEF2F2]"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                inStock ? "bg-[#00C850]" : "bg-[#FA2B36]"
              }`}
            />
            <span
              className={`text-sm font-medium leading-5 ${
                inStock ? "text-[#008235]" : "text-[#C10007]"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-6 border-t border-[#F2F4F6] pt-5">
            <p className="text-base font-medium leading-6 text-[#495565]">
              {product.description}
            </p>
          </div>

          {/* Price + quantity + total + buttons (client) */}
          <PurchasePanel
            productId={product._id}
            product={product}
            price={product.price}
            priceAfterDiscount={product.priceAfterDiscount}
            available={product.quantity}
          />

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#F2F4F6] pt-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium leading-5 text-[#101727]">
                    {title}
                  </p>
                  <p className="text-xs font-medium leading-4 text-[#697282]">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductTabs product={product} />
      <RelatedProducts products={related} />
    </>
  );
}
