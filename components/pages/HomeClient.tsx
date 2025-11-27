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

  // Convert YouTube URL to embed format
  const youtubeEmbedUrl =
    getYouTubeEmbedUrl((homeData as any).youtubeUrl) ||
    "https://www.youtube.com/embed/R60gOl6xHy0"; // Fallback

  return (
    <>
      <Hero
        name={(homeData as any)?.name}
        tagline={(homeData as any)?.tagline}
        contactText={(contactData as any)?.contactText}
        imageLarge={(homeData as any)?.imageLarge}
        imageSmall={(homeData as any)?.imageSmall}
      />
      {active && shouldRender && (
        <>
          <div
            className={`${styles.fadeContainer} ${
              !showContent ? styles.fadeOut : ""
            }`}
          >
            <AboutPreview
              aboutTitle={(homeData as any).aboutTitle}
              description={(homeData as any).description}
              aboutButtonText={(homeData as any).aboutButtonText}
              profileImage={(homeData as any).profileImage}
            />
          </div>
          <section
            className={`${styles.listenAndRepertoirSection} ${
              styles.fadeContainer
            } ${!showContent ? styles.fadeOut : ""}`}
          >
            <RepertoirePreview secondImage={(homeData as any).SecondImage} />
            <ListenPreview
              listenTitle={(homeData as any).listenTitle}
              listenButtonText={(homeData as any).listenButtonText}
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
