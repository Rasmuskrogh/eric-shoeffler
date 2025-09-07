/* "use client";

import React from "react";
import styles from "./Hero.module.css";
import { useActive } from "../app/context/ActiveContext";

function Hero() {
  const { active } = useActive();
  return (
    <section className={styles.hero}>
          <div className={`${styles.blue} ${active ? styles.active : ""}`} />
      <div className={styles.white} />
      <div className={`${styles.red} ${!active ? styles.active : ""}`} /> 
    </section>
  );
}

export default Hero;
 */

// app/components/Hero.tsx
"use client";

import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Blå sektion */}
        <path d="M0,0 L60,0 C65,20 65,40 65,100 L0,100 Z" fill="#005bbb" />

        {/* Vit sektion */}
        <path
          d="M60,0 L80,0 C75,20 75,40 75,100 L65,100 L65,0 Z"
          fill="#ffffff"
        />

        {/* Röd sektion */}
        <path
          d="M80,0 L100,0 L100,100 L75,100 C75,40 85,20 80,0 Z"
          fill="#d7141a"
        />
      </svg>
    </section>
  );
};

export default Hero;
