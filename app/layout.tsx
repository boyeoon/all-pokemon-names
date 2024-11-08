import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import "./globals.css";

const SCDream = localFont({
  src: "./font/SCDream5.woff2",
  variable: "--font-SCDream",
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
        className={`${SCDream.variable} font-SCDream`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
