import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulmoVerde — Saltillo respira. Saltillo protege.",
  description:
    "Plataforma ciudadana de educación ambiental y bienestar animal para Saltillo, Coahuila. Conoce la Ley de Seres Sintientes, la calidad del aire y firma tu compromiso.",
  keywords: [
    "calidad del aire",
    "Saltillo",
    "bienestar animal",
    "seres sintientes",
    "PulmoVerde",
    "medio ambiente",
  ],
  openGraph: {
    title: "PulmoVerde — Saltillo respira. Saltillo protege.",
    description:
      "Plataforma ciudadana de educación ambiental y bienestar animal para Saltillo, Coahuila.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="min-h-screen font-[family-name:var(--font-body)] antialiased">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
