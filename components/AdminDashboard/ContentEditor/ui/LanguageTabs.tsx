import React from "react";
import { useContentEditorContext } from "../context";
import styles from "../../ContentEditor.module.css";

export function LanguageTabs() {
  const { sectionConfig, activeLanguage, handleLanguageChange } =
    useContentEditorContext();

  if (!sectionConfig.languages || sectionConfig.languages.length === 0) {
    return null;
  }

  return (
    <div className={styles.languageTabsContainer}>
      <div className={styles.languageTabs}>
        {sectionConfig.languages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => handleLanguageChange(lang)}
            className={`${styles.languageTab} ${
              activeLanguage === lang ? styles.languageTabActive : ""
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

