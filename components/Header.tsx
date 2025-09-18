"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useActive } from "../app/context/ActiveContext";
import Navbar from "./Navbar";
import { NavItem } from "../types/interfaces";
import Image from "next/image";

function Header() {
  const { active, setActive } = useActive();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBlueNavbar, setShowBlueNavbar] = useState(true);
  const [blueNavbarOpacity, setBlueNavbarOpacity] = useState(1);
  const [showRedNavbar, setShowRedNavbar] = useState(false);
  const [redNavbarOpacity, setRedNavbarOpacity] = useState(0);
  const [centerBlueLogo, setCenterBlueLogo] = useState(false);
  const [centerRedLogo, setCenterRedLogo] = useState(false);

  const blueNavItems: NavItem[] = [
    { label: "Om mig", href: "/about" },
    { label: "Kontakt", href: "/contact" },
    { label: "Bokning", href: "/booking" },
    { label: "Lyssna", href: "/listen" },
    { label: "Repertoar", href: "/repertoire" },
    { label: "Agenda", href: "/agenda" },
    { label: "Press", href: "/press" },
  ];

  const redNavItems: NavItem[] = [
    { label: "Band", href: "/band" },
    { label: "Musik", href: "/music" },
    { label: "Konserter", href: "/concerts" },
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
    // Reset logo centering
    setCenterRedLogo(false);
    setCenterBlueLogo(false);
    // Fade out red navbar
    setRedNavbarOpacity(0);
    setTimeout(() => {
      setShowRedNavbar(false);
      // Center red logo after navbar is invisible
      setCenterRedLogo(true);
    }, 300);
    // Show and fade in blue navbar after area transition
    setTimeout(() => {
      setShowBlueNavbar(true);
      setBlueNavbarOpacity(1);
    }, 500);
  };

  const handleRedClick = () => {
    setActive(false);
    // Reset logo centering
    setCenterBlueLogo(false);
    setCenterRedLogo(false);
    // Fade out blue navbar
    setBlueNavbarOpacity(0);
    setTimeout(() => {
      setShowBlueNavbar(false);
      // Center blue logo after navbar is invisible
      setCenterBlueLogo(true);
    }, 300);
    // Show and fade in red navbar after area transition
    setTimeout(() => {
      setShowRedNavbar(true);
      setRedNavbarOpacity(1);
    }, 500);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div
        className={`${styles.blue} ${active ? styles.active : ""}`}
        onClick={handleBlueClick}
      >
        <div
          className={`${styles.textWrapper} ${
            centerBlueLogo ? styles.centerLogo : ""
          }`}
        >
          <figure>
            <Image
              className={styles.EricLogo}
              src="/Eric logo.png"
              alt="Eric Shoeffler"
              width={100}
              height={100}
            />
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
      <div className={styles.white}>
        <div className={styles.language}>
          <input type="radio" name="language" id="language" />
          <label htmlFor="language">Svenska</label>
        </div>
        <div className={styles.language}>
          <input type="radio" name="language" id="language" />
          <label htmlFor="language">Engelska</label>
        </div>
        <div className={styles.language}>
          <input type="radio" name="language" id="language" />
          <label htmlFor="language">Franska</label>
        </div>
      </div>
      <div
        className={`${styles.red} ${!active ? styles.active : ""}`}
        onClick={handleRedClick}
      >
        <div
          className={`${styles.textWrapper} ${
            centerRedLogo ? styles.centerLogo : ""
          }`}
        >
          <figure>
            <Image
              className={styles.SMGLogo}
              src="/SMG logo.png"
              alt="Stockholm Music Group"
              width={100}
              height={100}
            />
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
      </div>
    </header>
  );
}

export default Header;
