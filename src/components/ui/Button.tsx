"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils/ui";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: "primary" | "secondary";
  onlyForUsers?: boolean;
}

function Button({
  children,
  className,
  href,
  onlyForUsers = false,
  variant = "primary",
  ...props
}: ButtonProps) {
  const { data: session } = useSession();
  const isUser = !!session?.user;
  const isDisabled = onlyForUsers && !isUser;

  const classes = cn(
    "button",
    variant === "secondary" ? "button-secondary" : "button-primary",
    isDisabled && "is-disabled",
    className,
  );

  if (href) {
    if (isDisabled) {
      return (
        <span className={classes} role="button" aria-disabled="true">
          {children}
        </span>
      );
    }
    return (
      <Link href={href} className={classes} role="button">
        {children}
      </Link>
    );
  }
  return (
    <button
      className={cn(classes, "disabled:opacity-50 disabled:cursor-not-allowed")}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
