"use client";

import React from "react";
import styles from "./Hero.module.css";
import { useActive } from "../app/context/ActiveContext";
import Image from "next/image";

const Hero: React.FC = () => {
  const { active } = useActive();

  return (
    <section className={styles.hero}>
      <div className={`${styles.blueArea} ${active ? styles.active : ""}`}>
        <article className={styles.tagline}>
          <h1 className={styles.taglineTitle}>Eric Shoeffler</h1>
          <p className={styles.taglineSubtitle}>
            Upplev klassisk musik med passion och precision.
          </p>
        </article>
        <figure className={styles.profileImageWrapper}>
          <Image
            className={styles.profileImage}
            src="/ProfilePicture Eric Shoeffler.png"
            alt="Erik Shoeffler"
            width={400}
            height={400}
          />
        </figure>
      </div>
      <div className={styles.whiteArea} />
      <div className={`${styles.redArea} ${!active ? styles.active : ""}`} />
    </section>
  );
};

export default Hero;
