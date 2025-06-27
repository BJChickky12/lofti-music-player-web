import type { Metadata } from "next";
import { Geist, Geist_Mono , VT323} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font pixel',
})

export const metadata: Metadata = {
  title: "🎵 Chill Lofi Music",
  description: "A chill lofi music for you!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${vt323.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
