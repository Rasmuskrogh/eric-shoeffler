"use client";

import React, { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import Short from "@/components/Short";
import styles from "./page.module.css";
import ListenShort from "@/components/ListenShort";
import RepertoirShort from "@/components/RepertoirShort";
import FormSpacer from "@/components/FormSpacer";
import { useActive } from "./context/ActiveContext";

export default function Page() {
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

  return (
    <>
      <Hero />
      {active && shouldRender && (
        <>
          <div
            className={`${styles.fadeContainer} ${
              !showContent ? styles.fadeOut : ""
            }`}
          >
            <Short />
          </div>
          <section
            className={`${styles.listenAndRepertoirSection} ${
              styles.fadeContainer
            } ${!showContent ? styles.fadeOut : ""}`}
          >
            <RepertoirShort />
            <ListenShort />
          </section>
          <section
            className={`${styles.videoSection} ${styles.fadeContainer} ${
              !showContent ? styles.fadeOut : ""
            }`}
          >
            <div className={styles.videoContainer}>
              <iframe
                src="https://www.youtube.com/embed/R60gOl6xHy0"
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
