"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gallery</h2>
        <div className={styles.loading}>
          <p>Loading gallery images...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gallery</h2>
        <div className={styles.error}>
          <p>Error loading gallery: {error}</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Gallery</h2>
        <div className={styles.empty}>
          <p>No images found in gallery.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Gallery</h2>
      <div className={styles.galleryGrid}>
        {images.map((image) => (
          <div key={image.id} className={styles.galleryItem}>
            {failedImages.has(image.id) ? (
              <div className={styles.imagePlaceholder}>
                <div className={styles.placeholderContent}>
                  <p>Bild kunde inte laddas</p>
                  <small>{image.alt}</small>
                </div>
              </div>
            ) : (
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
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
