"use client";

import { useState, useEffect } from "react";
import { useActive } from "../../../app/context/ActiveContext";
import { NavItem } from "../../../types/interfaces";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";

import Navbar from "./Navbar";
import LanguageSwitcher from "../../LanguageSwitcher/LanguageSwitcher";
import RequestButton from "./RequestButton";
import MobileMenu from "./MobileMenu";

import styles from "./Header.module.css";

function Header() {
  const { active, setActive } = useActive();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBlueNavbar, setShowBlueNavbar] = useState(true);
  const [blueNavbarOpacity, setBlueNavbarOpacity] = useState(1);
  const [centerBlueLogo, setCenterBlueLogo] = useState(false);
  const [centerRedLogo, setCenterRedLogo] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = useTranslations("Header");

  const blueNavItems: NavItem[] = [
    { label: t("home"), href: "/" },
    /* { label: "News", href: "/news" }, */
    { label: t("schedule"), href: "/schedule" },
    { label: t("media"), href: "/media" },
    { label: t("aboutMe"), href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBlueClick = () => {
    setActive(true);
    setCenterRedLogo(false);
    setCenterBlueLogo(false);
    setTimeout(() => {
      setCenterRedLogo(true);
    }, 300);
    setTimeout(() => {
      setShowBlueNavbar(true);
      setBlueNavbarOpacity(1);
    }, 500);
  };

  useEffect(() => {
    if (!active) {
      setBlueNavbarOpacity(0);
      setCenterBlueLogo(false);
      setCenterRedLogo(false);
      setTimeout(() => {
        setShowBlueNavbar(false);
      }, 300);
    } else {
      setCenterRedLogo(false);
      setCenterBlueLogo(false);
      setTimeout(() => {
        setShowBlueNavbar(true);
        setBlueNavbarOpacity(1);
      }, 500);
    }
  }, [active]);

  const handleRedClick = () => {
    console.log(
      "handleRedClick called - current pathname:",
      pathname,
      "current active:",
      active
    );

    if (pathname === "/" && !active) {
      return;
    }

    // Navigate to home page if not already there
    if (pathname !== "/") {
      router.push("/");
    }

    setActive(false);
    setCenterBlueLogo(false);
    setCenterRedLogo(false);
    setBlueNavbarOpacity(0);
    setTimeout(() => {
      setShowBlueNavbar(false);
    }, 300);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div
        className={`${styles.blue} ${active ? styles.active : ""}`}
        onClick={active ? undefined : handleBlueClick}
      >
        <div
          className={`${styles.textWrapper} ${
            centerBlueLogo ? styles.centerLogo : ""
          }`}
        >
          <figure>
            <Link
              href="/"
              className={`${styles.ericLogoLink} ${
                !active ? styles.inactive : ""
              }`}
            >
              <Image
                className={styles.EricLogo}
                src="/Eric logo.png"
                alt="Eric Shoeffler"
                width={100}
                height={100}
              />
            </Link>
          </figure>
          {showBlueNavbar && (
            <div
              style={{
                opacity: blueNavbarOpacity,
                transition: "opacity 0.8s ease-in-out",
              }}
            >
              <Navbar type="blue" items={blueNavItems} show={true} />
            </div>
          )}
        </div>
      </div>
      <div
        className={`${styles.red} ${!active ? styles.active : ""}`}
        onClick={!active ? undefined : handleRedClick}
      >
        <LanguageSwitcher />
        <div
          className={`${styles.textWrapper} ${
            centerRedLogo ? styles.centerLogo : ""
          }`}
        >
          <figure>
            <RequestButton
              active={active}
              pathname={pathname}
              onRequest={handleRedClick}
              onBack={() => setActive(true)}
            />
          </figure>
        </div>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onToggle={setIsMobileMenuOpen}
          items={blueNavItems}
        />
      </div>
    </header>
  );
}

export default Header;

