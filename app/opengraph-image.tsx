import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — Backend engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";

/**
 * Satori (the renderer behind ImageResponse) resolves neither CSS custom
 * properties nor the next/font variables, so token values are inlined here.
 * These are the dark-scheme tokens from globals.css — keep them in sync.
 */
const INK = "#f5f5f7";
const MUTED = "#86868b";
const LINE = "#38383a";
const ACCENT = "#0a84ff";
const BG = "#000000";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 62,
              lineHeight: 1.12,
              letterSpacing: "-0.025em",
              color: INK,
              maxWidth: 900,
            }}
          >
            Backend services — APIs, authentication systems, and applied-AI
            pipelines.
          </div>
        </div>

        {/* Simplified request chain, echoing the hero diagram. */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {["client", "api", "auth", "db"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  border: `1px solid ${LINE}`,
                  borderRadius: 8,
                  padding: "12px 22px",
                  fontSize: 24,
                  color: INK,
                }}
              >
                {label}
              </div>
              {i < 3 && (
                <div
                  style={{
                    width: 56,
                    height: 2,
                    background: ACCENT,
                    margin: "0 6px",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: MUTED,
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
          }}
        >
          <div>yashsehrawat.in</div>
          <div>VIT Vellore · B.Tech CSE</div>
        </div>
      </div>
    ),
    size,
  );
}
