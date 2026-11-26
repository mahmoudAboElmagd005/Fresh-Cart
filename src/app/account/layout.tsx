import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AccountSidebar from "@/app/_components/Account/AccountSidebar";
import { getApiToken } from "@/lib/getApiToken";
import PageHeader from "../_components/PageHeader/PageHeader";
import { FaUser } from "react-icons/fa6";

export default async function AccountLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const token = await getApiToken();
  if (!token) redirect("/login");

  return (
    <>
      <PageHeader
        icon={<FaUser className="text-3xl" />}
        title="My Account"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/My-Account" },
        ]}
        description="Manage your addresses and account settings"
      />

      <div className="mx-auto flex container flex-col gap-8 px-4 py-8 font-exo lg:flex-row min-h-[600px]">
        <AccountSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
