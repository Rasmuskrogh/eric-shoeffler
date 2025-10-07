"use client";

import React from "react";
import styles from "./page.module.css";

export default function AgendaPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Schedule</h1>
        <p className={styles.subtitle}>Upcoming concerts and events</p>

        <div className={styles.events}>
          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>15</span>
              <span className={styles.month}>Mars</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Konsert i Stockholm</h3>
              <p className={styles.eventLocation}>Konserthuset, Stockholm</p>
              <p className={styles.eventTime}>19:00</p>
              <p className={styles.eventDescription}>
                Klassisk konsert med fokus på romantisk repertoar. Medverkande:
                Eric Schoeffler (baryton) och Maria Svensson (piano).
              </p>
            </div>
          </div>

          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>22</span>
              <span className={styles.month}>Mars</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Opera Gala</h3>
              <p className={styles.eventLocation}>Operan, Göteborg</p>
              <p className={styles.eventTime}>18:30</p>
              <p className={styles.eventDescription}>
                Spektakulär opera gala med världsberömda arior och duetter. En
                kväll fylld av passion och drama.
              </p>
            </div>
          </div>

          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>5</span>
              <span className={styles.month}>April</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Romansprogram</h3>
              <p className={styles.eventLocation}>Kulturhuset, Malmö</p>
              <p className={styles.eventTime}>20:00</p>
              <p className={styles.eventDescription}>
                Intima romansprogram med svenska och internationella sånger. En
                kväll för kärlek och musik.
              </p>
            </div>
          </div>

          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>18</span>
              <span className={styles.month}>April</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Jazz & Klassik</h3>
              <p className={styles.eventLocation}>Jazzklubben, Uppsala</p>
              <p className={styles.eventTime}>21:00</p>
              <p className={styles.eventDescription}>
                Unik blandning av jazz och klassisk musik. Experimentell och
                innovativ kväll med nya tolkningar.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h2>Boka konsert</h2>
          <p>
            Vill du boka Eric för ett evenemang? Kontakta oss för mer
            information om priser och tillgänglighet.
          </p>
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
