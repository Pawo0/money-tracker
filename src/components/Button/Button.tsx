import {cn} from "@/lib/utils"
import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode,
  className?: string,
  href?: string,
  variant?: 'primary' | 'secondary'
}

function Button(
  {
    children,
    className,
    href,
    variant = 'primary',
    ...props
  }: ButtonProps) {

  const classes = cn(
    "inline-flex px-6 py-3 rounded-md font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      'border hover:bg-gray-700 text-white bg-gray-800 border-gray-50 focus:ring-gray-500': variant === 'secondary',
      'border hover:bg-gray-200 text-gray-800 bg-white border-black focus:ring-gray-500': variant === 'primary',
    },
    className
  )

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        role={"button"}
      >
        {children}
      </Link>
    )
  }
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  )

}


export default Button