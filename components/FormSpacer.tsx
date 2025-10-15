"use client";

import { useState, useEffect } from "react";
import styles from "./FormSpacer.module.css";

export default function FormSpacer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      setIsVisible(width < 1200); // Bara synlig under 1200px
      setIsBelow(false); // Ingen text i FormSpacer alls
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.spacer}>
      <div className={styles.emptySpace}></div>
    </div>
  );
}
