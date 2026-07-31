import type { Metadata } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import { site } from "@/content/site";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Backend engineer building APIs, authentication systems, and applied-AI pipelines. Final-year CS student at VIT Vellore.";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: `${site.name} — Backend engineer`,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} — Backend engineer`,
    description,
    url: site.domain,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    // TODO: add og-image.png (1200×630) to /public.
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Backend engineer`,
    description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.domain,
  email: `mailto:${site.email}`,
  jobTitle: "Backend engineer",
  sameAs: [site.github, site.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: (education.find((e) => e.primary) ?? education[0]).institution,
  },
  knowsAbout: [
    "Backend development",
    "Java",
    "Spring Boot",
    "Node.js",
    "FastAPI",
    "REST API design",
    "Retrieval-augmented generation",
  ],
  hasCredential: certifications.flatMap((group) =>
    group.items.map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.name,
      credentialCategory: "certificate",
      url: cert.verify,
      recognizedBy: { "@type": "Organization", name: cert.issuer },
    })),
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Browser extensions (Dark Reader, Grammarly) inject attributes onto
    // <html> before hydration. Suppressing here only affects this element's
    // attributes, not the tree below it.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
