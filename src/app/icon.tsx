import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
            "linear-gradient(135deg, #1c1d27 0%, #0e0f14 60%, #050608 100%)",
          borderRadius: 14,
          boxShadow: "inset 0 0 0 1.5px rgba(224,185,74,0.45)",
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
            fontSize: 44,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          L
          <span
            style={{
              marginLeft: 1,
              width: 6,
              height: 6,
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
