"use client";

import { useState } from "react";
import Image from "next/image";
import { FaBoxOpen } from "react-icons/fa6";

type Props = {
  src: string;
  alt: string;
  className: string;
  sizes: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export default function ProductImage({
  src,
  alt,
  className,
  sizes,
  fill = false,
  width = 640,
  height = 640,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-label={alt || "Product image unavailable"}
        className={`flex items-center justify-center bg-[#F8FAFB] text-3xl text-[#99A1AE] ${fill ? "absolute inset-0" : ""} ${className}`}
      >
        <FaBoxOpen aria-hidden="true" />
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      unoptimized
      onError={() => setFailed(true)}
      {...(fill ? { fill: true } : { width, height })}
    />
  );
}
