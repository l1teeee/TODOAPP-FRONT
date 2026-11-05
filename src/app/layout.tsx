import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

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
    <html lang="en" className={nunito.variable}>
      <body className="bg-canvas text-fg font-sans antialiased">
        <noscript>
          <style>{'[data-motion="pending"]{opacity:1 !important}'}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
