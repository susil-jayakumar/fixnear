import { Bricolage_Grotesque, Atkinson_Hyperlegible } from "next/font/google";
import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const display = Bricolage_Grotesque({ variable: "--font-display", subsets: ["latin"] });
const body = Atkinson_Hyperlegible({ variable: "--font-body", subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "FixNear",
  description: "Find trusted local service providers near you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <Suspense fallback={<header className="site-header"><div className="wrap" /></header>}>
            <SiteHeader />
          </Suspense>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
