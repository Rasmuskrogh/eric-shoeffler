import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.linksSection}>
        <div className={styles.contactSection}>
          <h3>Contact</h3>
          <div className={styles.contactLinks}>
            <a href="mailto:email@server.com" className={styles.contactLink}>
              email@server.com
            </a>
            <a href="tel:070-1234567" className={styles.contactLink}>
              070-1234567
            </a>
            <Link href="/kontakt" className={styles.contactLink}>
              → Contact me
            </Link>
          </div>
        </div>
        <div className={styles.menuSection}>
          <h3>Shortcuts</h3>
          <div className={styles.menuItems}>
            <Link href="/" className={styles.menuLink}>
              Home
            </Link>
            <Link href="/about" className={styles.menuLink}>
              About me
            </Link>
            <Link href="/agenda" className={styles.menuLink}>
              Agenda
            </Link>
            <Link href="/listen" className={styles.menuLink}>
              Listen & watch
            </Link>
            <Link href="/repertoire" className={styles.menuLink}>
              Press
            </Link>
            <Link href="/kontakt" className={styles.menuLink}>
              Contact & booking
            </Link>
          </div>
        </div>
        <div className={styles.socialMediaSection}>
          <h3>Social media</h3>
          <div className={styles.socialIcons}>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Image
                src="/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="YouTube"
            >
              <Image src="/youtube.svg" alt="YouTube" width={24} height={24} />
            </Link>
            <Link
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Spotify"
            >
              <Image
                src="/spotify.svg"
                alt="Spotify"
                width={24}
                height={24}
                className={styles.spotify}
              />
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.copyrightSection}>
        <p>Copyright 2025</p>
      </section>
    </footer>
  );
}

export default Footer;
