/**
 * Card Component
 * Reusable card with surface background and shadow
 */

import * as React from "react";
import { cardClass } from "@/lib/style-utils";
import Link from "next/link";
import Image from "next/image";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  title?: string;
  excerpt?: string;
  footer?: React.ReactNode;
}

export function Card({
  elevated = false,
  href,
  imageSrc,
  imageAlt = "",
  title,
  excerpt,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  const cardContent = (
    <>
      {imageSrc && (
        <div className="relative w-full aspect-square">
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        {title && (
          <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
        )}
        {excerpt && (
          <p className="text-sm text-muted-foreground mb-3">{excerpt}</p>
        )}
        {children}
      </div>
      {footer && <div className="px-4 pb-4 pt-0">{footer}</div>}
    </>
  );

  const cardClasses = cardClass(elevated) + (className ? ` ${className}` : "");

  if (href) {
    return (
      <Link
        href={href}
        className={`${cardClasses} block hover:shadow-md transition-shadow`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {cardContent}
    </div>
  );
}
