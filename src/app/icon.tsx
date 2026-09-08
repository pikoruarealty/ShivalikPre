import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#171715", border: "22px solid #927d65", color: "#f7f5f0", fontSize: 286, fontFamily: "Georgia, serif", lineHeight: 1 }}>P</div>,
    size,
  );
}
