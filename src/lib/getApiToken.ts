// src/lib/getApiToken.ts
import "server-only";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getApiToken() {
  try {
    const cookieStore = await cookies();

    const cookieName = cookieStore.has("__Secure-authjs.session-token")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";

    const sessionToken = cookieStore.get(cookieName)?.value;
    const secret = process.env.AUTH_SECRET;
    if (!sessionToken || !secret) return undefined;

    const decoded = await decode({
      token: sessionToken,
      secret,
      salt: cookieName,
    });

    return decoded?.apiToken as string | undefined;
  } catch {
    return undefined;
  }
}
