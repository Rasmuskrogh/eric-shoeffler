import React from "react";
import styles from "./RepertoirShort.module.css";

function RepertoirShort() {
  return (
    <section className={styles.repertoirSection}>
      <h2 className={styles.repertoirTitle}>Repertoar i urval</h2>
      <ul className={styles.repertoirList}>
        <li>
          <strong>Leporello</strong> – Don Giovanni (W.A Mozart)
        </li>
        <li>
          <strong>Greve Almaviva</strong> – Figaros bröllop (W.A Mozart)
        </li>
        <li>
          <strong>Méphistophélès</strong> – Faust (C. Gounod)
        </li>
        <li>
          <strong>Escamillo</strong> – Carmen (G. Bizet)
        </li>
      </ul>
    </section>
  );
}

export default RepertoirShort;
