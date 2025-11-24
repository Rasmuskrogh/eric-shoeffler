"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { dashboardConfig } from "./config";
import InactivityTimer from "./InactivityTimer";
import styles from "./DashboardLayout.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentSection?: string;
  onSectionChange?: (sectionId: string) => void;
}

export default function DashboardLayout({
  children,
  currentSection,
  onSectionChange,
}: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState(
    currentSection || dashboardConfig[0]?.id || ""
  );

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    onSectionChange?.(sectionId);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  if (status === "loading") {
    return (
      <div className={styles.dashboardContainer}>
        <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  // Hämta timeout från environment variable (default: 15 minuter)
  const timeoutMinutes = process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES
    ? parseInt(process.env.NEXT_PUBLIC_INACTIVITY_TIMEOUT_MINUTES, 10)
    : 15;
  const warningMinutes = process.env.NEXT_PUBLIC_INACTIVITY_WARNING_MINUTES
    ? parseInt(process.env.NEXT_PUBLIC_INACTIVITY_WARNING_MINUTES, 10)
    : 1;

  return (
    <div className={styles.dashboardContainer}>
      <InactivityTimer
        timeoutMinutes={timeoutMinutes}
        warningMinutes={warningMinutes}
      />
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <div className={styles.userInfo}>
            <span className={styles.username}>
              {session?.user?.username || "Admin"}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <nav className={styles.navigation}>
            <ul className={styles.navList}>
              {dashboardConfig.map((section) => (
                <li key={section.id} className={styles.navItem}>
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`${styles.navButton} ${
                      activeSection === section.id ? styles.navButtonActive : ""
                    }`}
                  >
                    {section.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
