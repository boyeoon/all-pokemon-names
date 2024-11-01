import type { Metadata } from "next";

import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";

import "./globals.css";

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
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
