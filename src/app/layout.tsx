import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
