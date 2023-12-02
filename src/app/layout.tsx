
import { cn } from "@lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@components/Navbar";
import Providers from "@components/Providers";
import { Toaster } from "@components/ui/toaster"

import "@app/globals.css";
import "react-loading-skeleton/dist/skeleton.css"



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${process.env.NEXT_APP_NAME} | Chat with PDF`,
  description: "Chat with your documents or PDF in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy text-primary",
            inter.className
          )}
        >
          <Navbar />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
