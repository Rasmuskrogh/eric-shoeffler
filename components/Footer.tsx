import React from "react";
import styles from "./Footer.module.css";
import Image from "next/image";

function Footer() {
  return (
    <footer className={styles.footer}>
      <section className={styles.linksSection}>
        <div className={styles.contactSection}>
          <h3>Kontakt</h3>
          <ul>
            <li>email@server.com</li>
            <li>070-1234567</li>
          </ul>
        </div>
        <div className={styles.menuSection}>
          <h3>Snabbmeny</h3>
          <div className={styles.menuItems}>
            <p>Hem</p>
            <p>Om</p>
            <p>Repertoar</p>
            <p>Lyssna</p>
            <p>Agenda</p>
            <p>Kontakt</p>
          </div>
        </div>
        <div className={styles.socialMediaSection}>
          <h3>Sociala medier</h3>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialLink} aria-label="Facebook">
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
            </a>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <Image
                src="/instagram.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
            </a>
            <a href="#" className={styles.socialLink} aria-label="YouTube">
              <Image src="/youtube.svg" alt="YouTube" width={24} height={24} />
            </a>
            <a href="#" className={styles.socialLink} aria-label="Spotify">
              <Image src="/spotify.svg" alt="Spotify" width={24} height={24} />
            </a>
          </div>
        </div>
      </section>
      <section className={styles.CTASection}>
        <button className={styles.ctaButton}>Boka mig</button>
      </section>
      <section className={styles.copyrightSection}>
        <p>Copyright 2025</p>
      </section>
    </footer>
  );
}

export default Footer;
