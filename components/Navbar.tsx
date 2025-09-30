"use client";

import React from "react";
import styles from "./Navbar.module.css";
import { NavbarProps } from "../types/interfaces";
import { useActive } from "../app/context/ActiveContext";
import { useRouter } from "next/navigation";

const Navbar: React.FC<NavbarProps> = ({ type, items, show }) => {
  const { setActive } = useActive();
  const router = useRouter();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
    setActive(false); // Gå till formulärssidan
    // Navbar försvinner automatiskt när active blir false
  };

  return (
    <nav
      className={`${styles.navbar} ${styles[type]} ${
        show ? styles.show : styles.hide
      }`}
    >
      <ul className={styles.navList}>
        {items.map((item, index) => (
          <li key={index} className={styles.navItem}>
            {item.href === "#contact" ? (
              <button onClick={handleContactClick} className={styles.navLink}>
                {item.label}
              </button>
            ) : (
              <a href={item.href} className={styles.navLink}>
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
