import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-md backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-primary/50 bg-primary/20 text-primary hover:bg-primary/30 hover:border-primary shadow-primary/50",
        secondary:
          "border-secondary/50 bg-secondary/20 text-secondary hover:bg-secondary/30 hover:border-secondary shadow-secondary/50",
        destructive:
          "border-destructive/50 bg-destructive/20 text-destructive hover:bg-destructive/30 hover:border-destructive shadow-destructive/50",
        outline: "border-primary/50 text-foreground hover:bg-primary/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
