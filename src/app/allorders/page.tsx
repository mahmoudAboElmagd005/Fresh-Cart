import { redirect } from "next/navigation";

export default function AllOrdersRedirectPage() {
  redirect("/orders");
}
