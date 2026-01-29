import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AskTaaza - Interview Questions",
  description: "Recent interview questions based on candidate reports",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  openGraph: {
    title: "AskTaaza - Interview Questions",
    description: "Recent interview questions based on candidate reports",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f172a] text-[#f1f5f9] flex flex-col min-h-screen`}
      >
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        {gaMeasurementId && (
          <>
            <GoogleAnalytics gaId={gaMeasurementId} />
            <AnalyticsProvider />
          </>
        )}
      </body>
    </html>
  );
}