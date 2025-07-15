import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-pill text-base font-semibold shadow-neumorph ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-purple text-white hover:bg-teal",
        destructive: "bg-coral text-white hover:bg-purple/80",
        outline: "border border-midnight/10 bg-white hover:bg-lilac/30 text-midnight",
        secondary: "bg-lilac text-midnight hover:bg-purple/10",
        ghost: "hover:bg-lilac/40 text-purple",
        link: "text-purple underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-pill px-4 py-1.5 text-sm",
        lg: "h-12 rounded-pill px-8 py-3 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 