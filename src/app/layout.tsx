import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Culinary Class War | The Ultimate Guide",
  description: "Discover and book Michelin-star restaurants from Netflix's hit show Culinary Class War (흑백요리사).",
  keywords: ["Culinary Class War", "흑백요리사", "Korean restaurants", "Seoul dining", "Netflix", "Michelin star", "Chef restaurants"],
  authors: [{ name: "Culinary Class War Guide" }],
  openGraph: {
    title: "Culinary Class War Restaurants",
    description: "Discover restaurants from Netflix's hit show 흑백요리사",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
