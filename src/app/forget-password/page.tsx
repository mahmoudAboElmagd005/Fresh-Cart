"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaArrowLeft,
  FaCheck,
  FaKey,
  FaLock,
  FaRegEnvelope,
  FaRegEye,
  FaRegEyeSlash,
  FaShieldHalved,
  FaSpinner,
} from "react-icons/fa6";
import {
  forgotPasswordAction,
  verifyResetCodeAction,
  resetPasswordAction,
} from "@/app/_actions/auth.actions";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
  verifyCodeSchema,
  VerifyCodeFormData,
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/app/_schemas/forgot-password.schema";

const features = [
  { icon: <FaRegEnvelope />, label: "Email Verification" },
  { icon: <FaShieldHalved />, label: "Secure Reset" },
  { icon: <FaLock />, label: "Encrypted" },
];

const inputBase =
  "w-full rounded-xl border-2 py-3 pl-12 pr-4 text-base font-medium text-[#354152] outline-none transition placeholder:text-[#354152]/50 focus:ring-2";
const okBorder =
  "border-[#E5E7EB] focus:border-[#16A34A] focus:ring-[#16A34A]/20";
const errBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const submitBtn =
  "flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-3 text-lg font-semibold leading-7 text-white shadow-lg transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60";

type Step = "email" | "code" | "reset";

/* ---------- Stepper ---------- */
function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const icons = [
    <FaRegEnvelope key="e" />,
    <FaKey key="k" />,
    <FaLock key="l" />,
  ];

  return (
    <ol aria-label="Reset progress" className="flex items-center justify-center">
      {icons.map((icon, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;

        return (
          <li key={n} className="flex items-center">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex size-10 items-center justify-center rounded-full text-sm ${
                done || active
                  ? "bg-[#16A34A] text-white"
                  : "bg-gray-100 text-[#99A1AE]"
              } ${active ? "ring-4 ring-green-100" : ""}`}
            >
              {done ? <FaCheck aria-label="Completed" /> : icon}
            </span>
            {n < 3 && (
              <span
                className={`mx-2 h-0.5 w-16 ${
                  done ? "bg-[#16A34A]" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Step 1: email ---------- */
function EmailStep({
  initialEmail,
  onSent,
}: {
  initialEmail: string;
  onSent: (email: string) => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { email: initialEmail },
  });

  async function submit(values: ForgotPasswordFormData) {
    const result = await forgotPasswordAction(values);

    if (result.ok) {
      toast.success(result.message);
      onSent(values.email);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, msg] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ForgotPasswordFormData, { message: msg });
      }
    }
    toast.error(result.message);
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mt-4 text-2xl font-bold leading-8 text-[#1D2838]">
          Forgot Password?
        </h2>
        <p className="mt-2 text-base font-medium leading-6 text-[#495565]">
          No worries, we&apos;ll send you a reset code
        </p>
      </div>

      <div className="my-8">
        <Stepper current={1} />
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold leading-5 text-[#354152]"
          >
            Email Address
          </label>
          <div className="relative">
            <FaRegEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder="Enter your email address"
              className={`${inputBase} ${errors.email ? errBorder : okBorder}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className={submitBtn}>
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending...
            </>
          ) : (
            "Send Reset Code"
          )}
        </button>

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm font-medium leading-5 text-[#16A34A] hover:underline"
        >
          <FaArrowLeft className="text-xs" aria-hidden="true" />
          Back to Sign In
        </Link>
      </form>
    </>
  );
}

/* ---------- Step 2: code ---------- */
function CodeStep({
  email,
  onChangeEmail,
  onVerified,
}: {
  email: string;
  onChangeEmail: () => void;
  onVerified: () => void;
}) {
  const [resending, setResending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyCodeFormData>({
    resolver: zodResolver(verifyCodeSchema),
    mode: "onTouched",
    defaultValues: { resetCode: "" },
  });

  async function submit(values: VerifyCodeFormData) {
    const result = await verifyResetCodeAction(values);

    if (result.ok) {
      toast.success(result.message);
      onVerified();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, msg] of Object.entries(result.fieldErrors)) {
        setError(field as keyof VerifyCodeFormData, { message: msg });
      }
    }
    toast.error(result.message);
  }

  async function resend() {
    setResending(true);
    const result = await forgotPasswordAction({ email });
    setResending(false);

    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mt-4 text-2xl font-bold leading-8 text-[#1D2838]">
          Check Your Email
        </h2>
        <p className="mt-2 break-words text-base font-medium leading-6 text-[#495565]">
          Enter the 6-digit code sent to {email}
        </p>
      </div>

      <div className="my-8">
        <Stepper current={2} />
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="resetCode"
            className="text-sm font-semibold leading-5 text-[#354152]"
          >
            Verification Code
          </label>
          <input
            id="resetCode"
            {...register("resetCode", {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              },
            })}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            className={`w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-12 text-center font-mono text-2xl tracking-[0.5em] outline-none transition-all placeholder:text-gray-300 focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 ${
              errors.resetCode ? errBorder : okBorder
            }`}
          />
          {errors.resetCode && (
            <p className="text-xs font-medium text-red-500">
              {errors.resetCode.message}
            </p>
          )}
        </div>

        <p className="text-center text-sm font-medium leading-5 text-[#697282]">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-[#16A34A] hover:underline disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </p>

        <button type="submit" disabled={isSubmitting} className={submitBtn}>
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </button>

        <button
          type="button"
          onClick={onChangeEmail}
          className="flex items-center justify-center gap-2 text-sm font-medium leading-5 text-[#697282] hover:text-[#16A34A]"
        >
          <FaArrowLeft className="text-xs" aria-hidden="true" />
          Change email address
        </button>
      </form>
    </>
  );
}

/* ---------- Step 3: new password ---------- */
function PasswordField({
  id,
  label,
  placeholder,
  error,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold leading-5 text-[#354152]"
      >
        {label}
      </label>
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
        <input
          id={id}
          {...registration}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={`${inputBase} pr-12 ${error ? errBorder : okBorder}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A1AE] hover:text-[#697282]"
        >
          {show ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function ResetStep({ email }: { email: string }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  async function submit(values: ResetPasswordFormData) {
    const result = await resetPasswordAction(email, values);

    if (result.ok) {
      toast.success(`${result.message}. Please sign in.`);
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, msg] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ResetPasswordFormData, { message: msg });
      }
    }
    toast.error(result.message);
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mt-4 text-2xl font-bold leading-8 text-[#1D2838]">
          Create New Password
        </h2>
        <p className="mt-2 text-base font-medium leading-6 text-[#495565]">
          Your new password must be different from previous passwords
        </p>
      </div>

      <div className="my-8">
        <Stepper current={3} />
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <PasswordField
          id="newPassword"
          label="New Password"
          placeholder="Enter new password"
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm new password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <button type="submit" disabled={isSubmitting} className={submitBtn}>
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </>
  );
}

/* ---------- Page ---------- */
export default function ForgetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  return (
    <section className="container mx-auto font-exo">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 py-10 lg:flex-row xl:px-30">
        {/* ===== Left side ===== */}
        <div className="hidden flex-1 flex-col gap-6 lg:flex">
          <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-gray-50 via-gray-50 to-gray-100 shadow-lg">
            <span className="absolute left-8 top-8 size-24 rounded-full bg-gray-200/50" />
            <span className="absolute bottom-10 right-10 size-32 rounded-full bg-gray-200/50" />
            <span className="absolute right-12 top-20 size-16 rounded-full bg-green-100/60" />

            <div className="relative flex flex-col items-center gap-5">
              <div className="flex size-28 rotate-3 items-center justify-center rounded-3xl bg-white shadow-xl">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gray-100 text-4xl text-green-600">
                  <FaKey aria-hidden="true" />
                </div>
              </div>

              <div className="flex gap-3">
                <span className="size-3 rounded-full bg-green-400" />
                <span className="size-3 rounded-full bg-green-500" />
                <span className="size-3 rounded-full bg-green-600" />
              </div>

              <div className="absolute -left-16 top-6 flex size-14 -rotate-12 items-center justify-center rounded-xl bg-white text-xl text-green-500 shadow-lg">
                <FaShieldHalved aria-hidden="true" />
              </div>
              <div className="absolute -right-16 top-7 flex size-14 rotate-12 items-center justify-center rounded-xl bg-white text-xl text-green-600 shadow-lg">
                <FaLock aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-bold leading-9 text-[#1D2838]">
              Reset Your Password
            </h1>
            <p className="text-lg font-medium leading-7 text-[#495565]">
              Don&apos;t worry, it happens to the best of us. We&apos;ll help
              you get back into your
              <br className="hidden xl:block" />
              account in no time.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 text-sm font-medium leading-5 text-[#697282]"
                >
                  <span className="text-base text-[#16A34A]">{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Right side (form card) ===== */}
        <div className="w-full flex-1 rounded-2xl bg-white p-6 shadow-xl sm:p-12">
          <p className="text-center text-3xl font-bold leading-9">
            <span className="text-[#16A34A]">Fresh</span>
            <span className="text-[#1D2838]">Cart</span>
          </p>

          {step === "email" && (
            <EmailStep
              initialEmail={email}
              onSent={(sentTo) => {
                setEmail(sentTo);
                setStep("code");
              }}
            />
          )}

          {step === "code" && (
            <CodeStep
              email={email}
              onChangeEmail={() => setStep("email")}
              onVerified={() => setStep("reset")}
            />
          )}

          {step === "reset" && <ResetStep email={email} />}

          {step === "email" && (
            <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-[#F2F4F6] pt-6 text-base leading-6">
              <span className="font-medium text-gray-600">
                Remember your password?
              </span>
              <Link
                href="/login"
                className="font-semibold text-[#16A34A] hover:underline"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}