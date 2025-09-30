import React from "react"
import {cn} from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode,
  className?: string,
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

function Container({
  children,
  className,
  size = 'xl'
}: ContainerProps) {
  return (
    <section
      className={cn(
        "min-h-screen flex justify-center mx-auto px-4 sm:px-6 lg:px-8",
        {
          'max-w-sm': size === 'sm',
          'max-w-md': size === 'md',
          'max-w-xl': size === 'xl',
          'max-w-none': size === 'full'  // no limit
        },
        className
      )}
    >
      {children}
    </section>
  )
}


export default Container