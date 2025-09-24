import React from "react";
import Hero from "@/components/Hero";
import Short from "@/components/Short";

import styles from "./page.module.css";
import ListenShort from "@/components/ListenShort";
import RepertoirShort from "@/components/RepertoirShort";

export default function Page() {
  return (
    <>
      <Hero />
      <Short />
      <section className={styles.listenAndRepertoirSection}>
        <RepertoirShort />
        <ListenShort />
      </section>
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <iframe
            src="https://www.youtube.com/embed/R60gOl6xHy0"
            title="Erik Shoeffler - Klassisk sång"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
