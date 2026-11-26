"use server";

import { signup } from "@/APIs/services/auth.services";
import { registerSchema } from "@/app/_schemas/register.schema";

import { resetPassword } from "@/APIs/services/auth.services";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/app/_schemas/forgot-password.schema";


import { forgotPassword } from "@/APIs/services/auth.services";


/* ---------- Register ---------- */

export async function registerAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid data" };
  }

  const { terms, ...body } = parsed.data;
  const result = await signup(body);

  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  // مبنخزنش token هنا، المستخدم هيعمل login بعد التسجيل
  return { ok: true as const, message: result.message };
}



export async function forgotPasswordAction(input: unknown) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid data" };
  }

  const result = await forgotPassword(parsed.data);

  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  return { ok: true as const, message: result.message };
}


import { verifyResetCode } from "@/APIs/services/auth.services";
import { verifyCodeSchema } from "@/app/_schemas/forgot-password.schema";

export async function verifyResetCodeAction(input: unknown) {
  const parsed = verifyCodeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: "Invalid data" };
  }

  const result = await verifyResetCode(parsed.data);

  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  return { ok: true as const, message: "Code verified successfully" };
}



export async function resetPasswordAction(email: string, input: unknown) {
  const emailParsed = forgotPasswordSchema.safeParse({ email });
  const parsed = resetPasswordSchema.safeParse(input);
  if (!emailParsed.success || !parsed.success) {
    return { ok: false as const, message: "Invalid data" };
  }

  const result = await resetPassword({
    email: emailParsed.data.email,
    newPassword: parsed.data.newPassword,
  });

  if (!result.ok) {
    return {
      ok: false as const,
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  return { ok: true as const, message: result.message };
}