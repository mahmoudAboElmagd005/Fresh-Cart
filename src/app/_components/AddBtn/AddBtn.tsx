"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent, ReactElement } from "react";
import { FaCheck, FaSpinner } from "react-icons/fa6";
import { addProductToCart } from "@/app/_actions/addToCart.action";
import { addToGuestCart } from "@/lib/guestCart";
import { publishCartItemDelta } from "@/lib/navbarCountEvents";

type Status = "idle" | "loading" | "added";

export default function AddBtn({
  productId,
  count = 1,
  disabled = false,
  style,
  title,
}: {
  productId: string;
  count?: number;
  disabled?: boolean;
  style: string;
  title: { icon?: ReactElement; text: string };
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (status !== "idle") return;

    setStatus("loading");
    try {
      const res = await addProductToCart(productId, count);

      if (res.status === "guest") addToGuestCart(res.item);

      if (res.status === "guest" || res.status === "success") {
        publishCartItemDelta(count);
        setStatus("added");
        timer.current = setTimeout(() => setStatus("idle"), 2000);
        return;
      }

      setStatus("idle");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <button
      onClick={handleClick}
      type="button"
      disabled={disabled || status !== "idle"}
      aria-label="Add to cart"
      className={`${style} transition-colors duration-200 ${
        status === "added"
          ? "!bg-green-700 disabled:opacity-100"
          : "disabled:opacity-70"
      }`}
    >
      {status === "idle" ? (
        <>
          {title.icon}
          {title.text}
        </>
      ) : status === "loading" ? (
        <FaSpinner className="animate-spin size-5" />
      ) : (
        <>
          <FaCheck className="size-5" />
        </>
      )}
    </button>
  );
}
