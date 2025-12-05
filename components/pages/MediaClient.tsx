"use client";

import React from "react";
import styles from "../../app/media/page.module.css";
import Gallery from "../features/gallery/Gallery";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { getSpotifyEmbedUrl } from "@/lib/spotify";
import type { ContentData } from "@/components/AdminDashboard/types";
import type { GalleryImage } from "@/types/interfaces";

interface MediaClientProps {
  mediaData: ContentData | null;
}

interface VideoItem {
  id: string;
  youtubeUrl: string;
  title?: string;
  description?: string;
}

interface MusicItem {
  id: string;
  spotifyUrl: string;
  title?: string | null;
}

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface MediaData {
  mediaTitle?: string;
  mediaSubtitle?: string;
  videoSectionTitle?: string;
  musicSectionTitle?: string;
  gallerySectionTitle?: string;
  videos?: VideoItem[];
  music?: MusicItem[];
  gallery?: GalleryItem[];
}

export default function MediaClient({ mediaData }: MediaClientProps) {
  if (!mediaData) {
    return <div>Loading...</div>;
  }

  const data = mediaData as unknown as MediaData;
  const mediaTitle = data.mediaTitle || "Media";
  const mediaSubtitle = data.mediaSubtitle || "";
  const videoSectionTitle = data.videoSectionTitle || "";
  const musicSectionTitle = data.musicSectionTitle || "";
  const gallerySectionTitle = data.gallerySectionTitle || "";

  const videos: VideoItem[] = data.videos || [];
  const music: MusicItem[] = data.music || [];
  const galleryItems: GalleryItem[] = data.gallery || [];
  
  // Konvertera GalleryItem[] till GalleryImage[] med fallback-värden
  const gallery: GalleryImage[] = galleryItems.map((item) => ({
    id: item.id,
    url: item.url,
    alt: item.alt,
    width: item.width || 800, // Fallback width
    height: item.height || 600, // Fallback height
  }));

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{mediaTitle}</h1>
        <p className={styles.subtitle}>{mediaSubtitle}</p>

        <div className={styles.sections}>
          {/* YouTube Videos Section */}
          {videoSectionTitle && videos.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{videoSectionTitle}</h2>
              <div className={styles.videoGrid}>
                {videos.map((video) => {
                  const embedUrl = getYouTubeEmbedUrl(video.youtubeUrl);
                  if (!embedUrl) return null;

                  return (
                    <div key={video.id} className={styles.videoItem}>
                      <div className={styles.videoWrapper}>
                        <iframe
                          src={embedUrl}
                          title={video.title || "YouTube video player"}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      {video.title && (
                        <h3 className={styles.videoTitle}>{video.title}</h3>
                      )}
                      {video.description && (
                        <p className={styles.videoDescription}>
                          {video.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Spotify Section */}
          {musicSectionTitle && music.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>{musicSectionTitle}</h2>
              <div className={styles.spotifyGrid}>
                {music.map((item) => {
                  const embedUrl = getSpotifyEmbedUrl(item.spotifyUrl);
                  if (!embedUrl) return null;

                  return (
                    <div key={item.id} className={styles.spotifyItem}>
                      {item.title && (
                        <h3 className={styles.spotifyTitle}>{item.title}</h3>
                      )}
                      <div className={styles.spotifyEmbed}>
                        <iframe
                          data-testid="embed-iframe"
                          style={{ borderRadius: "12px" }}
                          src={embedUrl}
                          width="100%"
                          height="352"
                          frameBorder="0"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {gallerySectionTitle && gallery.length > 0 && (
            <Gallery images={gallery} gallerySectionTitle={gallerySectionTitle} />
          )}
        </div>
      </div>
    </div>
  );
}




