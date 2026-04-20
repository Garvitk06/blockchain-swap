import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import LiveFeed from "@/components/LiveFeed";

import { StellarProvider } from "@/context/StellarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StellarSwap | Decentralized Exchange",
  description: "Swap tokens on Stellar with Soroban smart contracts",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <StellarProvider>
          {children}
          <LiveFeed />
          <Toaster richColors position="top-right" />
        </StellarProvider>
      </body>
    </html>
  );
}
