import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-display",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Intelligence Prospect",
  description: "Moteur de qualification de prospects par intelligence artificielle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${jetbrains.variable} ${outfit.variable}`}>
      <body className="font-body antialiased">
        {/* Fixed vertical gold rule */}
        <div className="vertical-rule" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
