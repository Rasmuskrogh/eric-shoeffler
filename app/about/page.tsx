import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <div className={styles.aboutPage}>
      <section>
        <h1 className={styles.aboutTitle}>{t("title")}</h1>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.textContent}>
            <p className={styles.paragraph}>{t("para1")}</p>

            <p className={styles.paragraph}>{t("para2")}</p>

            <p className={styles.paragraph}>{t("para3")}</p>

            <p className={styles.paragraph}>{t("para4")}</p>
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                /* src="/ProfilePicture Eric Shoeffler.png" */
                src="/eric-about.jpg"
                alt="Eric Shoeffler"
                className={styles.profileImage}
                width={300}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
