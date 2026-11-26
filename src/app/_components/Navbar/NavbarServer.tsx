import { auth } from "@/auth";
import Navbar from "./Navbar";
import { connection } from "next/server";

export default async function NavbarServer() {
  await connection();
  const session = await auth();

  return (
    <Navbar
      isLoggedIn={Boolean(session)}
      userName={session?.user?.name ?? null}
      userEmail={session?.user?.email ?? null}
    />
  );
}
