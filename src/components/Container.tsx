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
        "mx-auto px-4 sm:px-6 lg:px-8",
        {
          'max-w-2xl': size === 'sm',    // 672px - forms, narrow content
          'max-w-4xl': size === 'md',    // 896px - lists, tables
          'max-w-6xl': size === 'lg',    // 1152px - dashboards, charts
          'max-w-7xl': size === 'xl',    // 1280px - wide layouts, stats
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