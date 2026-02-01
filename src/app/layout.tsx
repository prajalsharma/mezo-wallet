import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "./globals.css";

const Providers = dynamic(() => import("@/components/Providers"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mezo Wallet Manager | Bitcoin L2 dApp",
  description:
    "Manage your Bitcoin and ERC-20 assets on the Mezo Network. Connect via Unisat, OKX, or Xverse wallets.",
  icons: {
    icon: "/icons/mezo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} style={{ background: '#ececec' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
