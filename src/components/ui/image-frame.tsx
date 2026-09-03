import type { ComponentPropsWithoutRef } from "react";

type ImageFrameProps = ComponentPropsWithoutRef<"div"> & { src?: string };

export function ImageFrame({ className = "", src, style, ...props }: ImageFrameProps) {
  return <div className={`image-frame ${src ? "has-image" : ""} ${className}`.trim()} role="img" aria-label={props["aria-label"]} style={{ ...style, ...(src ? { backgroundImage: `url("${src}")` } : {}) }} {...props} />;
}
