"use client";

import React from "react";
import styles from "../../app/about/page.module.css";
import Image from "next/image";
import type { ContentData } from "@/components/AdminDashboard/types";

interface AboutClientProps {
  aboutData: ContentData | null;
}

interface AboutData {
  aboutTitle?: string;
  aboutText?: string;
  aboutImage?: string;
}

export default function AboutClient({ aboutData }: AboutClientProps) {
  if (!aboutData) {
    return <div>Loading...</div>;
  }

  const data = aboutData as unknown as AboutData;
  const aboutTitle = data.aboutTitle || "About";
  const aboutText = data.aboutText || "";
  const aboutImage = data.aboutImage || "/eric-about.jpg";

  // Split aboutText by \n\n to create paragraphs
  const paragraphs = aboutText.split("\n\n").filter((p: string) => p.trim());

  return (
    <div className={styles.aboutPage}>
      <section>
        <h1 className={styles.aboutTitle}>{aboutTitle}</h1>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.textContent}>
            {paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className={styles.imageSection}>
            <div className={styles.imageContainer}>
              <Image
                src={aboutImage}
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
