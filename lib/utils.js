import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getSendbirdUserId(email) {
  if (!email) return '';
  return email.trim().toLowerCase()
    .replace(/@/g, '_at_')
    .replace(/\./g, '_dot_');
}
