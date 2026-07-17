import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatProductPrice(price: number): number {
  if (typeof price !== "number" || isNaN(price)) return price;
  if (Number.isInteger(price)) {
    return price - 0.10;
  }
  return price;
}
