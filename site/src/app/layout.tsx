import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "BlockLucky - Loterie Blockchain Transparente",
  description: "Jouez en toute transparence grâce à la blockchain ! Une loterie digitale gamifiée pour découvrir la technologie blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${orbitron.variable}`}>
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
