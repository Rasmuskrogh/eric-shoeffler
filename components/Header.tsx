"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useActive } from "../app/context/ActiveContext";
import Navbar from "./Navbar";
import { NavItem } from "../types/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher/LanguageSwitcher";

function Header() {
  const { active, setActive } = useActive();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBlueNavbar, setShowBlueNavbar] = useState(true);
  const [blueNavbarOpacity, setBlueNavbarOpacity] = useState(1);
  const [showRedNavbar, setShowRedNavbar] = useState(false);
  const [redNavbarOpacity, setRedNavbarOpacity] = useState(0);
  const [centerBlueLogo, setCenterBlueLogo] = useState(false);
  const [centerRedLogo, setCenterRedLogo] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const blueNavItems: NavItem[] = [
    { label: "Home", href: "/" },
    /* { label: "News", href: "/news" }, */
    { label: "Schedule", href: "/agenda" },
    { label: "Media", href: "/listen" },
    { label: "About me", href: "/about" },
  ];

  const redNavItems: NavItem[] = [];

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
    setRedNavbarOpacity(0);
    setTimeout(() => {
      setShowRedNavbar(false);
      setCenterRedLogo(true);
    }, 300);
    setTimeout(() => {
      setShowBlueNavbar(true);
      setBlueNavbarOpacity(1);
    }, 500);
  };

  // Handle when active state changes from external sources (like contact buttons)
  useEffect(() => {
    if (!active) {
      // Hide blue navbar when going to contact form
      setBlueNavbarOpacity(0);
      setCenterBlueLogo(false);
      setCenterRedLogo(false);
      setTimeout(() => {
        setShowBlueNavbar(false);
        // Ta bort centreringen av Eric-logon när BOOK-sidan är aktiv
        // setCenterBlueLogo(true);
      }, 300);
      setTimeout(() => {
        setShowRedNavbar(true);
        setRedNavbarOpacity(1);
      }, 500);
    } else {
      // Show blue navbar when going back to hero view
      setRedNavbarOpacity(0);
      setCenterRedLogo(false);
      setCenterBlueLogo(false);
      setTimeout(() => {
        setShowRedNavbar(false);
      }, 300);
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
    console.trace("handleRedClick called from:");

    // Don't do anything if we're on home page and already in contact mode
    if (pathname === "/" && !active) {
      console.log("Already on home page in contact mode, ignoring click");
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
      // Ta bort centreringen av Eric-logon när BOOK-sidan är aktiv
      // setCenterBlueLogo(true);
    }, 300);
    setTimeout(() => {
      setShowRedNavbar(true);
      setRedNavbarOpacity(1);
    }, 500);
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stoppa event från att bubbla upp
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
            {active ? (
              <Link href="/">
                <Image
                  className={styles.EricLogo}
                  src="/Eric logo.png"
                  alt="Eric Shoeffler"
                  width={100}
                  height={100}
                />
              </Link>
            ) : (
              <Image
                className={styles.EricLogo}
                src="/Eric logo.png"
                alt="Eric Shoeffler"
                width={100}
                height={100}
              />
            )}
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
            {!active ? (
              pathname === "/" ? (
                <div
                  className={styles.bookButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(true);
                  }}
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 15,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 120 50"
                    width="100%"
                    height="100%"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="116"
                      height="46"
                      rx="8"
                      ry="8"
                      fill="transparent"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x="50%"
                      y="54%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontFamily="Arial, sans-serif"
                      fontSize="20"
                      fontWeight="bold"
                    >
                      BACK
                    </text>
                  </svg>
                </div>
              ) : (
                <Link href="/">
                  <div className={styles.bookButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 120 50"
                      width="100%"
                      height="100%"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="116"
                        height="46"
                        rx="8"
                        ry="8"
                        fill="transparent"
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x="50%"
                        y="54%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="Arial, sans-serif"
                        fontSize="20"
                        fontWeight="bold"
                      >
                        BACK
                      </text>
                    </svg>
                  </div>
                </Link>
              )
            ) : (
              <div className={styles.bookButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120 50"
                  width="100%"
                  height="100%"
                >
                  <rect
                    x="2"
                    y="2"
                    width="116"
                    height="46"
                    rx="8"
                    ry="8"
                    fill="transparent"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x="50%"
                    y="54%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontFamily="Arial, sans-serif"
                    fontSize="20"
                    fontWeight="bold"
                  >
                    REQUEST
                  </text>
                </svg>
              </div>
            )}
          </figure>
          {showRedNavbar && (
            <div
              style={{
                opacity: redNavbarOpacity,
                transition: "opacity 0.8s ease-in-out",
              }}
            >
              <Navbar type="red" items={redNavItems} show={true} />
            </div>
          )}
        </div>

        {/* Mobile hamburger menu */}
        <div className={styles.mobileMenuButton}>
          <button
            className={styles.hamburgerButton}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.open : ""
              }`}
            ></span>
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.open : ""
              }`}
            ></span>
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.open : ""
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className={styles.mobileMenuOverlay}
              onClick={handleMobileMenuToggle}
            ></div>
            <div className={styles.mobileMenu}>
              <Navbar
                type="blue"
                items={blueNavItems}
                show={true}
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
