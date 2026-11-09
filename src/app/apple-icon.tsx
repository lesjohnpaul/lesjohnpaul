import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/brand/logo-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS rounds the corners itself, so the mark sits on a full-bleed dark tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0E0F14" }}>
        <LogoMark size={150} framed={false} />
      </div>
    ),
    { ...size },
  );
}
