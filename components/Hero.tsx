"use client";

import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import { useActive } from "../app/context/ActiveContext";
import Image from "next/image";

const Hero: React.FC = () => {
  const { active } = useActive();
  const [imageOpacity, setImageOpacity] = useState(1);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (!active) {
      // När active blir false, sänk opacity till 0
      setImageOpacity(0);
      // Ta bort från DOM efter fade-out är klar (300ms)
      setTimeout(() => {
        setShowContent(false);
      }, 300);
    } else {
      // När active blir true, vänta 0.3s först
      setTimeout(() => {
        setShowContent(true);
        // Fade-in direkt efter att innehållet läggs till
        setImageOpacity(1);
      }, 300);
    }
  }, [active]);

  return (
    <section className={styles.hero}>
      <div className={`${styles.blueArea} ${active ? styles.active : ""}`}>
        {showContent && (
          <>
            <article className={styles.tagline}>
              <h1 className={styles.taglineTitle}>Eric Shoeffler</h1>
              <p className={styles.taglineSubtitle}>
                Upplev klassisk musik med passion och precision.
              </p>
            </article>
            <figure
              className={styles.profileImageWrapper}
              style={{
                opacity: imageOpacity,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <Image
                className={styles.profileImage}
                src="/ProfilePicture Eric Shoeffler.png"
                alt="Erik Shoeffler"
                width={400}
                height={400}
              />
            </figure>
          </>
        )}
      </div>
      <div className={styles.whiteArea} />
      <div className={`${styles.redArea} ${!active ? styles.active : ""}`} />
    </section>
  );
};

export default Hero;
