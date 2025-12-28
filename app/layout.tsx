import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import { AuthProvider } from "@/components/providers/AuthContext";

import { ConfigurationProvider } from "@/components/providers/configuration-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Project Hub - Pamerkan Karya Anda",
  description:
    "Platform untuk mahasiswa memamerkan proyek, menerima feedback, dan mendapat dukungan dari komunitas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <head>
        {midtransClientKey && (
          <Script
            src={midtransUrl}
            data-client-key={midtransClientKey}
            strategy="afterInteractive"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.__ENV__ = {
                NEXT_PUBLIC_API_URL: "${process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8000/api/v1"}",
              };
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigurationProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfigurationProvider>
        <Toaster />
      </body>
    </html>
  );
}
