import type { Metadata } from "next";
import { Kanit, Caveat } from "next/font/google";
import { Toaster } from "react-hot-toast";
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
      <body className={`${kanit.variable} ${caveat.variable} min-h-full flex flex-col`}>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            success: { iconTheme: { primary: "#4ade80", secondary: "#111" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#111" } },
          }}
        />
      </body>
    </html>
  );
}
