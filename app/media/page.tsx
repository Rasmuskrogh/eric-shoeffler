import React from "react";
import styles from "./page.module.css";
import Gallery from "../../components/features/gallery/Gallery";
import { useTranslations } from "next-intl";

export default function ListenPage() {
  const t = useTranslations("Media");

  return (
    <div className={styles.container}>
      <div className={styles.content}>
          <h1 className={styles.title}>Media</h1>
        <p className={styles.subtitle}>{t("undertitle")}</p>

        <div className={styles.sections}>
          {/* YouTube Videos Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("videosTitle")}</h2>
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
                  {t("vousQuiFaitesL’endormieDesc")}
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
                  {t("starsDesc")}
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
                  {t("leCouteauDesc")}
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
                  {t("enVisaTillKarinDesc")}
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
                <p className={styles.videoDescription}>Stockholm Music Group</p>
              </div>
              <div className={styles.videoItem}>
                <div className={styles.videoWrapper}>
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/gWM82gyJuqM?si=57CLGsFxV523QPG5"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                <h3 className={styles.videoTitle}>
                  &quot;Hallelujah&quot; – as a Duo
                </h3>
                <p className={styles.videoDescription}>Stockholm Music Group</p>
              </div>
            </div>
          </section>

          {/* Spotify Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t("musicTitle")}</h2>
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
          <Gallery />
        </div>
      </div>
    </div>
  );
}
