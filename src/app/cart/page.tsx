import { getCart } from "@/app/_actions/cart.actions";
import CartView from "@/app/_components/Cart/CartView";
import { normalizeCart } from "@/lib/cart";

export default async function CartPage() {
  const res = await getCart();
  const initialItems =
    res?.status === "unauthenticated" ? null : normalizeCart(res);

  return <CartView initialItems={initialItems} />;
}
