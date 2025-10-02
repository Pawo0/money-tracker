import React from "react"
import {cn} from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode,
  className?: string,
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto'
}

function Container({
  children,
  className,
  size = 'auto'
}: ContainerProps) {
  return (
    <section
      className={cn(
        "bg-black/70 rounded-2xl min-h-screen flex justify-center mx-auto p-4 sm:p-6 lg:p-8",
        {
          'max-w-sm': size === 'sm',
          'max-w-md': size === 'md',
          'max-w-xl': size === 'xl',
          'max-w-none': size === 'full',
          'max-w-sm sm:max-w-md md:max-w-xl xl:max-w-2xl' : size === 'auto'
        },
        className
      )}
    >
      {children}
    </section>
  )
}


export default Container