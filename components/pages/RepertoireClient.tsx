"use client";

import React from "react";
import styles from "../../app/repertoire/page.module.css";
import type { ContentData } from "@/components/AdminDashboard/types";
import { useTranslations } from "next-intl";

interface Role {
  composer: string;
  role: string;
  opera: string;
}

interface RepertoireDataFromDb {
  availableNow?: Role[];
  inPreparation?: Role[];
  repertoireTitle?: string;
}

const defaultRepertoire: RepertoireDataFromDb = {
  availableNow: [
    { composer: "Bizet", role: "Morales", opera: "Carmen" },
    { composer: "Bizet", role: "Zuniga", opera: "Carmen" },
    { composer: "Bizet", role: "Dancaïro", opera: "Carmen" },
    { composer: "Mozart", role: "Masetto", opera: "Don Giovanni" },
    { composer: "Verdi", role: "Monterone", opera: "Rigoletto" },
    { composer: "Verdi", role: "Ceprano", opera: "Rigoletto" },
    { composer: "Wagner", role: "Vierte Edelmann", opera: "Lohengrin" },
  ],
  inPreparation: [
    { composer: "Mozart", role: "Leporello", opera: "Don Giovanni" },
    { composer: "Mozart", role: "Figaro", opera: "Le nozze di Figaro" },
    { composer: "Bizet", role: "Escamillo", opera: "Carmen" },
    { composer: "Gounod", role: "Méphistophélès", opera: "Faust" },
    { composer: "Beethoven", role: "Don Pizarro", opera: "Fidelio" },
  ],
};

interface RepertoireClientProps {
  repertoireData: ContentData | null;
}

function normalizeRole(item: Record<string, unknown>): Role | null {
  const composer =
    typeof item.composer === "string" ? item.composer : "";
  const role = typeof item.role === "string" ? item.role : "";
  const opera = typeof item.opera === "string" ? item.opera : "";
  if (!composer && !role && !opera) return null;
  return { composer, role, opera };
}

function toRoleList(arr: unknown): Role[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) =>
      normalizeRole(
        typeof item === "object" && item !== null ? (item as Record<string, unknown>) : {}
      )
    )
    .filter((r): r is Role => r !== null);
}

export default function RepertoireClient({
  repertoireData,
}: RepertoireClientProps) {
  const t = useTranslations("Repertoire");
  const data = repertoireData as RepertoireDataFromDb | null | undefined;
  const pageTitle =
    typeof data?.repertoireTitle === "string" && data.repertoireTitle.trim()
      ? data.repertoireTitle.trim()
      : "Repertoire";
  const availableNow =
    data?.availableNow && data.availableNow.length > 0
      ? toRoleList(data.availableNow)
      : defaultRepertoire.availableNow ?? [];
  const inPreparation =
    data?.inPreparation && data.inPreparation.length > 0
      ? toRoleList(data.inPreparation)
      : defaultRepertoire.inPreparation ?? [];

  const groupByComposer = (roles: Role[]) => {
    const grouped: Record<string, Role[]> = {};
    roles.forEach((role) => {
      if (!grouped[role.composer]) {
        grouped[role.composer] = [];
      }
      grouped[role.composer].push(role);
    });
    return grouped;
  };

  const availableGrouped = groupByComposer(availableNow);
  const inPreparationGrouped = groupByComposer(inPreparation);

  return (
    <div className={styles.repertoirePage}>
      <section className={styles.headerSection}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </section>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("avaliable")}
            </h2>
            <div className={styles.rolesContainer}>
              {Object.entries(availableGrouped).map(([composer, roles]) => (
                <div key={composer} className={styles.composerGroup}>
                  <h3 className={styles.composerName}>{composer}</h3>
                  <ul className={styles.rolesList}>
                    {roles.map((role, index) => (
                      <li key={index} className={styles.roleItem}>
                        <span className={styles.roleName}>{role.role}</span>
                        <span className={styles.roleOpera}>
                          – {role.opera}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {t("inPreparation")}
            </h2>
            <p className={styles.sectionSubtitle}>
              {t("inPreparationSubtitle")}
            </p>
            <div className={styles.rolesContainer}>
              {Object.entries(inPreparationGrouped).map(([composer, roles]) => (
                <div key={composer} className={styles.composerGroup}>
                  <h3 className={styles.composerName}>{composer}</h3>
                  <ul className={styles.rolesList}>
                    {roles.map((role, index) => (
                      <li key={index} className={styles.roleItem}>
                        <span className={styles.roleName}>{role.role}</span>
                        <span className={styles.roleOpera}>
                          – {role.opera}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
