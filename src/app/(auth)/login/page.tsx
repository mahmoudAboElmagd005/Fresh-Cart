"use client";
import { toast } from "react-toastify";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { getGuestCart, clearGuestCart } from "@/lib/guestCart";
import { mergeGuestCart } from "@/app/_actions/mergeGuestCart.action";
import {
  FaTruckFast,
  FaShieldHalved,
  FaHeadset,
  FaGoogle,
  FaFacebookF,
  FaRegEnvelope,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaUsers,
  FaStar,
  FaSpinner,
} from "react-icons/fa6";
import image from "../../_assets/2e5810ff3e-e750761ebcd4ae5907db.png";
import { loginSchema, LoginFormData } from "@/app/_schemas/login.schema";

const perks = [
  { icon: <FaTruckFast />, label: "Free Delivery" },
  { icon: <FaShieldHalved />, label: "Secure Payment" },
  { icon: <FaHeadset />, label: "24/7 Support" },
];

const trust = [
  { icon: <FaLock />, label: "SSL Secured" },
  { icon: <FaUsers />, label: "50K+ Users" },
  { icon: <FaStar />, label: "4.9 Rating" },
];

const socialBtn =
  "flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#E5E7EB] px-4 py-3 text-base font-medium text-[#354152] transition hover:bg-gray-50";

const inputBase =
  "w-full rounded-xl border-2 py-3 pl-12 pr-4 text-base font-medium text-[#354152] outline-none transition placeholder:text-[#354152]/50 focus:ring-2";
const okBorder =
  "border-[#E5E7EB] focus:border-[#16A34A] focus:ring-[#16A34A]/20";
const errBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";
const errorText = "text-xs font-medium text-red-500";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: false },
  });

  async function submit(values: LoginFormData) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      remember: String(values.remember),
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.code ?? "Invalid email or password");
      return;
    }

    const guestCart = getGuestCart();
    if (guestCart.length) {
      try {
        const mergeResult = await mergeGuestCart(
          guestCart.map(({ productId, count }) => ({ productId, count })),
        );
        if (mergeResult.status === "success") {
          clearGuestCart();
        } else {
          toast.error("Could not sync your guest cart. Please try again.");
        }
      } catch {
        toast.error("Could not sync your guest cart. Please try again.");
      }
    }

    toast.success("Signed in successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <section className="container mx-auto font-exo">
      <div className="container mx-auto flex flex-col items-center gap-12 px-4 py-10 lg:flex-row xl:px-30">
        {/* ===== Left side ===== */}
        <div className="hidden flex-1 flex-col gap-6 lg:flex">
          <img
            src={image.src}
            alt="FreshCart"
            className="h-96 w-full rounded-2xl object-cover shadow-lg"
          />

          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-3xl font-bold leading-9 text-[#1D2838]">
              FreshCart - Your One-Stop Shop for Fresh
              <br className="hidden sm:block" />
              Products
            </h1>
            <p className="text-lg font-medium leading-7 text-[#495565]">
              Join thousands of happy customers who trust FreshCart for their
              daily
              <br className="hidden sm:block" />
              grocery needs
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {perks.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center gap-2 text-sm font-medium leading-5 text-[#697282]"
                >
                  <span className="text-base text-[#16A34A]">{p.icon}</span>
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Right side (form card) ===== */}
        <div className="w-full flex-1 rounded-2xl bg-white p-6 shadow-xl sm:p-12">
          {/* Header */}
          <div className="text-center">
            <p className="text-3xl font-bold leading-9">
              <span className="text-[#16A34A]">Fresh</span>
              <span className="text-[#1D2838]">Cart</span>
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-8 text-[#1D2838]">
              Welcome Back!
            </h2>
            <p className="mt-2 text-base font-medium leading-6 text-[#495565]">
              Sign in to continue your fresh shopping experience
            </p>
          </div>

          {/* Social buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button type="button" className={socialBtn}>
              <FaGoogle className="text-[#FA2B36]" />
              Continue with Google
            </button>
            <button type="button" className={socialBtn}>
              <FaFacebookF className="text-[#155CFB]" />
              Continue with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex justify-center">
            <div className="absolute top-1/2 h-px w-full bg-[#E5E7EB]" />
            <span className="relative bg-white px-4 text-sm font-medium leading-5 text-[#697282]">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          {/* Fields */}
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
                  placeholder="Enter your email"
                  className={`${inputBase} ${errors.email ? errBorder : okBorder}`}
                />
              </div>
              {errors.email && (
                <p className={errorText}>{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold leading-5 text-[#354152]"
                >
                  Password
                </label>
                <Link
                  href="/forget-password"
                  className="text-sm font-medium leading-5 text-[#16A34A] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AE]" />
                <input
                  id="password"
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`${inputBase} pr-12 ${errors.password ? errBorder : okBorder}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99A1AE] hover:text-[#697282]"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              {errors.password && (
                <p className={errorText}>{errors.password.message}</p>
              )}
            </div>

            <label className="flex items-center gap-3 text-sm font-medium leading-5 text-[#354152]">
              <input
                {...register("remember")}
                type="checkbox"
                className="size-4 shrink-0 rounded-sm border border-[#767676] accent-[#16A34A]"
              />
              Keep me signed in
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-4 py-3 text-lg font-semibold leading-7 text-white shadow-lg transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-[#F2F4F6] pt-6 text-base leading-6">
            <span className="font-medium text-[#495565]">
              New to FreshCart?
            </span>
            <Link
              href="/register"
              className="font-semibold text-[#16A34A] hover:underline"
            >
              Create an account
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trust.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-1.5 text-xs font-medium leading-4 text-[#697282]"
              >
                {t.icon}
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
