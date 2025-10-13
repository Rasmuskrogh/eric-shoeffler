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
              <span className={styles.day}>16</span>
              <span className={styles.month}>October</span>
              <span className={styles.day}>-</span>
              <span className={styles.day}>14</span>
              <span className={styles.month}>December</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Lohengrin</h3>
              <p className={styles.eventLocation}>Malmö Opera</p>
              <p className={styles.eventTime}>16:00 or 17:00</p>
              {/*  <p className={styles.eventDescription}>
                Klassisk konsert med fokus på romantisk repertoar. Medverkande:
                Eric Schoeffler (baryton) och Maria Svensson (piano).
              </p> */}
            </div>
          </div>

          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>17</span>
              <span className={styles.month}>January</span>
              <span className={styles.day}>-</span>
              <span className={styles.day}>21</span>
              <span className={styles.month}>March</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Carmen</h3>
              <p className={styles.eventLocation}>Malmö Opera</p>
              <p className={styles.eventTime}>16:00, 18:00 or 19:00</p>
              {/*  
              <p className={styles.eventDescription}>
                Spektakulär opera gala med världsberömda arior och duetter. En
                kväll fylld av passion och drama.
              </p> */}
            </div>
          </div>

          <div className={styles.event}>
            <div className={styles.eventDate}>
              <span className={styles.day}>2</span>
              <span className={styles.month}>November</span>
            </div>
            <div className={styles.eventDetails}>
              <h3 className={styles.eventTitle}>Faurés Requiem</h3>
              <p className={styles.eventLocation}>Brännkyrka kyrka</p>
              <p className={styles.eventTime}>16:00</p>
              <p className={styles.eventDescription}>
                Bass soloist in "Fauré's requiem
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contactInfo}>
          <h2>Book a concert</h2>
          <p>
            Do you want to book Eric for an event? Contact us for more
            information about prices and availability.
          </p>
          <div className={styles.contactDetails}>
            <p>
              <strong>Email:</strong> ecm.schoeffler@gmail.com
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
