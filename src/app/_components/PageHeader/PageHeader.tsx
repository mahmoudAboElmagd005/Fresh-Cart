import Link from "next/link";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string; // آخر عنصر (الصفحة الحالية) من غير href
}

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  icon: ReactNode; // أي حاجة جوه المربع الشفاف (svg / صورة)
  gradientClassName?: string; // كلاسات Tailwind للخلفية، الديفولت أخضر
}

const DEFAULT_GRADIENT =
  "bg-linear-274 from-green-600 via-green-500 to-green-400";

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  icon,
  gradientClassName = DEFAULT_GRADIENT,
}: PageHeaderProps) {
  return (
    <div className={`${gradientClassName} text-white`}>
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm font-medium">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <span
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {index > 0 && <span className="text-white/40">/</span>}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white">{item.label}</span>
                )}
              </span>
            );
          })}
        </nav>

        {/* Title */}
        <div className="flex items-center gap-5">
          <div className="flex size-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
            {icon}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-white/80">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
