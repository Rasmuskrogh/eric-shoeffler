import React from "react";
import styles from "./RepertoirePreview.module.css";
import Image from "next/image";

interface RepertoirePreviewProps {
  secondImage?: string;
}

function RepertoirePreview({ secondImage }: RepertoirePreviewProps) {
  return (
    <section className={styles.repertoirSection}>
      <figure>
        <Image
          src={secondImage || "/la-boheme-quartet-large.avif"}
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

