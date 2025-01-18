import type { Metadata } from "next";
import localFont from "next/font/local";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { AuthProvider } from "./contexts/auth-context";
import { OrderProvider } from "./contexts/order-context";
import { ShoppingProvider } from "./contexts/shopping-context";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Luxe Revival",
  description:
    "Your destination for premium footwear. Quality meets style in every step.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ShoppingProvider>
            <OrderProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </OrderProvider>
          </ShoppingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
