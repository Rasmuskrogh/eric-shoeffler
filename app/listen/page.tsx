"use client";

import React from "react";
import styles from "./page.module.css";

export default function ListenPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Media</h1>
        <p className={styles.subtitle}>Discover Eric Schoeffler’s music</p>

        <div className={styles.sections}>
          {/* YouTube Videos Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Videos</h2>
            <div className={styles.videoGrid}>
              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/R60gOl6xHy0"
                    title="Erik Shoeffler - Klassisk sång"
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
                    src="https://www.youtube.com/embed/8hWd6sFgq7c?si=dTl06n0WdJvWoqjk"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
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
                    src="https://www.youtube.com/embed/jJaEdbr-ZrY?si=1jMrK-9DUqi9K84J"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>Bakom kulisserna</h3>
                <p className={styles.videoDescription}>
                  Följ med Eric under en dag i studion och se hur han förbereder
                  sig för konserter.
                </p>
              </div>
              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    src="https://www.youtube.com/embed/_x1brW-4cXU?si=XZUFgYV5zEI7l84_"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>Intervju med Eric</h3>
                <p className={styles.videoDescription}>
                  Eric berättar om sin musikaliska resa och sina
                  favoritkompositörer.
                </p>
              </div>
            </div>
          </section>

          {/* Spotify Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Music</h2>
            <div className={styles.spotifyGrid}>
              <div className={styles.spotifyItem}>
                {/*  <h3 className={styles.spotifyTitle}>Eric Schoeffler - Album</h3> */}
                <div className={styles.spotifyEmbed}>
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/track/3W9NQIIENxpOTRNEbmFYPG?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>

              <div className={styles.spotifyItem}>
                {/*  <h3 className={styles.spotifyTitle}>Konsertinspelningar</h3> */}
                <div className={styles.spotifyEmbed}>
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: "12px" }}
                    src="https://open.spotify.com/embed/track/5QsNHtONgxoLFO1GGUlZQd?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* Gallery Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Gallery</h2>
            <div className={styles.galleryGrid}>
              <div className={styles.galleryItem}>
                <img
                  src="/Eric with Piano.jpg"
                  alt="Eric Schoeffler med piano"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>
                    Eric Schoeffler med piano
                  </p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/ProfilePicture Eric Shoeffler.png"
                  alt="Eric Schoeffler porträtt"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>
                    Porträtt av Eric Schoeffler
                  </p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/la-boheme-quartet-large.avif"
                  alt="La Bohème kvartett"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>La Bohème kvartett</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/Eric with Piano.jpg"
                  alt="Konsertframträdande"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Konsertframträdande</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/ProfilePicture Eric Shoeffler.png"
                  alt="Eric Schoeffler i studio"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>
                    Eric Schoeffler i studio
                  </p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/la-boheme-quartet-large.avif"
                  alt="Opera framträdande"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Opera framträdande</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
