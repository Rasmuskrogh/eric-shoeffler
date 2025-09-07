"use client";

import { useActive } from "../app/context/ActiveContext";
import styles from "./BackgroundShapes.module.css";

export default function BackgroundShapes() {
  const { active } = useActive();

  return (
    <div className={styles.backgroundContainer}>
      {/* Blue Active State SVG - Based on first image description */}
      <svg
        className={`${styles.backgroundSvg} ${
          active ? styles.active : styles.inactive
        }`}
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* Header blue section (60-65% of width) */}
        <rect x="0" y="0" width="750" height="80" fill="url(#blueGradient)" />

        {/* Header red section (thin vertical strip) */}
        <rect x="750" y="0" width="30" height="80" fill="url(#redGradient)" />

        {/* Header white section (remaining) */}
        <rect x="780" y="0" width="420" height="80" fill="white" />

        {/* Main blue curved area - large concave curve on right side */}
        <path
          d="M 0 80 
             L 0 600 
             L 800 600 
             C 850 580 900 520 920 450 
             C 940 380 950 300 960 220 
             C 970 150 980 120 1000 100 
             L 1100 80 
             Z"
          fill="url(#blueGradient)"
        />

        {/* White curved area - follows the blue curve */}
        <path
          d="M 1100 80 
             L 1200 80 
             L 1200 150 
             C 1180 200 1150 250 1120 300 
             C 1090 350 1060 400 1030 450 
             C 1000 500 970 550 940 580 
             C 910 600 870 600 840 600 
             L 800 600 
             C 830 570 860 540 890 510 
             C 920 480 950 450 980 420 
             C 1010 390 1040 360 1070 330 
             C 1100 300 1130 270 1160 240 
             C 1180 210 1200 180 1200 150 
             Z"
          fill="white"
        />

        {/* Red curved area - right side */}
        <path
          d="M 1200 80 
             L 1200 600 
             L 1160 600 
             C 1120 580 1080 550 1040 500 
             C 1000 450 960 400 920 350 
             C 880 300 840 250 800 200 
             C 760 150 720 120 680 100 
             L 640 100 
             C 680 150 720 200 760 250 
             C 800 300 840 350 880 400 
             C 920 450 960 500 1000 550 
             C 1040 580 1080 600 1120 600 
             Z"
          fill="url(#redGradient)"
        />
      </svg>

      {/* Red Active State SVG - Based on second image description */}
      <svg
        className={`${styles.backgroundSvg} ${
          !active ? styles.active : styles.inactive
        }`}
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient
            id="blueGradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="redGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* Main red background */}
        <rect x="0" y="0" width="1200" height="600" fill="url(#redGradient2)" />

        {/* Blue curved area (top-left) - teardrop-like shape with concave curve */}
        <path
          d="M 0 0 
             L 400 0 
             C 380 40 350 80 310 120 
             C 270 160 230 200 190 240 
             C 150 280 110 320 70 360 
             C 30 400 0 440 0 480 
             Z"
          fill="url(#blueGradient2)"
        />

        {/* White curved area - flowing wave pattern following blue curve */}
        <path
          d="M 400 0 
             L 500 0 
             L 500 80 
             C 480 120 450 160 410 200 
             C 370 240 330 280 290 320 
             C 250 360 210 400 170 440 
             C 130 480 90 520 50 560 
             L 0 560 
             L 0 480 
             C 40 440 80 400 120 360 
             C 160 320 200 280 240 240 
             C 280 200 320 160 360 120 
             C 380 80 400 40 420 20 
             Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
