import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gulshan Club - Sports Event 2025",
  description:
    "Join us for the biggest sports event of 2025 at Gulshan Club. Experience thrilling competitions, community spirit, and unforgettable moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} font-sora antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
