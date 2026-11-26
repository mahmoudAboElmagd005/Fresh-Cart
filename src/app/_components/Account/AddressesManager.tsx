"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  FaLocationDot,
  FaPlus,
  FaSpinner,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";
import AddressCard from "@/app/_components/Account/AddressCard";
import {
  addAddressAction,
  getAddressesAction,
  removeAddressAction,
} from "@/app/_actions/account.actions";
import {
  addressSchema,
  type AddressFormValues,
} from "@/app/_schemas/account.schema";
import type { AccountAddress } from "@/app/_types/AccountType/AccountType";

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-700 outline-none transition placeholder:text-slate-400/70 focus:border-green-500 focus:ring-2 focus:ring-green-500/15";

function AddressSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading addresses">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-2xl border border-gray-100 bg-gray-100"
        />
      ))}
    </div>
  );
}

export default function AddressesManager() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AccountAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AccountAddress | null>(
    null,
  );
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  });

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await getAddressesAction();
      if (result.status !== "success") {
        if (result.status === "unauthenticated") router.replace("/login");
        else setLoadError(result.message);
        return;
      }
      setAddresses(result.addresses);
    } catch {
      setLoadError("Could not load your addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  async function saveAddress(values: AddressFormValues) {
    setSaving(true);
    try {
      const result = await addAddressAction(values);
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setAddModalOpen(false);
      addressForm.reset();
      await loadAddresses();
    } catch {
      toast.error("Could not add the address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAddress() {
    if (!pendingDelete) return;
    const address = pendingDelete;
    setDeletingId(address._id);

    try {
      const result = await removeAddressAction(address._id);
      if (result.status === "unauthenticated") {
        router.replace("/login");
        return;
      }
      if (result.status === "error") {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setPendingDelete(null);
      await loadAddresses();
    } catch {
      toast.error("Could not delete the address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const errors = addressForm.formState.errors;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Addresses</h1>
          <p className="mt-2 text-slate-500">
            Manage your saved delivery addresses
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-273 from-green-600 via-green-500 to-green-400 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/25 transition hover:brightness-95"
        >
          <FaPlus aria-hidden="true" />
          Add Address
        </button>
      </header>

      {loading ? (
        <AddressSkeleton />
      ) : loadError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="font-medium text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadAddresses()}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm"
          >
            Retry
          </button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm min-h-[400px] justify-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gray-50 text-3xl text-green-600">
            <FaLocationDot aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            No addresses yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add a delivery address to make checkout easier.
          </p>
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-273 from-green-600 via-green-500 to-green-400 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/25"
          >
            <FaPlus aria-hidden="true" />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onDelete={setPendingDelete}
              disabled={deletingId !== null}
            />
          ))}
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-address-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2
                  id="add-address-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Add Address
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter your delivery details
                </p>
              </div>
              <button
                type="button"
                aria-label="Close add address dialog"
                onClick={() => {
                  setAddModalOpen(false);
                  addressForm.reset();
                }}
                className="flex size-9 items-center justify-center rounded-lg bg-gray-100 text-slate-500 hover:text-slate-800"
              >
                <FaXmark aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={addressForm.handleSubmit(saveAddress)}
              className="flex flex-col gap-4 p-6"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="address-name"
                  className="text-sm font-semibold text-slate-700"
                >
                  Name
                </label>
                <input
                  id="address-name"
                  placeholder="Home"
                  className={`${inputClassName} ${errors.name ? "border-red-400" : ""}`}
                  {...addressForm.register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="address-details"
                  className="text-sm font-semibold text-slate-700"
                >
                  Details
                </label>
                <textarea
                  id="address-details"
                  rows={3}
                  placeholder="Street, building, apartment..."
                  className={`${inputClassName} resize-y ${errors.details ? "border-red-400" : ""}`}
                  {...addressForm.register("details")}
                />
                {errors.details && (
                  <p className="text-xs text-red-600">
                    {errors.details.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="address-phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone
                  </label>
                  <input
                    id="address-phone"
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    className={`${inputClassName} ${errors.phone ? "border-red-400" : ""}`}
                    {...addressForm.register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="address-city"
                    className="text-sm font-semibold text-slate-700"
                  >
                    City
                  </label>
                  <input
                    id="address-city"
                    placeholder="Cairo"
                    className={`${inputClassName} ${errors.city ? "border-red-400" : ""}`}
                    {...addressForm.register("city")}
                  />
                  {errors.city && (
                    <p className="text-xs text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setAddModalOpen(false);
                    addressForm.reset();
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-273 from-green-600 via-green-500 to-green-400 px-5 py-3 font-semibold text-white shadow-lg shadow-green-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <FaSpinner className="animate-spin" aria-hidden="true" />
                  )}
                  Save Address
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-address-title"
            className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <FaTrash aria-hidden="true" />
            </span>
            <h2
              id="delete-address-title"
              className="mt-4 text-lg font-bold text-slate-900"
            >
              Delete this address?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              “{pendingDelete.name}” will be removed from your saved addresses.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => setPendingDelete(null)}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId !== null}
                onClick={() => void deleteAddress()}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId && (
                  <FaSpinner className="animate-spin" aria-hidden="true" />
                )}
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
