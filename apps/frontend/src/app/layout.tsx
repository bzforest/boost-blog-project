import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ['300', '400', '500', '600'],
  subsets: ['thai', 'latin'],
  variable: '--font-kanit',
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
      <body className={`${kanit.variable} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
