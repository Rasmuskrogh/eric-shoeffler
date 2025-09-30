"use client";

import React from "react";
import styles from "./page.module.css";

export default function PressPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Press</h1>
        <p className={styles.subtitle}>Recensioner och media</p>

        <div className={styles.pressItems}>
          <div className={styles.pressItem}>
            <div className={styles.pressHeader}>
              <h3 className={styles.pressTitle}>
                "En mästerlig tolkning av klassisk sång"
              </h3>
              <span className={styles.pressSource}>Dagens Nyheter</span>
            </div>
            <p className={styles.pressQuote}>
              "Eric Schoeffler levererar en exceptionell prestation som visar
              både tekniskt mästerskap och djup emotionell förståelse. Hans
              tolkning av Schubert-romanser är helt enkelt magisk."
            </p>
            <div className={styles.pressDate}>15 februari 2024</div>
          </div>

          <div className={styles.pressItem}>
            <div className={styles.pressHeader}>
              <h3 className={styles.pressTitle}>"Opera på högsta nivå"</h3>
              <span className={styles.pressSource}>Svenska Dagbladet</span>
            </div>
            <p className={styles.pressQuote}>
              "I rollen som Figaro visar Schoeffler en sällsynt kombination av
              komisk timing och vokal precision. En föreställning som kommer att
              bli ihågkommen länge."
            </p>
            <div className={styles.pressDate}>8 mars 2024</div>
          </div>

          <div className={styles.pressItem}>
            <div className={styles.pressHeader}>
              <h3 className={styles.pressTitle}>"En röst som berör"</h3>
              <span className={styles.pressSource}>Göteborgs-Posten</span>
            </div>
            <p className={styles.pressQuote}>
              "Schoefflers baryton har en unik färg och kraft som får publiken
              att lyssna med andan i halsen. Hans förmåga att förmedla känslor
              genom sång är helt enkelt imponerande."
            </p>
            <div className={styles.pressDate}>22 januari 2024</div>
          </div>

          <div className={styles.pressItem}>
            <div className={styles.pressHeader}>
              <h3 className={styles.pressTitle}>
                "Konsertrecension: Romansprogram"
              </h3>
              <span className={styles.pressSource}>Kulturmagasinet</span>
            </div>
            <p className={styles.pressQuote}>
              "En intim kväll med romantiska sånger som visar Schoefflers breda
              repertoar. Från svenska visor till franska chansons - allt
              framförs med samma passion och precision."
            </p>
            <div className={styles.pressDate}>5 december 2023</div>
          </div>
        </div>

        <div className={styles.mediaKit}>
          <h2>Media Kit</h2>
          <p>För press och media finns följande material tillgängligt:</p>
          <div className={styles.mediaItems}>
            <div className={styles.mediaItem}>
              <h4>Högbildsbilder</h4>
              <p>Professionella fotografier i olika format och storlekar</p>
            </div>
            <div className={styles.mediaItem}>
              <h4>Biografi</h4>
              <p>Detaljerad biografi och karriärsammanfattning</p>
            </div>
            <div className={styles.mediaItem}>
              <h4>Repertoar</h4>
              <p>Komplett lista över repertoar och specialiteter</p>
            </div>
            <div className={styles.mediaItem}>
              <h4>Ljudfiler</h4>
              <p>Kvalitetsljudfiler för radio och podcast</p>
            </div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h2>Presskontakt</h2>
          <p>För pressförfrågningar och intervjuer, kontakta:</p>
          <div className={styles.contactDetails}>
            <p>
              <strong>Email:</strong> eric_schoeffler@hotmail.com
            </p>
            <p>
              <strong>Telefon:</strong> +46735362254
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
