/**
 * Badge Component
 * For "Verified users only" / "Age 18+" indicators
 */

import * as React from "react";
import { badgeClass, type BadgeVariant } from "@/lib/style-utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "info", className, ...props }: BadgeProps) {
  return (
    <div
      className={badgeClass(variant) + (className ? ` ${className}` : "")}
      {...props}
    />
  );
}
