import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import WhatsAppButton from "./components/whatsappbutton";

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ClientLayout>
          {children}
          <WhatsAppButton phoneNumber="+919727027052" />
        </ClientLayout>
      </body>
    </html>
  );
}

