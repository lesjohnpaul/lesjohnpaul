import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 25%, #232431 0%, #0e0f14 55%, #050608 100%)",
          borderRadius: 40,
          boxShadow: "inset 0 0 0 4px rgba(224,185,74,0.5)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            background:
              "linear-gradient(135deg, #f1d68f 0%, #e0b94a 50%, #b58e26 100%)",
            backgroundClip: "text",
            color: "transparent",
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: -6,
            lineHeight: 1,
          }}
        >
          L
          <span
            style={{
              marginLeft: 4,
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#e0b94a",
              display: "block",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
