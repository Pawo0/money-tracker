import {cn} from "@/lib/utils"

interface ButtonProps {
  children: React.ReactNode,
  className?: string,
  variant?: 'primary' | 'secondary'
}

export default function Button(
  {
    children,
    className,
    variant = 'primary'
  }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-md font-medium transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2",
        {
          'border hover:bg-gray-700 text-white bg-gray-800 border-gray-50 focus:ring-gray-500': variant === 'secondary',
          'border hover:bg-gray-200 text-gray-800 bg-white border-black focus:ring-gray-500': variant === 'primary',
        },
        className
      )}
    >
      {children}
    </button>
  )

}