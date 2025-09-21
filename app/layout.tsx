import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActiveProvider } from "./context/ActiveContext";
import { Playfair_Display, Merriweather } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${merriweather.variable}`}
        suppressHydrationWarning={true}
      >
        <ActiveProvider>
          <Header />
          {children}
          <Footer />
        </ActiveProvider>
      </body>
    </html>
  );
}
