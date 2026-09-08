import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type ImageFrameProps = ComponentPropsWithoutRef<"div"> & { src?: string; priority?: boolean; sizes?: string };

export function ImageFrame({ className = "", src, style, priority = false, sizes = "(max-width: 800px) 100vw, 50vw", ...props }: ImageFrameProps) {
  const alt = props["aria-label"] ?? "";
  return <div className={`image-frame ${src ? "has-image" : ""} ${className}`.trim()} style={style} {...props}>{src && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />}</div>;
}
