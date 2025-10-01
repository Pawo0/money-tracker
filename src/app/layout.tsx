import type {Metadata} from "next";
import {Inter} from 'next/font/google'
import "./globals.css";
import Container from "@/components/Container";
import Providers from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})
export const metadata: Metadata = {
  title: "Money Tracker",
  description: "Application to monitor your money",
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
