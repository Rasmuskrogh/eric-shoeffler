import React from "react";
import Image from "next/image";

import styles from "./page.module.css";

export default function Page() {
  return (
    <section className={styles.section1}>
      <h1 className={styles.title}>Erik Shoeffler</h1>
      <section className={styles.presentationSection}>
        <article className={styles.presentation}>
          <p>
            Jag är en klassisk sångare med en stark drivkraft att beröra och
            engagera genom musiken. Redan från början drogs jag till operans
            dramatiska kraft och romanssångens intimitet – två världar där
            rösten kan bära både de största känslorna och de minsta nyanserna.
          </p>
          <p>
            Under åren har jag haft möjlighet att framträda i olika sammanhang:
            från operascener och konserthus till mindre, personliga scener där
            närheten till publiken gör musiken ännu mer levande. Jag trivs i
            båda miljöerna, men oavsett var jag sjunger är mitt mål alltid
            detsamma – att skapa ett ögonblick där musiken talar direkt till
            hjärtat.
          </p>
          <p>
            Min repertoar omfattar allt från klassiska tonsättare som Mozart,
            Verdi och Puccini till mer moderna verk, och jag ser en särskild
            glädje i att upptäcka nya uttryckssätt och samarbeten. För mig är
            det viktigt att förena teknisk precision med ett genuint uttryck, så
            att varje framträdande känns äkta och unikt.
          </p>
          <p>
            Att stå på scen är för mig mer än att framföra musik – det är att
            dela en berättelse, en känsla och en upplevelse som vi skapar
            tillsammans med publiken.
          </p>
        </article>
        <figure className={styles.presentationImageContainer}>
          <Image
            src="/ChatGPT Image 1 sep. 2025 14_09_32.png"
            alt="Erik Shoeffler"
            fill
            className={styles.responsiveImage}
          />
        </figure>
      </section>
      <section>
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
    </section>
  );
}
