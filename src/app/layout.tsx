import type {Metadata} from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import Container from "@/components/layout/Container";
import Providers from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})
export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Your expenses. A clearer picture. Track and understand your finances.",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
    <body
      className={`${inter.variable} antialiased`}
    >
    <Providers>
      <Container>
        {children}
      </Container>
    </Providers>
    </body>
    </html>
  );
}
