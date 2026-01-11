import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Culinary Class War Restaurants | 흑백요리사 식당 가이드",
  description: "Discover and book restaurants from Netflix's Culinary Class War (흑백요리사). Find restaurants by celebrity chefs from Season 1 & 2 in Seoul, Korea.",
  keywords: ["Culinary Class War", "흑백요리사", "Korean restaurants", "Seoul dining", "Netflix", "chef restaurants", "Korea travel"],
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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
