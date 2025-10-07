"use client";

import styles from "./Hero.module.css";
import { useActive } from "../app/context/ActiveContext";
import Image from "next/image";
import ContactForm from "./ContactForm";
import { useState, useEffect } from "react";

const Hero: React.FC = () => {
  const { active } = useActive();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={`${styles.blueArea} ${active ? styles.active : ""}`}>
        <article className={styles.tagline}>
          <h1 className={styles.taglineTitle}>Eric Schoeffler</h1>
          <p className={styles.taglineSubtitle}>
            Upplev klassisk musik med passion och precision.
          </p>
        </article>
        <figure className={styles.profileImageWrapper}>
          <Image
            className={styles.profileImage}
            src={isSmallScreen ? "/eric-standing.JPG" : "/eric-hero.jpg"}
            alt="Erik Shoeffler"
            width={400}
            height={400}
          />
        </figure>
      </div>
      <div className={`${styles.redArea} ${!active ? styles.active : ""}`}>
        {!active && (
          <div className={styles.formContainer}>
            <ContactForm />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
