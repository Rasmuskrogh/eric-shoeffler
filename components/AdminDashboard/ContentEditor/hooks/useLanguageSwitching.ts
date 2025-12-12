import { useCallback } from "react";
import type { ContentData, SectionConfig } from "../../types";

interface UseLanguageSwitchingProps {
  sectionConfig: SectionConfig;
  initialData: ContentData | undefined;
  activeLanguage: string | null;
  setActiveLanguage: (lang: string | null) => void;
  setFormData: (data: ContentData | ((prev: ContentData) => ContentData)) => void;
  formData: ContentData;
}

/**
 * Hook to handle language switching logic
 */
export function useLanguageSwitching({
  sectionConfig,
  initialData,
  activeLanguage,
  setActiveLanguage,
  setFormData,
  formData,
}: UseLanguageSwitchingProps) {
  const handleLanguageChange = useCallback((newLang: string) => {
    // Spara nuvarande språk-data innan byte
    if (activeLanguage && sectionConfig.languages) {
      const existingData = initialData as unknown as
        | Record<string, ContentData>
        | ContentData;
      const isLocalized =
        typeof existingData === "object" &&
        existingData !== null &&
        !Array.isArray(existingData) &&
        sectionConfig.languages[0] in existingData;

      if (isLocalized) {
        const localizedData = existingData as Record<string, ContentData>;
        localizedData[activeLanguage] = formData;
      }
    }

    // Växla språk
    setActiveLanguage(newLang);

    // Ladda data för nytt språk
    if (sectionConfig.languages) {
      const existingData = initialData as unknown as
        | Record<string, ContentData>
        | ContentData;
      const isLocalized =
        typeof existingData === "object" &&
        existingData !== null &&
        !Array.isArray(existingData) &&
        sectionConfig.languages[0] in existingData;

      if (isLocalized) {
        const localizedData = existingData as Record<string, ContentData>;
        const langData = localizedData[newLang];
        if (langData) {
          setFormData(langData);
        } else {
          // Om inget data finns för språket, skapa tom data
          const emptyData: ContentData = {};
          sectionConfig.fields.forEach((field) => {
            emptyData[field.id] = "";
          });
          setFormData(emptyData);
        }
      } else {
        // Om inget data finns för språket, skapa tom data
        const emptyData: ContentData = {};
        sectionConfig.fields.forEach((field) => {
          emptyData[field.id] = "";
        });
        setFormData(emptyData);
      }
    }
  }, [activeLanguage, sectionConfig, initialData, formData, setActiveLanguage, setFormData]);

  return { handleLanguageChange };
}

