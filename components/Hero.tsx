"use client";

import styles from "./Hero.module.css";
import { useActive } from "../app/context/ActiveContext";
import Image from "next/image";
import ContactForm from "./ContactForm";
import { useState, useEffect } from "react";

const Hero: React.FC = () => {
  const { active } = useActive();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isRetina, setIsRetina] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState<string>("");

  useEffect(() => {
    const checkScreenSize = () => {
      const newIsSmallScreen = window.innerWidth < 800;
      const newIsRetina = window.devicePixelRatio > 1;

      setIsSmallScreen(newIsSmallScreen);
      setIsRetina(newIsRetina);

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
          <h1 className={styles.taglineTitle}>Eric Schoeffler</h1>
          <p className={styles.taglineSubtitle}>
            The Franco-Swedish Bass Baritone
          </p>
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
