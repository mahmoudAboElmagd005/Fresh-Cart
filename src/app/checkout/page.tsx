import { redirect } from "next/navigation";
import CheckoutView from "@/app/_components/Checkout/CheckoutView";
import { getApiToken } from "@/lib/getApiToken";

export default async function CheckoutPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  return <CheckoutView />;
}
