import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ActiveProvider } from "./context/ActiveContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ActiveProvider>
          <Header />
          {children}
          <Footer />
        </ActiveProvider>
      </body>
    </html>
  );
}
