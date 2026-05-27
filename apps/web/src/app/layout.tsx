import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VedaAI Assessment Creator",
  description: "AI-powered assessment creation workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} ${inter.variable} font-heading`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
