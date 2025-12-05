"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";
import { GalleryImage } from "../../../types/interfaces";
import { useTranslations } from "next-intl";

interface GalleryProps {
  images?: GalleryImage[];
  gallerySectionTitle?: string;
}

export default function Gallery({
  images = [],
  gallerySectionTitle,
}: GalleryProps) {
  const t = useTranslations("Gallery");

  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  if (images.length === 0) {
    return null; // Don't render gallery section if no images
  }

  return (
    <section className={styles.section}>
      {gallerySectionTitle && (
        <h2 className={styles.sectionTitle}>{gallerySectionTitle}</h2>
      )}
      <div className={styles.galleryGrid}>
        {images.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            {failedImages.has(image.id) ? (
              <div className={styles.imagePlaceholder}>
                <div className={styles.placeholderContent}>
                  <p>{t("imageLoadingError")}</p>
                  <small>{image.alt}</small>
                </div>
              </div>
            ) : (
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width || 800}
                height={image.height || 600}
                className={styles.galleryImage}
                priority={false}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onError={() => {
                  setFailedImages((prev) => new Set([...prev, image.id]));
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
