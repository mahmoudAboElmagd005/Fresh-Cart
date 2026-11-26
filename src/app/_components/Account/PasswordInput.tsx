"use client";

import { useState } from "react";
import type { InputHTMLAttributes, Ref } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
  helperText?: string;
  ref?: Ref<HTMLInputElement>;
};

export default function PasswordInput({
  label,
  error,
  helperText,
  id,
  ref,
  ...inputProps
}: Props) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? inputProps.name;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <FaLock
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          {...inputProps}
          id={inputId}
          ref={ref}
          type={visible ? "text" : "password"}
          className={`w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-slate-700 outline-none transition placeholder:text-slate-400/70 focus:border-green-500 focus:ring-2 focus:ring-green-500/15 ${error ? "border-red-400" : "border-gray-200"}`}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {visible ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
        </button>
      </div>
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
