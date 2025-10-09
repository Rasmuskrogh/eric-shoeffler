"use client";

import { useState, useEffect } from "react";
import styles from "./FormSpacer.module.css";

export default function FormSpacer() {
  const [isVisible, setIsVisible] = useState(true);
  const [isBelow, setIsBelow] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      setIsVisible(true); // Alltid synlig
      setIsBelow(width >= 1200); // Text bara över 1200px
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
      {isBelow && (
        <p className={styles.text}>
          With a solid vocal education, extensive experience across both
          classical and contemporary genres, and a wide network of musicians,
          pianists, DJs, and event organizers, Eric Schoeffler is the natural
          choice when booking a singer and live music for weddings,
          christenings, funerals, corporate events, or private celebrations.
          Based in Stockholm but performing internationally, Eric tailors his
          music to each occasion and regularly collaborates with the Stockholm
          Music Group in addition to his opera and concert performances. Contact
          us for a free quote, consultation, or advice when booking live music
          and vocals for weddings, events, parties, or studio recordings.
        </p>
      )}
    </div>
  );
}
