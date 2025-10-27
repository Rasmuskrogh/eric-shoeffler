import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActiveProvider } from "./context/ActiveContext";
import { Playfair_Display, Merriweather } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  title: "Erik Schoeffler",
  description: "Official website of Erik Schoeffler",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${merriweather.variable}`}
        suppressHydrationWarning={true}
      >
        <NextIntlClientProvider messages={messages}>
          <ActiveProvider>
            <Header />
            {children}
            <Footer />
          </ActiveProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
