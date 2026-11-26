import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    apiToken?: string;
    role?: string;
    remember?: boolean;
  }

  interface Session {
    user: { role?: string } & import("next-auth").DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
    role?: string;
  }
}

declare module "next-auth" {
  interface Session {
    apiToken?: string;
    user: {
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    apiToken?: string;
    role?: string;
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiToken?: string;
    role?: string;
  }
}
