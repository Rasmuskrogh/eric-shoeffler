"use client";

import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useActive } from "../app/context/ActiveContext";

function Header() {
  const { active, setActive } = useActive();
  const [displayText, setDisplayText] = useState("Eric Shoeffler");
  const [displaySubtext, setDisplaySubtext] = useState("Klassisk basbaryton");
  const [redText, setRedText] = useState("Annat");
  const [redSubtext, setRedSubtext] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBlueClick = () => {
    setActive(true);
    setTimeout(() => {
      setDisplayText("Eric Shoeffler");
      setDisplaySubtext("Klassisk basbaryton");
      setRedText("Annat");
      setRedSubtext("");
    }, 150);
  };

  const handleRedClick = () => {
    setActive(false);
    setTimeout(() => {
      setRedText("Band namn");
      setRedSubtext("typ av musik??");
      setDisplayText("Klassiskt");
      setDisplaySubtext("");
    }, 150);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div
        className={`${styles.blue} ${active ? styles.active : ""}`}
        onClick={handleBlueClick}
      >
        <div className={styles.textWrapper}>
          <h1 className={styles.headers1}>{displayText}</h1>
          <p>{displaySubtext}</p>
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
        <div className={styles.textWrapper}>
          <h1 className={styles.headers1}>{redText}</h1>
          <p>{redSubtext}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
