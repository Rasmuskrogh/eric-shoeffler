import styles from "./AboutPreview.module.css";
import Image from "next/image";
import Link from "next/link";

interface AboutPreviewProps {
  aboutTitle?: string;
  description?: string;
  aboutButtonText?: string;
  profileImage?: string;
}

function AboutPreview({
  aboutTitle,
  description,
  aboutButtonText,
  profileImage,
}: AboutPreviewProps) {
  return (
    <>
      <section className={styles.short}>
        <section className={styles.presentationShort}>
          <h2 className={styles.title}>{aboutTitle || "About"}</h2>
          <p className={styles.description}>{description || ""}</p>
          <Link href="/about">
            <button className={styles.button}>
              {aboutButtonText || "Read more"}
            </button>
          </Link>
        </section>
        <section className={styles.shortImage}>
          <figure>
            <Image
              src={profileImage || "/eric-no-background.png"}
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

