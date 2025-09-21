import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <section>
        <h1 className={styles.aboutTitle}>Eric Shoeffler &mdash; Basbaryton</h1>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.textContent}>
            <p className={styles.paragraph}>
              Den fransk-svenske basbarytonen Eric Schoeffler är hyllad för sin
              dramatiska närvaro och sitt rika, klangfulla timbre. Kommande
              engagemang inkluderar Escamillo i Carmen, Don Giovanni och
              Méphistophélès i Faust.
            </p>

            <p className={styles.paragraph}>
              Bland senaste operahöjdpunkter finns Greve Almaviva i Le nozze di
              Figaro (Saluzzo 2023), Schaunard i La Bohème (Paris 2023) och
              Peter i Hänsel und Gretel (Berlin 2022). På konsertscenen har han
              framträtt som Pilatus i Bachs Johannespassion (2023–24) och som
              solist i Rossinis Petite messe solennelle (Berlin 2023).
            </p>

            <p className={styles.paragraph}>
              Schoeffler är utbildad vid Högskolan för scen och musik i Göteborg
              och har förfinat sin konst vid Stockholm Opera Studio och
              Vadstena-Akademien, efter tidigare studier vid Conservatoire Nadia
              & Lili Boulanger i Paris samt en civilingenjörsutbildning i
              Stockholm. Flytande i franska, svenska, tyska, spanska och
              engelska förenar han nordisk klarhet med fransk lyrism i sitt
              vokala uttryck.
            </p>

            <p className={styles.paragraph}>
              Han har även rört sig mellan olika musikaliska sammanhang, bland
              annat vid Stockholm Jazz Festival (2013) och Nordic Song Festival
              (2024).
            </p>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <img
                src="/ProfilePicture Eric Shoeffler.png"
                alt="Eric Shoeffler"
                className={styles.profileImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Vill du veta mer?</h2>
          <p className={styles.ctaText}>
            Kontakta mig för att diskutera ditt projekt eller boka ett
            framträdande.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/kontakt" className={styles.primaryButton}>
              Kontakta mig
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
