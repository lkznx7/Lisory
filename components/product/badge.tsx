import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "rose" | "champagne" | "outline";
  className?: string;
}

const variants = {
  default: "bg-[#7A4B52] text-white",
  rose: "bg-[#D97D93] text-white",
  champagne: "bg-[#F8D8D3] text-[#7A4B52]",
  outline: "border border-[#F2DCDD] text-[#6E5A5D] bg-transparent",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
