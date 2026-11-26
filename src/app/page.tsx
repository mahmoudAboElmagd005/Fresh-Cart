import { Slider } from "./_components/slider/slider";
// import { Categories } from "./_components/Categorys/Categorys";
import { PromoCards } from "./_components/PromoCards/PromoCards";
import NewsletterSignup from "./_components/Newsletter/Newsletter";
import { lazy, Suspense } from "react";
import Loading from "./_components/loading/loagin";

const LazyFeaturedProductsLazyComp = lazy(
  () => import("./_components/FeaturedProducts/FeaturedProducts"),
);

const LazyCategoriesComp = lazy(
  () => import("./_components/Categorys/Categorys"),
);

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Slider />
      <Suspense fallback={<Loading />}>
        <LazyCategoriesComp />
      </Suspense>
      <PromoCards />

      <Suspense fallback={<Loading />}>
        <LazyFeaturedProductsLazyComp />
      </Suspense>

      <NewsletterSignup />
    </div>
  );
}
