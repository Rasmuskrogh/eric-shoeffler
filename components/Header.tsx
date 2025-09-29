"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useActive } from "../app/context/ActiveContext";
import Navbar from "./Navbar";
import { NavItem } from "../types/interfaces";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const { active, setActive } = useActive();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBlueNavbar, setShowBlueNavbar] = useState(true);
  const [blueNavbarOpacity, setBlueNavbarOpacity] = useState(1);
  const [showRedNavbar, setShowRedNavbar] = useState(false);
  const [redNavbarOpacity, setRedNavbarOpacity] = useState(0);
  const [centerBlueLogo, setCenterBlueLogo] = useState(false);
  const [centerRedLogo, setCenterRedLogo] = useState(true);

  const blueNavItems: NavItem[] = [
    { label: "About me", href: "/about" },
    { label: "Agenda", href: "/agenda" },
    { label: "Listen & watch", href: "/listen" },
    { label: "Press", href: "/press" },
    { label: "Contact & bookning", href: "/contact" },
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

  const handleRedClick = () => {
    setActive(false);
    setCenterBlueLogo(false);
    setCenterRedLogo(false);
    setBlueNavbarOpacity(0);
    setTimeout(() => {
      setShowBlueNavbar(false);
      setCenterBlueLogo(true);
    }, 300);
    setTimeout(() => {
      setShowRedNavbar(true);
      setRedNavbarOpacity(1);
    }, 500);
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
      <div className={styles.white}>
        {/*         <div className={styles.languageSelector}>
          <div className={styles.language}>
            <input type="radio" name="language" id="swedish" defaultChecked />
            <label htmlFor="swedish">
              <span className={styles.flag}>
                <Image
                  src="/swedishFlag.svg"
                  alt="Swedish Flag"
                  width={20}
                  height={15}
                />
              </span>
              <span className={styles.languageText}>Svenska</span>
            </label>
          </div>
          <div className={styles.language}>
            <input type="radio" name="language" id="english" />
            <label htmlFor="english">
              <span className={styles.flag}>
                <Image
                  src="/englishFlag.svg"
                  alt="English Flag"
                  width={20}
                  height={15}
                />
              </span>
              <span className={styles.languageText}>English</span>
            </label>
          </div>
          <div className={styles.language}>
            <input type="radio" name="language" id="french" />
            <label htmlFor="french">
              <span className={styles.flag}>
                <Image
                  src="/frenchFlag.svg"
                  alt="French Flag"
                  width={20}
                  height={15}
                />
              </span>
              <span className={styles.languageText}>Français</span>
            </label>
          </div>
        </div> */}
      </div>
      <div
        className={`${styles.red} ${!active ? styles.active : ""}`}
        onClick={!active ? undefined : handleRedClick}
      >
        <div
          className={`${styles.textWrapper} ${
            centerRedLogo ? styles.centerLogo : ""
          }`}
        >
          <figure>
            {!active ? (
              <Link href="/">
                <Image
                  className={styles.bookButton}
                  src="/bookButton.svg"
                  alt="Book button"
                  width={100}
                  height={100}
                />
              </Link>
            ) : (
              <Image
                className={styles.bookButton}
                src="/bookButton.svg"
                alt="Book button"
                width={100}
                height={100}
              />
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
      </div>
    </header>
  );
}

export default Header;
