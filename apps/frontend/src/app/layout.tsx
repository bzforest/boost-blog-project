import type { Metadata } from "next";
import { Kanit, Caveat } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ['300', '400', '500', '600'],
  subsets: ['thai', 'latin'],
  variable: '--font-kanit',
});

const caveat = Caveat({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cursive',
});

export const metadata: Metadata = {
  title: "Boost Blog",
  description: "Boost Blog Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} ${caveat.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
