import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import WhatsAppButton from "./components/whatsappbutton";
import { generateOrganizationJsonLd } from "@/lib/seo";
import { getSeoSettingsServer } from "@/lib/seo-server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://veerrealestate.com'),
  title: "Veer Real Estate | Leading Real Estate Consultant in Ahmedabad",
  description: "Discover luxury apartments, commercial showrooms, corporate offices, and premium bungalows across East & West Ahmedabad with Veer Real Estate.",
  keywords: ["real estate Ahmedabad", "property for sale Ahmedabad", "luxury apartments Ahmedabad", "commercial office Ahmedabad", "Veer Real Estate"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoSettings = await getSeoSettingsServer();
  const orgJsonLd = generateOrganizationJsonLd(seoSettings);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {seoSettings.googleSiteVerification && (
          <meta
            name="google-site-verification"
            content={seoSettings.googleSiteVerification}
          />
        )}
        {seoSettings.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${seoSettings.googleAnalyticsId}');
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
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
