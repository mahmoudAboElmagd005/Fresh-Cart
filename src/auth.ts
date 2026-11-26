import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signin } from "@/APIs/services/auth.services";
import { loginSchema } from "@/app/_schemas/login.schema";

const DAY = 60 * 60 * 24;

class LoginError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * DAY },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, remember: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          ...credentials,
          remember: credentials?.remember === "true",
        });

        if (!parsed.success) throw new LoginError("Invalid data");

        const { email, password, remember } = parsed.data;
        const res = await signin({ email, password });

        if (!res.ok) throw new LoginError(res.message);

        return {
          id: res.user.email,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
          apiToken: res.token,
          remember,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.apiToken = user.apiToken;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});
