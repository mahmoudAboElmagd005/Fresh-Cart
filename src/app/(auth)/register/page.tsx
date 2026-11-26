"use client";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FaStar,
  FaTruckFast,
  FaShieldHalved,
  FaUserPlus,
  FaGoogle,
  FaFacebookF,
  FaCertificate,
  FaSpinner,
} from "react-icons/fa6";
import {
  registerSchema,
  RegisterFormData,
} from "@/app/_schemas/register.schema";
import { registerAction } from "@/app/_actions/auth.actions";

const features = [
  {
    icon: <FaCertificate />,
    title: "Premium Quality",
    text: "Premium quality products sourced from trusted suppliers.",
  },
  {
    icon: <FaTruckFast />,
    title: "Fast Delivery",
    text: "Same-day delivery available in most areas",
  },
  {
    icon: <FaShieldHalved />,
    title: "Secure Shopping",
    text: "Your data and payments are completely secure",
  },
];

const inputClass =
  "w-full rounded-md border px-3 pb-2.5 pt-2 text-base font-medium text-[#354152] outline-none transition placeholder:text-[#354152]/50 focus:ring-2";
const okBorder =
  "border-[#99A1AE]/40 focus:border-[#16A34A] focus:ring-[#16A34A]/20";
const errBorder = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

const labelClass = "text-base font-medium leading-6 text-[#354152]";
const errorText = "text-xs font-medium text-red-500";

// قوة الباسورد
function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (score === 2)
    return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
  if (score === 3)
    return { label: "Good", color: "bg-lime-500", width: "w-3/4" };
  return { label: "Strong", color: "bg-[#16A34A]", width: "w-full" };
}

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
      terms: false,
    },
  });

  const strength = getStrength(watch("password") ?? "");

  async function submit(values: RegisterFormData) {
    const result = await registerAction(values);

    if (result.ok) {
      toast.success(result.message);
      reset();
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (result.fieldErrors) {
      for (const [field, msg] of Object.entries(result.fieldErrors)) {
        setError(field as keyof RegisterFormData, { message: msg });
      }
    }
    toast.error(result.message);
  }

  return (
    <section className="container mx-auto py-16 font-exo">
      <div className="container mx-auto flex flex-col items-stretch gap-12 px-4 lg:flex-row lg:px-30">
        {/* ===== Left side ===== */}
        <div className="flex flex-1 flex-col gap-2">
          <h1 className="text-4xl font-bold leading-10 text-[#354152]">
            Welcome to <span className="text-[#16A34A]">FreshCart</span>
          </h1>

          <p className="text-xl font-medium leading-7 text-[#354152]">
            Join thousands of happy customers who enjoy fresh groceries
            <br className="hidden sm:block" />
            delivered right to their doorstep.
          </p>

          <div className="flex flex-col gap-6 py-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#BBF7D0] text-xl text-[#16A34A]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-[#354152]">
                    {f.title}
                  </h3>
                  <p className="text-base font-medium leading-6 text-[#495565]">
                    {f.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="flex flex-col gap-4 overflow-hidden rounded-md bg-white p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4">
              <img
                src="https://placehold.co/48x48"
                alt="Sarah Johnson"
                className="size-12 rounded-full"
              />
              <div>
                <p className="text-base font-medium leading-6 text-[#354152]">
                  Sarah Johnson
                </p>
                <div className="flex gap-0.5 py-1 text-sm text-[#FFDF20]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base font-medium leading-6 text-[#495565]">
              &quot;FreshCart has transformed my shopping experience. The
              quality of the products is outstanding, and the delivery is always
              on time. Highly recommend!&quot;
            </p>
          </div>
        </div>

        {/* ===== Right side (form card) ===== */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-2xl bg-white px-6 py-10 shadow-lg">
          <h2 className="text-center text-3xl font-semibold leading-9 text-[#354152]">
            Create Your Account
          </h2>
          <p className="text-center text-base font-medium leading-6 text-[#354152]">
            Start your fresh journey with us today
          </p>

          <form onSubmit={handleSubmit(submit)} noValidate>
            {/* Social buttons */}
            <div className="flex flex-col gap-2 py-8 sm:flex-row">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#D0D5DB] px-4 py-2 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                <FaGoogle className="text-[#E7000A]" />
                Google
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#D0D5DB] px-4 py-2 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                <FaFacebookF className="text-[#155CFB]" />
                Facebook
              </button>
            </div>

            {/* Divider */}
            <div className="relative h-0.5 bg-[#D0D5DB]/30">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-base font-medium text-[#354152]">
                or
              </span>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-7 py-2 pt-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className={labelClass}>
                  Name*
                </label>
                <input
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="Ali"
                  className={`${inputClass} ${errors.name ? errBorder : okBorder}`}
                />
                {errors.name && (
                  <p className={errorText}>{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className={labelClass}>
                  Email*
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="ali@example.com"
                  className={`${inputClass} ${errors.email ? errBorder : okBorder}`}
                />
                {errors.email && (
                  <p className={errorText}>{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={labelClass}>
                  Password*
                </label>
                <input
                  id="password"
                  {...register("password")}
                  type="password"
                  placeholder="create a strong password"
                  className={`${inputClass} ${errors.password ? errBorder : okBorder}`}
                />
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-md bg-[#E5E7EB]">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color} ${
                        watch("password") ? strength.width : "w-0"
                      }`}
                    />
                  </div>
                  <span className="min-w-12 text-sm font-medium leading-5 text-[#354152]">
                    {watch("password") ? strength.label : "Weak"}
                  </span>
                </div>
                {errors.password ? (
                  <p className={errorText}>{errors.password.message}</p>
                ) : (
                  <p className="text-xs font-medium leading-4 text-[#697282]">
                    Must be at least 8 characters with numbers and symbols
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="rePassword" className={labelClass}>
                  Confirm Password*
                </label>
                <input
                  id="rePassword"
                  {...register("rePassword")}
                  type="password"
                  placeholder="confirm your password"
                  className={`${inputClass} ${errors.rePassword ? errBorder : okBorder}`}
                />
                {errors.rePassword && (
                  <p className={errorText}>{errors.rePassword.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className={labelClass}>
                  Phone Number*
                </label>
                <input
                  id="phone"
                  {...register("phone")}
                  type="tel"
                  placeholder="01012345678"
                  className={`${inputClass} ${errors.phone ? errBorder : okBorder}`}
                />
                {errors.phone && (
                  <p className={errorText}>{errors.phone.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    {...register("terms")}
                    type="checkbox"
                    className="size-4 shrink-0 rounded-sm border border-[#767676] accent-[#16A34A]"
                  />
                  <span className="text-base font-medium leading-6 text-[#354152]">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#16A34A]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#16A34A]">
                      Privacy Policy
                    </Link>{" "}
                    *
                  </span>
                </label>
                {errors.terms && (
                  <p className={errorText}>{errors.terms.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#16A34A] text-base font-semibold text-white transition-colors hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    Create My Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="border-t border-[#D0D5DB]/30 pt-10 text-center text-base font-medium leading-6 text-[#354152]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#16A34A] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
