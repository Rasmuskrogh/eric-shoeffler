import styles from "./Short.module.css";

function Short() {
  return (
    <>
      <section className={styles.presentationShort}>
        <h2 className={styles.title}>Om mig</h2>
        <p className={styles.description}>
          Jag är Eric Schoeffler, frilansande klassisk sångare med en passion
          för att beröra publiken genom opera, konserter och romansprogram. Med
          en bred repertoar och lång erfarenhet på scen skapar jag musikaliska
          ögonblick som stannar kvar.
        </p>
        <button className={styles.button}>Läs mer om mig</button>
      </section>
    </>
  );
}

export default Short;
