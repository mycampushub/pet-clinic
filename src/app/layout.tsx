import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PetClinic Pro - Veterinary Practice Management",
  description: "Enterprise-grade veterinary practice management software. Streamline appointments, medical records, billing, and inventory for single clinics to multi-location chains.",
  keywords: ["veterinary", "pet clinic", "practice management", "medical records", "appointments", "billing", "inventory"],
  authors: [{ name: "PetClinic Pro Team" }],
  openGraph: {
    title: "PetClinic Pro - Veterinary Practice Management",
    description: "Enterprise-grade veterinary practice management software for modern clinics.",
    url: "https://petclinicpro.com",
    siteName: "PetClinic Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetClinic Pro - Veterinary Practice Management",
    description: "Enterprise-grade veterinary practice management software.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
