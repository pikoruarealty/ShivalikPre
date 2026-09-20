import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type ImageFrameProps = ComponentPropsWithoutRef<"div"> & { src?: string; priority?: boolean; sizes?: string };

const optimizedAssets: Record<string, string> = {
  "/images/presente/landscape/podium-garden.png": "/images/presente/landscape/podium-garden.webp",
  "/images/presente/amenities/private-wellness-pool.png": "/images/presente/amenities/private-wellness-pool.webp",
  "/images/presente/architecture/three-expressions.png": "/images/presente/architecture/three-expressions.webp",
  "/images/presente/amenities/social-dining-lounge.png": "/images/presente/amenities/social-dining-lounge.webp",
  "/images/presente/interiors/private-arrival-gallery.png": "/images/presente/interiors/private-arrival-gallery.webp",
  "/images/presente/amenities/private-cinema-games.png": "/images/presente/amenities/private-cinema-games.webp",
  "/images/presente/interiors/private-lift-foyer.png": "/images/presente/interiors/private-lift-foyer.webp",
  "/images/presente/location/gift-city-skyline.jpeg": "/images/presente/location/gift-city-skyline.webp",
};

export function ImageFrame({ className = "", src, style, priority = false, sizes = "(max-width: 800px) 100vw, 50vw", ...props }: ImageFrameProps) {
  const alt = props["aria-label"] ?? "";
  const imageSrc = src ? (optimizedAssets[src] ?? src) : undefined;
  return <div className={`image-frame ${imageSrc ? "has-image" : ""} ${className}`.trim()} style={style} {...props}>{imageSrc && <Image src={imageSrc} alt={alt} fill sizes={sizes} fetchPriority={priority ? "high" : undefined} loading={priority ? "eager" : undefined} />}</div>;
}
