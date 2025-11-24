"use client";

import { usePathname } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}

