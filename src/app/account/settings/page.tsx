import { auth } from "@/auth";
import AccountSettingsForm from "@/app/_components/Account/AccountSettingsForm";

export default async function AccountSettingsPage() {
  const session = await auth();

  return (
    <AccountSettingsForm
      initialName={session?.user?.name ?? ""}
      initialEmail={session?.user?.email ?? ""}
      role={session?.user?.role ?? "user"}
      userId="—"
    />
  );
}
