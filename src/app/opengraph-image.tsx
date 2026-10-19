import { ImageResponse } from "next/og";

// Replaces the missing /og-image.jpg so LinkedIn/Facebook/X link previews render.
export const alt = "Les John Paul Oliver, AI Engineer: I build AI that solves business problems, fast.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1c1d27 0%, #0e0f14 60%, #050608 100%)",
          color: "#f5f5f4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#e0b94a" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#10b981", display: "flex" }} />
          Open to freelance projects &amp; remote AI roles
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>
            Les John Paul Oliver
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, color: "#e0b94a", marginTop: 16 }}>AI Engineer</div>
          <div style={{ fontSize: 32, color: "#a8a29e", marginTop: 24, maxWidth: 960 }}>
            AI agents, chatbots &amp; business automation that ship fast and solve real problems.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a8a29e" }}>lesjohnpauloliver.dev</div>
      </div>
    ),
    { ...size },
  );
}
