import React from "react"
import {cn} from "@/lib/utils"
import BottomNav from "@/components/BottomNav";

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
        "bg-black/70 rounded-2xl min-h-screen flex flex-col mx-auto px-4 sm:px-6 lg:px-8",
        {
          'max-w-sm': size === 'sm',
          'max-w-md': size === 'md',
          'max-w-xl': size === 'xl',
          'max-w-none': size === 'full',
          'max-w-sm sm:max-w-md md:max-w-xl xl:max-w-2xl': size === 'auto',
        },
        className
      )}
    >
      <div className="py-4 gap-4 flex flex-col flex-1">{children}</div>
      <BottomNav/>
    </section>
  )
}


export default Container