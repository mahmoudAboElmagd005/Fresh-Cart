import "server-only";
import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

type AuthTokenUpdate = Partial<Pick<JWT, "apiToken" | "name" | "email">>;

export async function updateAuthToken(update: AuthTokenUpdate): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const cookieName = cookieStore.has("__Secure-authjs.session-token")
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
    const sessionToken = cookieStore.get(cookieName)?.value;
    const secret = process.env.AUTH_SECRET;
    if (!sessionToken || !secret) return false;

    const decoded = await decode({
      token: sessionToken,
      secret,
      salt: cookieName,
    });
    if (!decoded) return false;

    const maxAge = decoded.exp
      ? Math.max(1, Math.floor(decoded.exp - Date.now() / 1000))
      : 60 * 60 * 24 * 30;
    const updatedToken = await encode({
      token: { ...decoded, ...update },
      secret,
      salt: cookieName,
      maxAge,
    });

    cookieStore.set(cookieName, updatedToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: cookieName.startsWith("__Secure-"),
      path: "/",
      maxAge,
    });

    return true;
  } catch {
    return false;
  }
}
