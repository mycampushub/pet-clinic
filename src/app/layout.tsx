import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetClinic Pro - Veterinary Practice Management",
  description: "Comprehensive veterinary practice management software for modern clinics",
  keywords: ["veterinary", "clinic management", "pet care", "medical records", "scheduling"],
  authors: [{ name: "PetClinic Pro Team" }],
  openGraph: {
    title: "PetClinic Pro",
    description: "Comprehensive veterinary practice management software",
    url: "https://petclinicpro.com",
    siteName: "PetClinic Pro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PetClinic Pro",
    description: "Comprehensive veterinary practice management software",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
