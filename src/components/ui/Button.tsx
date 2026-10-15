"use client";
import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils/ui";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary";
  onlyForUsers?: boolean;
}
export default function Button({
  children,
  className,
  href,
  onlyForUsers = false,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const { data: session } = useSession();
  const unavailable = disabled || (onlyForUsers && !session?.user);
  const classes = cn(
    "button",
    variant === "secondary" ? "button-secondary" : "button-primary",
    className,
  );
  if (href)
    return unavailable ? (
      <span className={classes} aria-disabled="true">
        {children}
      </span>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  return (
    <button className={classes} disabled={unavailable} {...props}>
      {children}
    </button>
  );
}
