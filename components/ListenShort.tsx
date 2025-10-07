import React from "react";
import styles from "./ListenShort.module.css";

function ListenShort() {
  return (
    <section className={styles.listenSection}>
      <h2 className={styles.listenTitle}>Listen</h2>
      <iframe
        className={styles.listenIframe}
        src="https://open.spotify.com/embed/track/3W9NQIIENxpOTRNEbmFYPG?utm_source=generator"
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
      <button className={styles.listenButton}>Want to hear more?</button>
    </section>
  );
}

export default ListenShort;
