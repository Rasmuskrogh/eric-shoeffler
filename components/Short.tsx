import styles from "./Short.module.css";
import Image from "next/image";

function Short() {
  return (
    <>
      <section className={styles.short}>
        <section className={styles.presentationShort}>
          <h2 className={styles.title}>About me</h2>
          <p className={styles.description}>
            Eric Schoeffler blends lyrical warmth with dramatic intensity,
            bringing depth and presence to every performance. With a voice that
            bridges elegance and power, he captivates audiences across a wide
            range of repertoire.
          </p>
          <button className={styles.button}>Read more</button>
        </section>
        <section className={styles.shortImage}>
          <figure>
            <Image
              src="/eric-no-background.png"
              alt="Eric Shoeffler"
              width={400}
              height={500}
              /* fill */
              className={styles.image}
              quality={95}
              priority
            />
          </figure>
        </section>
      </section>
    </>
  );
}

export default Short;
