import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

// Static string: marks the document dark before first paint when the stored
// preference resolves to dark, so the light default never flashes the wrong way.
const THEME_BOOT_SCRIPT = `(function(){var p=localStorage.getItem("todo-theme");var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){var s=document.createElement("style");s.id="theme-boot";s.textContent=":root{color-scheme:dark}";document.head.appendChild(s);}})();`;

export const metadata: Metadata = {
  title: "TODO App",
  description: "Plan your habits, reminders and tasks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={nunito.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <Script id="theme-boot-script" strategy="beforeInteractive">
          {THEME_BOOT_SCRIPT}
        </Script>
      </head>
      <body className="bg-canvas text-fg font-sans antialiased">
        <noscript>
          <style>{'[data-motion="pending"]{opacity:1 !important}'}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
