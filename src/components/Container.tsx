import React from "react"
import BottomNav from "@/components/BottomNav";
import {cn} from "@/lib/utils/ui";

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
        "bg-black/70 rounded-2xl min-h-screen flex flex-col mx-auto px-4 sm:px-6 lg:px-8 ",
        {
          'max-w-sm': size === 'sm',
          'max-w-md': size === 'md',
          'max-w-xl': size === 'xl',
          'max-w-none': size === 'full',
          'sm:max-w-xl xl:max-w-2xl': size === 'auto',
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