import type { Metadata } from "next";
import localFont from "next/font/local";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import "./globals.css";

const danjunghae = localFont({
  src: "./font/Cafe24Danjunghae-v2.0.woff2",
  variable: "--font-danjunghae",
  display: "swap",
});

export const metadata: Metadata = {
  title: "All Pokémon Names",
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
        className={`${danjunghae.variable} font-danjunghae`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
