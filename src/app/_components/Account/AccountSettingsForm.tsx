"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { InputHTMLAttributes, Ref } from "react";
import { FaFloppyDisk, FaKey, FaSpinner, FaUser } from "react-icons/fa6";
import PasswordInput from "@/app/_components/Account/PasswordInput";
import {
  changePasswordAction,
  updateProfileAction,
} from "@/app/_actions/account.actions";
import {
  passwordChangeSchema,
  profileSchema,
  type PasswordChangeFormValues,
  type ProfileFormValues,
} from "@/app/_schemas/account.schema";
import { FaLock } from "react-icons/fa";

const fieldClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none transition placeholder:text-slate-400/70 focus:border-green-500 focus:ring-2 focus:ring-green-500/15";

function Field({
  id,
  label,
  error,
  ...inputProps
}: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}) {
  const { ref, ...rest } = inputProps;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        {...rest}
        id={id}
        ref={ref}
        className={`${fieldClassName} ${error ? "border-red-400" : ""}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function AccountSettingsForm({
  initialName,
  initialEmail,
  role,
  userId,
}: {
  initialName: string;
  initialEmail: string;
  role: string;
  userId: string;
}) {
  const router = useRouter();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialName, email: initialEmail, phone: "" },
  });
  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });

  async function saveProfile(values: ProfileFormValues) {
    try {
      const result = await updateProfileAction(values);
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    } catch {
      toast.error("Could not update your profile. Please try again.");
    }
  }

  async function savePassword(values: PasswordChangeFormValues) {
    try {
      const result = await changePasswordAction(values);
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }
      if (result.status === "warning") {
        toast.warning(result.message);
        passwordForm.reset();
        return;
      }

      toast.success(result.message);
      passwordForm.reset();
      router.refresh();
    } catch {
      toast.error("Could not change your password. Please try again.");
    }
  }

  const profileErrors = profileForm.formState.errors;
  const passwordErrors = passwordForm.formState.errors;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
        <p className="mt-2 text-slate-500">
          Update your profile information and change your password
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-green-100 text-lg text-green-600">
            <FaUser aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Profile Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your personal details
            </p>
          </div>
        </div>

        <form
          onSubmit={profileForm.handleSubmit(saveProfile)}
          className="flex flex-col gap-5 p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              id="account-name"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              error={profileErrors.name?.message}
              {...profileForm.register("name")}
            />
            <Field
              id="account-email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              error={profileErrors.email?.message}
              {...profileForm.register("email")}
            />
            <Field
              id="account-phone"
              label="Phone Number"
              type="tel"
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
              error={profileErrors.phone?.message}
              {...profileForm.register("phone")}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-273 from-green-600 via-green-500 to-green-400 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {profileForm.formState.isSubmitting ? (
                <FaSpinner className="animate-spin" aria-hidden="true" />
              ) : (
                <FaFloppyDisk aria-hidden="true" />
              )}
              Save Changes
            </button>
          </div>
        </form>

        <div className="grid gap-4 bg-gray-50 px-6 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Account Information
            </p>
            <p className="mt-2 text-sm text-slate-600">User ID</p>
            <p className="font-medium text-slate-900">{userId || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Role
            </p>
            <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
              {role || "user"}
            </span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-yellow-100 text-lg text-orange-500">
            <FaKey aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your account password
            </p>
          </div>
        </div>

        <form
          onSubmit={passwordForm.handleSubmit(savePassword)}
          className="flex flex-col gap-5 p-6"
        >
          <PasswordInput
            id="current-password"
            label="Current Password"
            autoComplete="current-password"
            error={passwordErrors.currentPassword?.message}
            {...passwordForm.register("currentPassword")}
          />
          <PasswordInput
            id="new-password"
            label="New Password"
            autoComplete="new-password"
            helperText="Must be at least 6 characters"
            error={passwordErrors.password?.message}
            {...passwordForm.register("password")}
          />
          <PasswordInput
            id="confirm-password"
            label="Confirm New Password"
            autoComplete="new-password"
            error={passwordErrors.rePassword?.message}
            {...passwordForm.register("rePassword")}
          />
          <div>
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {passwordForm.formState.isSubmitting && (
                <FaSpinner className="animate-spin" aria-hidden="true" />
              )}
              <FaLock /> Change Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
