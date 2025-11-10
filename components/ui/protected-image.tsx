/**
 * ProtectedImage Component
 * Renders neutral thumbnail for unverified users, signed URL images for verified users
 */

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "./badge";

interface ProtectedImageProps {
  productId: string;
  imageKey: string;
  publicThumbnail?: string;
  isVerified: boolean;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProtectedImage({
  productId,
  imageKey,
  publicThumbnail,
  isVerified,
  alt,
  className = "",
  width = 400,
  height = 400,
  priority = false,
}: ProtectedImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isVerified && imageKey && !signedUrl) {
      setLoading(true);
      fetch(`/api/assets/signed?key=${encodeURIComponent(imageKey)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch signed URL");
          return res.json();
        })
        .then((data) => {
          setSignedUrl(data.url);
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [isVerified, imageKey, signedUrl]);

  // Unverified users see neutral thumbnail with overlay
  if (!isVerified) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={publicThumbnail || "/images/placeholder-neutral.jpg"}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-bg-900/60 flex flex-col items-center justify-center gap-2">
          <Badge variant="info">Verified Users Only</Badge>
          <p className="text-white text-sm font-medium">Age 18+</p>
        </div>
      </div>
    );
  }

  // Verified users see the full image
  if (loading) {
    return (
      <div
        className={`relative bg-muted animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  if (error || !signedUrl) {
    return (
      <div
        className={`relative bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <p className="text-text-muted text-sm">Image unavailable</p>
      </div>
    );
  }

  return (
    <Image
      src={signedUrl}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
