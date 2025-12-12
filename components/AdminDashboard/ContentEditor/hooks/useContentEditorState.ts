import { useState } from "react";
import type { ContentData, SectionConfig } from "../../types";

/**
 * Hook to manage all state for ContentEditor
 */
export function useContentEditorState(
  initialData: ContentData | null | undefined,
  sectionConfig: SectionConfig
) {
  const [formData, setFormData] = useState<ContentData>(initialData || {});
  // Delade fält (t.ex. bilder) som inte är språk-specifika
  const [sharedData, setSharedData] = useState<ContentData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(
    sectionConfig.languages?.[0] || null
  );

  // För list-sektioner: håll listan separat (en lista)
  const [listItems, setListItems] = useState<ContentData[]>([]);
  // För flera listor: objekt där nyckeln är namnet på listan
  const [listItemsByKey, setListItemsByKey] = useState<
    Record<string, ContentData[]>
  >({});

  return {
    formData,
    setFormData,
    sharedData,
    setSharedData,
    isSaving,
    setIsSaving,
    saveStatus,
    setSaveStatus,
    uploadingImage,
    setUploadingImage,
    activeLanguage,
    setActiveLanguage,
    listItems,
    setListItems,
    listItemsByKey,
    setListItemsByKey,
  };
}

