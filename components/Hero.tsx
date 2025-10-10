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
            The Franco-Swedish Bass Baritone
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
          <>
            <div className={styles.formContainer}>
              <ContactForm />
            </div>
            <div className={styles.contactText}>
              <p>
                With a solid vocal education, extensive experience across both
                classical and contemporary genres, and a wide network of
                musicians, pianists, DJs, and event organizers, Eric Schoeffler
                is the natural choice when booking a singer and live music for
                weddings, christenings, funerals, corporate events, or private
                celebrations. Based in Stockholm but performing internationally,
                Eric tailors his music to each occasion and regularly
                collaborates with the Stockholm Music Group in addition to his
                opera and concert performances. Contact us for a free quote,
                consultation, or advice when booking live music and vocals for
                weddings, events, parties, or studio recordings.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
