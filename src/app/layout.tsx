import type { Metadata } from "next";
import { Archivo, DM_Sans } from "next/font/google";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const themeBootstrap = `(() => { try { const stored = localStorage.getItem("team-ortega:theme"); const theme = stored === "light" || stored === "dark" ? stored : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) {} })();`;

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-team-body",
  display: "swap",
});

const displayFont = Archivo({
  subsets: ["latin"],
  variable: "--font-team-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Team Ortega | Entrenamiento personal",
    template: "%s | Team Ortega",
  },
  description:
    "Entrenamiento y nutrición personalizados con un seguimiento cercano y sencillo.",
  applicationName: "Team Ortega",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Team Ortega | Entrenamiento personal",
    description:
      "Entrenamiento y nutrición personalizados con un seguimiento cercano y sencillo.",
    siteName: "Team Ortega",
    images: [{ url: "/brand/team-ortega-mark.png", width: 1024, height: 1024 }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
