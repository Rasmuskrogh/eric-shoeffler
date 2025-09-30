import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

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
              Franco-Swedish bass-baritone Eric Schoeffler is celebrated for his
              dramatic presence and rich, resonant timbre. Upcoming engagements
              include Escamillo in Carmen, Don Giovanni, and Méphistophélès in
              Faust.
            </p>

            <p className={styles.paragraph}>
              Recent operatic highlights feature Count Almaviva in Le nozze di
              Figaro (Saluzzo 2023), Schaunard in La Bohème (Paris 2023), and
              Peter in Hänsel und Gretel (Berlin 2022). In concert, he has
              performed Pilatus in Bach’s Johannespassion (2023–24) and appeared
              as a soloist in Rossini’s Petite messe solennelle (Berlin 2023).
            </p>

            <p className={styles.paragraph}>
              A graduate of the Academy of Music and Drama in Gothenburg,
              Schoeffler refined his craft at the Stockholm Opera Studio and
              Vadstena Academy, following earlier studies at the Conservatoire
              Nadia & Lili Boulanger in Paris and a Master of Science in
              Engineering in Stockholm. Fluent in French, Swedish, German,
              Spanish, and English, he combines Nordic clarity with French
              lyricism in his vocal artistry.
            </p>

            <p className={styles.paragraph}>
              He has also embraced diverse musical settings, performing at the
              Stockholm Jazz Festival (2013) and the Nordic Song Festival
              (2024).
            </p>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src="/ProfilePicture Eric Shoeffler.png"
                alt="Eric Shoeffler"
                className={styles.profileImage}
                width={300}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/*   <section className={styles.ctaSection}>
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
      </section> */}
    </div>
  );
}
