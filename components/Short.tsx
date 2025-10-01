import styles from "./Short.module.css";
import Image from "next/image";

function Short() {
  return (
    <>
      <section className={styles.short}>
        <section className={styles.presentationShort}>
          <h2 className={styles.title}>Om mig</h2>
          <p className={styles.description}>
            Jag är Eric Schoeffler, frilansande klassisk sångare med en passion
            för att beröra publiken genom opera, konserter och romansprogram.
            Med en bred repertoar och lång erfarenhet på scen skapar jag
            musikaliska ögonblick som stannar kvar.
          </p>
          <button className={styles.button}>Läs mer om mig</button>
        </section>
        <section className={styles.shortImage}>
          <figure>
            <Image
              src="/ProfilePicture Eric Shoeffler.png"
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
