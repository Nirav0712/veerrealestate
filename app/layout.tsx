import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClientLayout from "./components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeerRealEstate - Find Your Dream Property",
  description: "Discover premium properties across India. VeerRealEstate offers villas, apartments, and commercial spaces in Mumbai, Bangalore, Gurgaon, and more.",
  keywords: ["real estate India", "property for sale", "apartments Mumbai", "villas Bangalore", "buy property India", "VeerRealEstate"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
