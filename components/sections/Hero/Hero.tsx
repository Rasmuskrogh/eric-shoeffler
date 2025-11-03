"use client";

import styles from "./Hero.module.css";
import { useActive } from "../../../app/context/ActiveContext";
import Image from "next/image";
import ContactForm from "../../features/contact/ContactForm";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

const Hero: React.FC = () => {
  const { active } = useActive();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");

  const t = useTranslations("Hero");

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsSmallScreen = window.innerWidth < 800;
      const newIsRetina = window.devicePixelRatio > 1;

      console.log(newIsRetina);
      setIsSmallScreen(newIsSmallScreen);

      // Fetch appropriate image based on screen size
      const fetchHeroImage = async () => {
        try {
          const imageName = newIsSmallScreen ? "eric-standing" : "eric-hero";
          const response = await fetch(
            `/api/hero-image?image=${imageName}&small=${newIsSmallScreen}`
          );
          const data = await response.json();
          if (data.url) {
            setHeroImageUrl(data.url);
          }
        } catch (error) {
          console.error("Error fetching hero image:", error);
          // Fallback to local images if API fails
          setHeroImageUrl(
            newIsSmallScreen ? "/eric-standing.JPG" : "/eric-hero.jpg"
          );
        }
      };

      fetchHeroImage();
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={`${styles.blueArea} ${active ? styles.active : ""}`}>
        <article className={styles.tagline}>
          <h1 className={styles.taglineTitle}>{t("name")}</h1>
          <p className={styles.taglineSubtitle}>{t("tagline")}</p>
        </article>
        <figure className={styles.profileImageWrapper}>
          <Image
            className={styles.profileImage}
            src={
              heroImageUrl ||
              (isSmallScreen ? "/eric-standing.JPG" : "/eric-hero.jpg")
            }
            alt="Erik Shoeffler"
            fill
            priority
            quality={95}
            unoptimized={false}
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
              <p>{t("description")}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;

