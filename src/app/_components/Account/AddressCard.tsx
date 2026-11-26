import type { AccountAddress } from "@/app/_types/AccountType/AccountType";
import { FaLocationDot, FaMapPin, FaPhone, FaTrash } from "react-icons/fa6";

export default function AddressCard({
  address,
  onDelete,
  disabled = false,
}: {
  address: AccountAddress;
  onDelete: (address: AccountAddress) => void;
  disabled?: boolean;
}) {
  return (
    <article className="flex min-w-0 items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-lg text-green-600">
        <FaLocationDot aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-900">{address.name}</h3>
        <p className="mt-1 break-words text-sm text-slate-600">
          {address.details}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <FaPhone aria-hidden="true" />
            {address.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FaMapPin aria-hidden="true" />
            {address.city}
          </span>
        </div>
      </div>
      <button
        type="button"
        aria-label={`Delete ${address.name} address`}
        disabled={disabled}
        onClick={() => onDelete(address)}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaTrash aria-hidden="true" />
      </button>
    </article>
  );
}
