

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "flexcraft.workspace - All-in-One Project Management Platform",
  description: "Flexcraft is the unified solution for project management, deployment automation, API testing, team collaboration, and AI-powered insights. Streamline your workflow with enterprise-grade MDM, patch management, and zero-touch deployment.",
  keywords: [
    "project management",
    "MDM software",
    "patch management",
    "zero touch deployment",
    "API testing",
    "team collaboration",
    "AI insights",
    "project deployment",
    "task management",
    "enterprise collaboration",
    "free project software"
  ],
  metadataBase: new URL('https://flexcraft.workspace'),
  openGraph: {
    title: "flexcraft.workspace - Unified Project Management Platform",
    description: "All-in-one solution for project management, deployment automation, and team collaboration with AI insights",
    url: "https://flexcraft.workspace",
    siteName: "flexcraft.workspace",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Flexcraft Workspace Dashboard",
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "flexcraft.workspace - Project Management Redefined",
    description: "Unify your workflow with AI-powered project management and deployment tools",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    }
  },
  authors: [
    { 
      name: "Flexcraft Team", 
      url: "https://flexcraft.workspace" 
    }
  ],
  creator: "Flexcraft Inc.",
  publisher: "Flexcraft Publishing",
  alternates: {
    canonical: "/",
  },
  category: "project management software",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  applicationName: "Flexcraft Workspace",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}