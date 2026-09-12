import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shivalik Présenté",
    short_name: "Présenté",
    description: "Riverfront residences in GIFT City, Gandhinagar.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2efe8",
    theme_color: "#171715",
    icons: [{ src: "/favicon-512.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
