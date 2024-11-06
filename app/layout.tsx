import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import "./globals.css";

const gangwon = localFont({
  src: "./font/강원교육튼튼.woff2",
  variable: "--font-gangwon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "All Pokémon Names",
  description: "각 지방의 포켓몬 이름을 맞춰보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${gangwon.variable} font-gangwon`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
