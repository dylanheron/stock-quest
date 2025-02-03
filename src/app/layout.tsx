import { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/shared/Header";

const formaDJrr = localFont({
  src: "../fonts/FormaDJRVariable.ttf",
  variable: "--font-forma"
});

export const metadata: Metadata = {
  title: "Stock Quest | Learn stocks the right way",
  description: "Stock Quest. Stocks are boring. Learn them the right way!"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={formaDJrr.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
