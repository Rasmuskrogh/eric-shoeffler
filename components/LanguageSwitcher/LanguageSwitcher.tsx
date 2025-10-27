"use client";
import { useState, useEffect, useRef } from "react";
import { changeLanguage } from "./actions.language";
import styles from "./LanguageSwitch.module.css";
import Image from "next/image";

const languages = [
  { code: "en", name: "English", flag: "/englishFlag.svg" },
  { code: "sv", name: "Svenska", flag: "/swedishFlag.svg" },
  { code: "fr", name: "Français", flag: "/frenchFlag.svg" },
];

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>("en");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Get the current locale from localStorage if available
    const storedLocale = localStorage.getItem("language");
    if (storedLocale) {
      setLocale(storedLocale);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = async (
    e: React.MouseEvent,
    languageCode: string
  ) => {
    e.stopPropagation();
    setLocale(languageCode);
    localStorage.setItem("language", languageCode);
    await changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <div
      className={styles.languageSwitch}
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Change language. Current: ${currentLanguage.name}`}
        aria-expanded={isOpen}
      >
        <div className={styles.flag}>
          <Image
            src={currentLanguage.flag}
            alt={`${currentLanguage.name} flag`}
            width={30}
            height={25}
            className={styles.flagImage}
          />
        </div>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.option} ${
                language.code === locale ? styles.optionSelected : ""
              }`}
              onClick={(e) => handleLanguageSelect(e, language.code)}
              aria-label={`Select ${language.name}`}
            >
              <div className={styles.optionFlag}>
                <Image
                  src={language.flag}
                  alt={`${language.name} flag`}
                  width={30}
                  height={25}
                  className={styles.flagImage}
                />
              </div>
              <span className={styles.optionName}>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
