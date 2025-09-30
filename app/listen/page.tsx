"use client";

import React from "react";
import styles from "./page.module.css";

export default function ListenPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Listen & Watch</h1>
        <p className={styles.subtitle}>Upptäck Eric Schoefflers musik</p>

        <div className={styles.sections}>
          {/* YouTube Videos Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Videor</h2>
            <div className={styles.videoGrid}>
              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Eric Schoeffler - Konsertvideo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>Konsertvideo 2024</h3>
                <p className={styles.videoDescription}>
                  En sammanfattning av Eric Schoefflers senaste konsert med
                  klassiska arior och romanser.
                </p>
              </div>

              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Eric Schoeffler - Intervju"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>Intervju med Eric</h3>
                <p className={styles.videoDescription}>
                  Eric berättar om sin musikaliska resa och sina
                  favoritkompositörer.
                </p>
              </div>

              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                    title="Eric Schoeffler - Bakom kulisserna"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>Bakom kulisserna</h3>
                <p className={styles.videoDescription}>
                  Följ med Eric under en dag i studion och se hur han förbereder
                  sig för konserter.
                </p>
              </div>
            </div>
          </section>

          {/* Spotify Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Musik</h2>
            <div className={styles.spotifyGrid}>
              <div className={styles.spotifyItem}>
                <h3 className={styles.spotifyTitle}>Favoritlåtar</h3>
                <div className={styles.spotifyEmbed}>
                  <iframe
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media"
                  ></iframe>
                </div>
              </div>

              <div className={styles.spotifyItem}>
                <h3 className={styles.spotifyTitle}>Klassisk musik</h3>
                <div className={styles.spotifyEmbed}>
                  <iframe
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3QOo"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowTransparency={true}
                    allow="encrypted-media"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* Audio Files Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ljudfiler</h2>
            <div className={styles.audioGrid}>
              <div className={styles.audioItem}>
                <div className={styles.audioPlayer}>
                  <div className={styles.audioInfo}>
                    <h4>Schubert - Der Erlkönig</h4>
                    <p>Eric Schoeffler, baryton</p>
                  </div>
                  <audio controls className={styles.audio}>
                    <source src="/audio/der-erlkonig.mp3" type="audio/mpeg" />
                    Din webbläsare stöder inte ljuduppspelning.
                  </audio>
                </div>
              </div>

              <div className={styles.audioItem}>
                <div className={styles.audioPlayer}>
                  <div className={styles.audioInfo}>
                    <h4>Mozart - Non più andrai</h4>
                    <p>Eric Schoeffler, baryton</p>
                  </div>
                  <audio controls className={styles.audio}>
                    <source src="/audio/non-piu-andrai.mp3" type="audio/mpeg" />
                    Din webbläsare stöder inte ljuduppspelning.
                  </audio>
                </div>
              </div>

              <div className={styles.audioItem}>
                <div className={styles.audioPlayer}>
                  <div className={styles.audioInfo}>
                    <h4>Schumann - Dichterliebe</h4>
                    <p>Eric Schoeffler, baryton</p>
                  </div>
                  <audio controls className={styles.audio}>
                    <source src="/audio/dichterliebe.mp3" type="audio/mpeg" />
                    Din webbläsare stöder inte ljuduppspelning.
                  </audio>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className={styles.contactInfo}>
          <h2>Vill du höra mer?</h2>
          <p>
            Kontakta Eric för att boka en konsert eller få mer information om
            hans musik.
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
