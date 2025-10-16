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
                    title="Eric Schoeffler - Klassisk sång"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>
                  Vous qui faites l’endormie
                </h3>
                <p className={styles.videoDescription}>
                  The Devil’s seductive serenade from Gounod’s Faust.
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
                <h3 className={styles.videoTitle}>Stars</h3>
                <p className={styles.videoDescription}>
                  The Inspector’s solemn vow from Les Misérables.
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
                <h3 className={styles.videoTitle}>Le couteau</h3>
                <p className={styles.videoDescription}>
                  Nadia Boulanger’s haunting song of love and pain.
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
                <h3 className={styles.videoTitle}>
                  En visa till Karin när hon hade dansat
                </h3>
                <p className={styles.videoDescription}>
                  The mad King Erik XIV’s song to his beloved, by Swedish
                  composer Ture Rangström.
                </p>
              </div>
              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/ntgveY_yZAA?si=sCbixb5-Q_41YOMn"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>
                  &quot;Jag ger dig min morgon&quot; – Fred Åkerström cover
                </h3>
                <p className={styles.videoDescription}></p>
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
                  <p className={styles.galleryCaption}>Concert</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/ProfilePicture Eric Shoeffler.png"
                  alt="Eric Schoeffler porträtt"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Portrait</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/la-boheme-quartet-large.avif"
                  alt="La Bohème kvartett"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>La Bohème quartet</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/eric-short.JPG"
                  alt="Konsertframträdande"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Portrait</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/eric-5.JPG"
                  alt="Eric Schoeffler i studio"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Gianni Schicchi</p>
                </div>
              </div>

              <div className={styles.galleryItem}>
                <img
                  src="/eric-6.jpeg"
                  alt="Opera framträdande"
                  className={styles.galleryImage}
                />
                <div className={styles.galleryOverlay}>
                  <p className={styles.galleryCaption}>Hansel und Gretel</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
