import React from "react";
import styles from "./RepertoirePreview.module.css";
import Image from "next/image";

function RepertoirePreview() {
  return (
    <section className={styles.repertoirSection}>
      <figure>
        <Image
          src="/la-boheme-quartet-large.avif"
          alt="La Bohème Quartet"
          width={400}
          height={400}
          className={styles.quartetImage}
        />
      </figure>
    </section>
  );
}

export default RepertoirePreview;

