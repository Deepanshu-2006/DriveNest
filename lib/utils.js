import { clsx } from "clsx"
import { streetName } from "tailwind-merge" // Note: we'll import twMerge
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
