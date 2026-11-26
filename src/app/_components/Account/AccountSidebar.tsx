"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaGear, FaLocationDot } from "react-icons/fa6";

const links = [
  { href: "/account/addresses", label: "My Addresses", Icon: FaLocationDot },
  { href: "/account/settings", label: "Settings", Icon: FaGear },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit w-full shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:w-72">
      <h2 className="border-b border-gray-100 px-6 py-5 text-lg font-bold text-slate-900">
        My Account
      </h2>
      <nav aria-label="My Account" className="flex flex-col gap-1 p-3">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${
                active
                  ? "bg-gray-50 text-green-700"
                  : "text-slate-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  active ? "bg-green-500 text-white" : "bg-gray-100 text-slate-500"
                }`}
              >
                <Icon aria-hidden="true" />
              </span>
              <span className="flex-1 font-semibold">{label}</span>
              <FaChevronRight
                className={active ? "text-green-500" : "text-slate-400"}
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
