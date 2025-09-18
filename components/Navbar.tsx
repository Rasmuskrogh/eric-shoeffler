"use client";

import React from "react";
import styles from "./Navbar.module.css";
import { NavbarProps } from "../types/interfaces";

const Navbar: React.FC<NavbarProps> = ({ type, items, show }) => {
  return (
    <nav
      className={`${styles.navbar} ${styles[type]} ${
        show ? styles.show : styles.hide
      }`}
    >
      <ul className={styles.navList}>
        {items.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <a href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
