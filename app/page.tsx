import React from "react";
import Image from "next/image";
import Hero from "@/components/Hero";

import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <Hero />
      <section className={styles.presentationShort}>
        <h2>Om mig</h2>
        <p>
          Jag är Eric Schoeffler, frilansande klassisk sångare med en passion
          för att beröra publiken genom opera, konserter och romansprogram. Med
          en bred repertoar och lång erfarenhet på scen skapar jag musikaliska
          ögonblick som stannar kvar.
        </p>
        <button>Läs mer om mig</button>
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
