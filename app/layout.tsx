import "./globals.css";
import Header from "@/components/Header";
import ClientOnly from "./components/ClientOnly";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientOnly>
          <Header />
        </ClientOnly>
        {children}
        <Footer />
      </body>
    </html>
  );
}
