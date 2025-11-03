import styles from "./AboutPreview.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

function AboutPreview() {
  const t = useTranslations("Short");

  return (
    <>
      <section className={styles.short}>
        <section className={styles.presentationShort}>
          <h2 className={styles.title}>{t("title")}</h2>
          <p className={styles.description}>{t("description")}</p>
          <Link href="/about">
            <button className={styles.button}>{t("button")}</button>
          </Link>
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

export default AboutPreview;

