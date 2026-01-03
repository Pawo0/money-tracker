"use client"

import React from "react";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {cn} from "@/lib/utils/ui";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode,
  className?: string,
  href?: string,
  variant?: 'primary' | 'secondary'
  onlyForUsers?: boolean
}

function Button(
  {
    children,
    className,
    href,
    onlyForUsers = false,
    variant = 'primary',
    ...props
  }: ButtonProps) {
  const {data: session} = useSession();
  const isUser = !!session?.user;
  const isDisabled = onlyForUsers && !isUser;

  const classes = cn(
    "inline-flex px-6 py-3 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer",
    {
      'border hover:bg-gray-700 text-white bg-gray-800 border-gray-50 focus:ring-gray-500': variant === 'secondary' ,
      'border hover:bg-gray-200 text-gray-800 bg-white border-black focus:ring-gray-500': variant === 'primary' ,
      'opacity-50 cursor-not-allowed pointer-events-none': isDisabled,
    },
    className
  )

  if (href) {
    if (isDisabled) {
      return (
        <span className={classes} role="button" aria-disabled="true">
          {children}
        </span>
      )
    }
    return (
      <Link href={href} className={classes} role="button">
        {children}
      </Link>
    )
  }
  return (
    <button
      className={cn(classes, "disabled:opacity-50 disabled:cursor-not-allowed")}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  )

}

export default Button