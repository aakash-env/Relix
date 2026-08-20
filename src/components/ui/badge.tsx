import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-[#e0e7ff] text-[#4338ca]",
        secondary:   "bg-[#f4f0e8] text-[#6b6460] border border-[#c8c0b4]",
        success:     "bg-green-50 text-green-700 border border-green-100",
        warning:     "bg-amber-50 text-amber-700 border border-amber-100",
        error:       "bg-red-50 text-red-700 border border-red-100",
        forest:      "bg-[#d4e5d0] text-[#2c4f38]",
        outline:     "border border-[#c8c0b4] text-[#6b6460] bg-transparent",
        dark:        "bg-[#1c1a18] text-white",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
