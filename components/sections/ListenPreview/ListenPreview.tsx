import React from "react";
import styles from "./ListenPreview.module.css";
import Link from "next/link";

interface ListenPreviewProps {
  listenTitle?: string;
  listenButtonText?: string;
}

function ListenPreview({ listenTitle, listenButtonText }: ListenPreviewProps) {
  return (
    <section className={styles.listenSection}>
      <h2 className={styles.listenTitle}>{listenTitle || "Listen"}</h2>
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
      <Link href="/media">
        <button className={styles.listenButton}>
          {listenButtonText || "More"}
        </button>
      </Link>
    </section>
  );
}

export default ListenPreview;

