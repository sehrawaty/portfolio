import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { links, profile } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://yashsehrawat.in"),
  title: "Yash Sehrawat — Backend Engineer",
  description:
    "Backend engineer building APIs, authentication systems, and applied-AI pipelines. Final-year CS student at VIT Vellore. Live LeetCode, Codeforces and GitHub stats.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "Yash Sehrawat — Backend Engineer",
    description: "APIs, auth systems and applied-AI pipelines. Live coding stats, projects and credentials.",
    url: "https://yashsehrawat.in",
    siteName: "Yash Sehrawat",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Yash Sehrawat — Backend Engineer" },
};

export const viewport: Viewport = { themeColor: "#07071a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.role,
              email: profile.email,
              url: "https://yashsehrawat.in",
              alumniOf: "Vellore Institute of Technology",
              sameAs: [links.github, links.linkedin, links.leetcode, links.codeforces],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
