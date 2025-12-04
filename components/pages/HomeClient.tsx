"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/sections/Hero/Hero";
import AboutPreview from "@/components/sections/AboutPreview/AboutPreview";
import styles from "../../app/page.module.css";
import ListenPreview from "@/components/sections/ListenPreview/ListenPreview";
import RepertoirePreview from "@/components/sections/RepertoirePreview/RepertoirePreview";
import FormSpacer from "@/components/sections/FormSpacer/FormSpacer";
import { useActive } from "@/app/context/ActiveContext";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { ContentData } from "@/components/AdminDashboard/types";

interface HomeClientProps {
  homeData: ContentData | null;
  contactData: ContentData | null;
}

interface HomeData {
  name?: string;
  tagline?: string;
  aboutTitle?: string;
  description?: string;
  aboutButtonText?: string;
  listenTitle?: string;
  listenButtonText?: string;
  youtubeUrl?: string;
  imageLarge?: string;
  imageSmall?: string;
  profileImage?: string;
  SecondImage?: string;
}

interface ContactData {
  contactText?: string;
}

export default function HomeClient({ homeData, contactData }: HomeClientProps) {
  const { active } = useActive();
  const [showContent, setShowContent] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (!active) {
      // Start fade out when formulärssidan är aktiv (active = false)
      setShowContent(false);

      // Remove from DOM after transition completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // Match transition duration

      return () => clearTimeout(timer);
    } else {
      // Reset when going back to Eric side (active = true)
      setShowContent(true);
      setShouldRender(true);
    }
  }, [active]);

  if (!homeData) {
    return <div>Loading...</div>;
  }

  const home = homeData as unknown as HomeData;
  const contact = (contactData as unknown as ContactData) || {};

  // Convert YouTube URL to embed format
  const youtubeEmbedUrl =
    getYouTubeEmbedUrl(home.youtubeUrl) ||
    "https://www.youtube.com/embed/R60gOl6xHy0"; // Fallback

  return (
    <>
      <Hero
        name={home.name}
        tagline={home.tagline}
        contactText={contact.contactText}
        imageLarge={home.imageLarge}
        imageSmall={home.imageSmall}
      />
      {active && shouldRender && (
        <>
          <div
            className={`${styles.fadeContainer} ${
              !showContent ? styles.fadeOut : ""
            }`}
          >
            <AboutPreview
              aboutTitle={home.aboutTitle}
              description={home.description}
              aboutButtonText={home.aboutButtonText}
              profileImage={home.profileImage}
            />
          </div>
          <section
            className={`${styles.listenAndRepertoirSection} ${
              styles.fadeContainer
            } ${!showContent ? styles.fadeOut : ""}`}
          >
            <RepertoirePreview secondImage={home.SecondImage} />
            <ListenPreview
              listenTitle={home.listenTitle}
              listenButtonText={home.listenButtonText}
            />
          </section>
          <section
            className={`${styles.videoSection} ${styles.fadeContainer} ${
              !showContent ? styles.fadeOut : ""
            }`}
          >
            <div className={styles.videoContainer}>
                <iframe
                src={youtubeEmbedUrl}
                title="Erik Shoeffler - Klassisk sång"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                border-radius="none"
              />
            </div>
          </section>
        </>
      )}
      {!active && <FormSpacer />}
    </>
  );
}
