import { redirect } from "next/navigation";
import OrdersManager from "@/app/_components/Orders/OrdersManager";
import { getApiToken } from "@/lib/getApiToken";

export default async function OrdersPage() {
  const token = await getApiToken();
  if (!token) redirect("/login");

  return <OrdersManager />;
}
