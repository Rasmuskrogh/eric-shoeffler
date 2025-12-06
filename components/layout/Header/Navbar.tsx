"use client";

import React from "react";
import styles from "./Navbar.module.css";
import { NavbarProps } from "../../../types/interfaces";
import { useActive } from "../../../app/context/ActiveContext";
import { useRouter } from "next/navigation";

const Navbar = ({ type, items, show, onItemClick }: NavbarProps) => {
  const { setActive } = useActive();
  const router = useRouter();

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stoppa event bubbling
    if (onItemClick) {
      onItemClick(); // Stäng hamburgermeny
    }
    router.push("/");
    setActive(false); // Gå till formulärssidan
    // Navbar försvinner automatiskt när active blir false
  };

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation(); // Stoppa event bubbling
    if (onItemClick) {
      onItemClick();
    }
    router.push(href);
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
              <button
                className={styles.navLink}
                onClick={(e) => handleItemClick(e, item.href)}
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
