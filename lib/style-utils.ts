/**
 * Style utility functions for adult wellness e-commerce platform
 * Provides consistent styling patterns across components
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind classes with proper precedence
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}

/**
 * Button styling variants
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  sharp: boolean = false
) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-baby-pink disabled:opacity-50 disabled:pointer-events-none";

  const radius = sharp ? "rounded-sm" : "rounded-md";

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-deep-oxblood text-white hover:bg-oxblood-mid active:bg-oxblood-light",
    secondary:
      "bg-baby-pink text-deep-oxblood border border-baby-pink-light hover:bg-baby-pink-light",
    ghost: "bg-transparent text-foreground hover:bg-baby-pink-lighter",
    destructive: "bg-destructive text-white hover:opacity-90",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };

  return cn(base, variantClasses[variant], sizeClasses[size], radius);
}

/**
 * Badge styling variants
 */
export type BadgeVariant = "info" | "danger" | "muted" | "success";

export function badgeClass(variant: BadgeVariant = "info") {
  const base =
    "inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium";

  const variantClasses: Record<BadgeVariant, string> = {
    info: "bg-baby-pink-lighter text-deep-oxblood border border-baby-pink",
    danger: "bg-destructive/10 text-destructive border border-destructive/20",
    muted: "bg-muted text-text-muted border border-border",
    success: "bg-green-50 text-green-700 border border-green-200",
  };

  return cn(base, variantClasses[variant]);
}

/**
 * Card styling with shadow and surface color
 */
export function cardClass(elevated: boolean = false) {
  const base = "rounded-md bg-card text-card-foreground overflow-hidden";
  const shadow = elevated ? "shadow-lg" : "shadow-sm";
  return cn(base, shadow);
}

/**
 * Input styling
 */
export function inputClass(error: boolean = false) {
  const base =
    "flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const errorClass = error
    ? "border-destructive focus-visible:ring-destructive"
    : "";
  return cn(base, errorClass);
}

/**
 * Focus ring utility
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-baby-pink focus-visible:ring-offset-2";
