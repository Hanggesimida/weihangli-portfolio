import { ImageResponse } from "next/og";
import { SITE_URL } from "@/config/site";
import { routing } from "@/i18n/routing";

export const alt = "Weihang Li — Web Developer & Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#e8e8e3",
          color: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.6 }}>
          <span>Web Developer &amp; Designer</span>
          <span>{new URL(SITE_URL).host}</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 200,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
          }}
        >
          WEIHANG LI
        </div>
        <div style={{ display: "flex", fontSize: 30, opacity: 0.6, maxWidth: 760 }}>
          Fast, modern digital products — available for freelance projects worldwide.
        </div>
      </div>
    ),
    size,
  );
}
