import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Endustry",
  description: "Manage invoices and weight tickets for your business",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className} ${poppins.variable}`}>
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}