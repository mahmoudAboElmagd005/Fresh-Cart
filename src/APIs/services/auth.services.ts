import "server-only";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/auth";

/* ---------- Types ---------- */

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SigninBody {
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

export type SignupResult =
  | { ok: true; message: string; token: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors<SignupBody> };

export type SigninResult =
  | { ok: true; message: string; token: string; user: AuthUser }
  | { ok: false; message: string; fieldErrors?: FieldErrors<SigninBody> };

/* ---------- Helper ---------- */

function parseServerErrors(errors: unknown) {
  const list = Array.isArray(errors) ? errors : [errors];
  const fieldErrors: Record<string, string> = {};
  for (const err of list as { param?: string; msg?: string }[]) {
    if (err?.param && err?.msg) fieldErrors[err.param] = err.msg;
  }
  return {
    message: (list[0] as { msg?: string })?.msg ?? "Validation error",
    fieldErrors,
  };
}

/* ---------- Signup ---------- */

export async function signup(body: SignupBody): Promise<SignupResult> {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (data.message === "success") {
      return {
        ok: true,
        message: "Account created successfully",
        token: data.token,
      };
    }

    if (data.errors) {
      const { message, fieldErrors } = parseServerErrors(data.errors);
      return { ok: false, message, fieldErrors };
    }

    // "Account Already Exists" وأي fail تاني
    return { ok: false, message: data.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error, please try again" };
  }
}

/* ---------- Signin ---------- */

export async function signin(body: SigninBody): Promise<SigninResult> {
  try {
    const res = await fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (data.message === "success") {
      return {
        ok: true,
        message: "Signed in successfully",
        token: data.token,
        user: data.user,
      };
    }

    if (data.errors) {
      const { message, fieldErrors } = parseServerErrors(data.errors);
      return { ok: false, message, fieldErrors };
    }

    // "incorrect email or password" وأي fail تاني
    return { ok: false, message: data.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error, please try again" };
  }
}


/* ---------- Forgot password ---------- */

export interface ForgotPasswordBody {
  email: string;
}

export type ForgotPasswordResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors<ForgotPasswordBody> };

export async function forgotPassword(
  body: ForgotPasswordBody,
): Promise<ForgotPasswordResult> {
  try {
    const res = await fetch(`${BASE_URL}/forgotPasswords`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (data.statusMsg === "success") {
      return {
        ok: true,
        message: data.message ?? "Reset code sent to your email",
      };
    }

    if (data.errors) {
      const { message, fieldErrors } = parseServerErrors(data.errors);
      return { ok: false, message, fieldErrors };
    }

    // "There is no user registered with this email address" وأي fail تاني
    return { ok: false, message: data.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error, please try again" };
  }
}
/* ---------- Verify reset code ---------- */

export interface VerifyResetCodeBody {
  resetCode: string;
}

export type VerifyResetCodeResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors<VerifyResetCodeBody> };

export async function verifyResetCode(
  body: VerifyResetCodeBody,
): Promise<VerifyResetCodeResult> {
  try {
    const res = await fetch(`${BASE_URL}/verifyResetCode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (String(data.status).toLowerCase() === "success") {
      return { ok: true };
    }

    if (data.errors) {
      const { message, fieldErrors } = parseServerErrors(data.errors);
      return { ok: false, message, fieldErrors };
    }

    // "Reset code is invalid or has expired" وأي fail تاني
    return { ok: false, message: data.message ?? "Invalid or expired code" };
  } catch {
    return { ok: false, message: "Network error, please try again" };
  }
}



/* ---------- Reset password ---------- */

export interface ResetPasswordBody {
  email: string;
  newPassword: string;
}

export type ResetPasswordResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors<ResetPasswordBody> };

export async function resetPassword(
  body: ResetPasswordBody,
): Promise<ResetPasswordResult> {
  try {
    const res = await fetch(`${BASE_URL}/resetPassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    // النجاح بيرجّع token (مش بنخزنه، المستخدم هيعمل login)
    if (res.ok && data.token) {
      return { ok: true, message: "Password reset successfully" };
    }

    if (data.errors) {
      const { message, fieldErrors } = parseServerErrors(data.errors);
      return { ok: false, message, fieldErrors };
    }

    return { ok: false, message: data.message ?? "Something went wrong" };
  } catch {
    return { ok: false, message: "Network error, please try again" };
  }
}