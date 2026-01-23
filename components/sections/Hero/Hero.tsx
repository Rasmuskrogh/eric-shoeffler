"use client";

import styles from "./Hero.module.css";
import { useActive } from "../../../app/context/ActiveContext";
import Image from "next/image";
import ContactForm from "../../features/contact/ContactForm";
import { useState, useEffect } from "react";

interface HeroProps {
  name?: string;
  tagline?: string;
  contactText?: string;
  imageLarge?: string;
  imageSmall?: string;
}

const Hero = ({
  name,
  tagline,
  contactText,
  imageLarge,
  imageSmall,
}: HeroProps) => {
  const { active } = useActive();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsSmallScreen = window.innerWidth < 800;
      setIsSmallScreen(newIsSmallScreen);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Use image from database (Cloudinary URL) based on screen size
  // Treat empty strings as undefined to use fallback
  const effectiveImageSmall =
    imageSmall && typeof imageSmall === "string" && imageSmall.trim()
      ? imageSmall
      : undefined;
  const effectiveImageLarge =
    imageLarge && typeof imageLarge === "string" && imageLarge.trim()
      ? imageLarge
      : undefined;

  const heroImageUrl = isSmallScreen
    ? effectiveImageSmall || "/eric-standing.JPG"
    : effectiveImageLarge || "/eric-hero.jpg";

  return (
    <section className={styles.hero}>
      <div className={`${styles.blueArea} ${active ? styles.active : ""}`}>
        <article className={styles.tagline}>
          {name && <h1 className={styles.taglineTitle}>{name}</h1>}
          {tagline && <p className={styles.taglineSubtitle}>{tagline}</p>}
        </article>
        <figure className={styles.profileImageWrapper}>
          <Image
            className={styles.profileImage}
            src={heroImageUrl}
            alt="Eric Schoeffler"
            fill
            priority
            quality={95}
            unoptimized={true}
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
              <p>{contactText || ""}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;
