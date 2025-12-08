import { useEffect, useState, useCallback } from "react";
import {
  SectionConfig,
  ContentData,
  ContentEditorProps,
  NestedContentData,
  ContentDataValue,
  EditorField,
} from "./types";
import styles from "./ContentEditor.module.css";

export default function ContentEditor({
  sectionConfig,
  initialData,
  onSave,
}: ContentEditorProps) {
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

  useEffect(() => {
    // Hantera en lista om listItemConfig finns (oavsett typ)
    if (sectionConfig.listItemConfig) {
      // För listor, förvänta sig en array i initialData.items
      if (initialData && Array.isArray(initialData.items)) {
        const items = initialData.items as ContentData[];
        // Konvertera localizedFields från strängar till objekt om de är strängar
        const localizedFields = new Set(
          sectionConfig.listItemConfig.localizedFields || []
        );
        const processedItems = items.map((item) => {
          const processedItem: ContentData = { ...item };
          localizedFields.forEach((fieldId) => {
            const fieldValue = item[fieldId];
            // Om fältet är en sträng men ska vara lokaliserat, konvertera till objekt
            if (typeof fieldValue === "string" && fieldValue) {
              // Konvertera sträng till objekt med engelska som default
              processedItem[fieldId] = {
                en: fieldValue,
                sv: fieldValue, // Fallback till engelska
                fr: fieldValue, // Fallback till engelska
              };
            }
          });
          return processedItem;
        });
        setListItems(processedItems);
      } else {
        setListItems([]);
      }
    }

    // Hantera flera listor om listItemConfigs finns
    if (sectionConfig.listItemConfigs) {
      const lists: Record<string, ContentData[]> = {};
      const sharedLists = new Set(sectionConfig.sharedLists || []);

      Object.keys(sectionConfig.listItemConfigs).forEach((listKey) => {
        const isShared = sharedLists.has(listKey);
        const listConfig = sectionConfig.listItemConfigs![listKey];
        const localizedFields = new Set(listConfig?.localizedFields || []);

        if (initialData) {
          // Om listan är delad, hämta från toppnivån
          if (isShared) {
            // initialData kan vara antingen direkt data eller lokaliserad struktur
            // För delade listor, leta på toppnivån oavsett struktur
            const dataAsRecord = initialData as unknown as Record<
              string,
              unknown
            >;
            if (dataAsRecord[listKey] && Array.isArray(dataAsRecord[listKey])) {
              const items = dataAsRecord[listKey] as ContentData[];
              // Konvertera localizedFields från strängar till objekt om de är strängar
              const processedItems = items.map((item) => {
                const processedItem: ContentData = { ...item };
                localizedFields.forEach((fieldId) => {
                  const fieldValue = item[fieldId];
                  if (typeof fieldValue === "string" && fieldValue) {
                    processedItem[fieldId] = {
                      en: fieldValue,
                      sv: fieldValue,
                      fr: fieldValue,
                    };
                  }
                });
                return processedItem;
              });
              lists[listKey] = processedItems;
            } else {
              // Om listan är delad men finns i språk-strukturen (för bakåtkompatibilitet)
              const isLocalized =
                sectionConfig.languages &&
                sectionConfig.languages.length > 0 &&
                typeof initialData === "object" &&
                initialData !== null &&
                !Array.isArray(initialData) &&
                sectionConfig.languages[0] in initialData;

              if (isLocalized && sectionConfig.languages) {
                const localizedData = initialData as unknown as Record<
                  string,
                  ContentData
                >;
                const firstLang = sectionConfig.languages[0];
                if (
                  firstLang &&
                  localizedData[firstLang]?.[listKey] &&
                  Array.isArray(localizedData[firstLang][listKey])
                ) {
                  const items = localizedData[firstLang][
                    listKey
                  ] as ContentData[];
                  // Konvertera localizedFields från strängar till objekt
                  const processedItems = items.map((item) => {
                    const processedItem: ContentData = { ...item };
                    localizedFields.forEach((fieldId) => {
                      const fieldValue = item[fieldId];
                      if (typeof fieldValue === "string" && fieldValue) {
                        processedItem[fieldId] = {
                          en: fieldValue,
                          sv: fieldValue,
                          fr: fieldValue,
                        };
                      }
                    });
                    return processedItem;
                  });
                  lists[listKey] = processedItems;
                } else {
                  lists[listKey] = [];
                }
              } else {
                lists[listKey] = [];
              }
            }
          } else {
            // Listan är språk-specifik, hämta från aktivt språk
            const isLocalized =
              sectionConfig.languages &&
              sectionConfig.languages.length > 0 &&
              typeof initialData === "object" &&
              initialData !== null &&
              !Array.isArray(initialData) &&
              sectionConfig.languages[0] in initialData;

            if (isLocalized && sectionConfig.languages) {
              const localizedData = initialData as unknown as Record<
                string,
                ContentData
              >;
              const defaultLang = activeLanguage || sectionConfig.languages[0];
              if (
                localizedData[defaultLang]?.[listKey] &&
                Array.isArray(localizedData[defaultLang][listKey])
              ) {
                const items = localizedData[defaultLang][
                  listKey
                ] as ContentData[];
                // Konvertera localizedFields från strängar till objekt
                const processedItems = items.map((item) => {
                  const processedItem: ContentData = { ...item };
                  localizedFields.forEach((fieldId) => {
                    const fieldValue = item[fieldId];
                    if (typeof fieldValue === "string" && fieldValue) {
                      processedItem[fieldId] = {
                        en: fieldValue,
                        sv: fieldValue,
                        fr: fieldValue,
                      };
                    }
                  });
                  return processedItem;
                });
                lists[listKey] = processedItems;
              } else {
                lists[listKey] = [];
              }
            } else if (
              initialData[listKey] &&
              Array.isArray(initialData[listKey])
            ) {
              const items = initialData[listKey] as ContentData[];
              // Konvertera localizedFields från strängar till objekt
              const processedItems = items.map((item) => {
                const processedItem: ContentData = { ...item };
                localizedFields.forEach((fieldId) => {
                  const fieldValue = item[fieldId];
                  if (typeof fieldValue === "string" && fieldValue) {
                    processedItem[fieldId] = {
                      en: fieldValue,
                      sv: fieldValue,
                      fr: fieldValue,
                    };
                  }
                });
                return processedItem;
              });
              lists[listKey] = processedItems;
            } else {
              lists[listKey] = [];
            }
          }
        } else {
          lists[listKey] = [];
        }
      });
      setListItemsByKey(lists);
    }

    // Hantera delade fält (sharedFields) - dessa är utanför språk-strukturen
    if (sectionConfig.sharedFields && sectionConfig.sharedFields.length > 0) {
      const sharedFieldIds = new Set(
        sectionConfig.sharedFields.map((f) => f.id)
      );
      const shared: ContentData = {};
      if (initialData) {
        // Om initialData är språk-struktur, hämta delade fält från toppnivån
        const isLocalized =
          sectionConfig.languages &&
          sectionConfig.languages.length > 0 &&
          typeof initialData === "object" &&
          initialData !== null &&
          !Array.isArray(initialData) &&
          sectionConfig.languages[0] in initialData;

        if (isLocalized) {
          // Delade fält kan vara på toppnivån eller i första språket (för bakåtkompatibilitet)
          const localizedData = initialData as unknown as Record<
            string,
            ContentData
          >;
          // Försök hämta från toppnivån först
          Object.keys(initialData).forEach((key) => {
            if (sharedFieldIds.has(key)) {
              const value = (initialData as Record<string, unknown>)[key];
              // Säkerställ att värdet är primitivt (inte ett objekt)
              // Om värdet är ett tomt objekt {}, hoppa över det
              if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value)
              ) {
                // Om objektet är tomt {}, hoppa över det
                if (Object.keys(value).length === 0) {
                  return;
                }
                // Om det är ett objekt, försök hämta URL eller konvertera till sträng
                const valueObj = value as Record<string, unknown>;
                if ("url" in valueObj && typeof valueObj.url === "string") {
                  shared[key] = valueObj.url;
                } else {
                  shared[key] = String(value);
                }
              } else {
                shared[key] = value as ContentDataValue;
              }
            }
          });
          // Om inga delade fält hittades på toppnivån, kolla första språket
          const firstLang = sectionConfig.languages?.[0];
          if (
            Object.keys(shared).length === 0 &&
            firstLang &&
            localizedData[firstLang]
          ) {
            Object.keys(localizedData[firstLang]).forEach((key) => {
              if (sharedFieldIds.has(key)) {
                const value = localizedData[firstLang][key];
                // Säkerställ att värdet är primitivt (inte ett objekt)
                // Om värdet är ett tomt objekt {}, hoppa över det
                if (
                  value !== null &&
                  typeof value === "object" &&
                  !Array.isArray(value)
                ) {
                  // Om objektet är tomt {}, hoppa över det
                  if (Object.keys(value).length === 0) {
                    return;
                  }
                  if ("url" in value && typeof value.url === "string") {
                    shared[key] = value.url;
                  } else {
                    shared[key] = String(value);
                  }
                } else {
                  shared[key] = value;
                }
              }
            });
          }
        } else {
          // Direkt data - hämta delade fält
          Object.keys(initialData).forEach((key) => {
            if (sharedFieldIds.has(key)) {
              const value = initialData[key];
              // Säkerställ att värdet är primitivt (inte ett objekt)
              // Om värdet är ett tomt objekt {}, hoppa över det
              if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value)
              ) {
                // Om objektet är tomt {}, hoppa över det
                if (Object.keys(value).length === 0) {
                  return;
                }
                if ("url" in value && typeof value.url === "string") {
                  shared[key] = value.url;
                } else {
                  shared[key] = String(value);
                }
              } else {
                shared[key] = value;
              }
            }
          });
        }
      }
      setSharedData(shared);
    }

    // Hantera vanliga fields om typen INTE är "list" eller om det finns fields
    if (sectionConfig.type !== "list" || sectionConfig.fields.length > 0) {
      if (initialData) {
        // Filtrera bort fält som inte finns i config (inklusive delade fält)
        const filterDataByConfig = (data: ContentData): ContentData => {
          const allowedFieldIds = new Set(
            sectionConfig.fields.map((f) => f.id)
          );
          const sharedFieldIds = new Set(
            sectionConfig.sharedFields?.map((f) => f.id) || []
          );
          const filtered: ContentData = {};
          Object.keys(data).forEach((key) => {
            // Behåll fält som finns i config (men inte delade fält), eller är listor
            if (
              (allowedFieldIds.has(key) && !sharedFieldIds.has(key)) ||
              key === "items" ||
              sectionConfig.listItemConfigs?.[key]
            ) {
              filtered[key] = data[key];
            }
          });
          return filtered;
        };

        // Om sektionen har språk, förvänta sig språk-struktur
        if (sectionConfig.languages && sectionConfig.languages.length > 0) {
          // initialData kan vara antingen språk-struktur eller direkt data
          const isLocalized =
            typeof initialData === "object" &&
            initialData !== null &&
            !Array.isArray(initialData) &&
            sectionConfig.languages[0] in initialData;

          if (isLocalized) {
            const localizedData = initialData as unknown as Record<
              string,
              ContentData
            >;
            const defaultLang = activeLanguage || sectionConfig.languages[0];
            const langData = localizedData[defaultLang] || {};
            setFormData(filterDataByConfig(langData));
          } else {
            // Fallback: behandla som direkt data
            setFormData(filterDataByConfig(initialData));
          }
        } else {
          setFormData(filterDataByConfig(initialData));
        }
      } else {
        const emptyData: ContentData = {};
        sectionConfig.fields.forEach((field) => {
          emptyData[field.id] = "";
        });
        setFormData(emptyData);
      }
    }
  }, [initialData, sectionConfig, activeLanguage]);

  const handleChange = (
    fieldId: string,
    value: string | number | boolean | NestedContentData
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleSharedChange = (
    fieldId: string,
    value: string | number | boolean | NestedContentData
  ) => {
    setSharedData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleImageUpload = async (fieldId: string, file: File) => {
    setUploadingImage(fieldId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Bestäm mapp baserat på sektion och fält
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";
      formData.append("folder", folder);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      handleChange(fieldId, data.url);
      // width/height sparas automatiskt i bakgrunden om de finns i config
      // (för vanliga fält behöver vi inte spara dem eftersom de inte används)
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  // Image upload för list items (en lista)
  const handleImageUploadForListItem = async (
    itemIndex: number,
    fieldId: string,
    file: File
  ) => {
    const uploadId = `list-item-${itemIndex}-${fieldId}`;
    setUploadingImage(uploadId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Bestäm mapp baserat på sektion och fält
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";
      formData.append("folder", folder);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      updateListItem(itemIndex, fieldId, data.url);
      // Spara width/height automatiskt i bakgrunden, även om de inte finns i config
      if (data.width && data.height) {
        updateListItem(itemIndex, "width", data.width);
        updateListItem(itemIndex, "height", data.height);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  // Image upload för list items (flera listor)
  const handleImageUploadForListItemInKey = async (
    listKey: string,
    itemIndex: number,
    fieldId: string,
    file: File
  ) => {
    const uploadId = `list-item-${listKey}-${itemIndex}-${fieldId}`;
    setUploadingImage(uploadId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Bestäm mapp baserat på sektion, listKey och fält
      const folder =
        sectionConfig.id === "media" &&
        listKey === "gallery" &&
        fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";
      formData.append("folder", folder);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      updateListItemInKey(listKey, itemIndex, fieldId, data.url);
      // Spara width/height automatiskt i bakgrunden, även om de inte finns i config
      if (data.width && data.height) {
        updateListItemInKey(listKey, itemIndex, "width", data.width);
        updateListItemInKey(listKey, itemIndex, "height", data.height);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  // Helper function to ensure values are primitive (not objects)
  const sanitizeSharedData = (data: ContentData): ContentData => {
    const sanitized: ContentData = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      // Om värdet är ett tomt objekt {}, hoppa över det
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        return; // Hoppa över tomma objekt
      }
      // Om värdet är ett objekt (men inte null eller array), konvertera till sträng
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        // Om det är ett objekt, försök hämta URL eller konvertera till sträng
        const valueObj = value as Record<string, unknown>;
        if ("url" in valueObj && typeof valueObj.url === "string") {
          sanitized[key] = valueObj.url;
        } else {
          sanitized[key] = String(value);
        }
      } else {
        sanitized[key] = value;
      }
    });
    return sanitized;
  };

  // Autosave-funktion för listor
  const performAutoSave = useCallback(
    async (
      overrideListItems?: ContentData[],
      overrideListItemsByKey?: Record<string, ContentData[]>
    ) => {
      if (isSaving) return; // Om redan sparar, vänta

      setIsSaving(true);
      setSaveStatus("idle");

      try {
        // Använd override-värden om de finns, annars använd state
        const currentListItems =
          overrideListItems !== undefined ? overrideListItems : listItems;
        const currentListItemsByKey =
          overrideListItemsByKey !== undefined
            ? overrideListItemsByKey
            : listItemsByKey;

        // Filtrera formData för att bara inkludera fält som finns i config
        const allowedFieldIds = new Set(sectionConfig.fields.map((f) => f.id));
        const filteredFormData: ContentData = {};
        Object.keys(formData).forEach((key) => {
          if (allowedFieldIds.has(key)) {
            filteredFormData[key] = formData[key];
          }
        });

        // Sanitize sharedData
        const sanitizedSharedData = sanitizeSharedData(sharedData);

        let dataToSave: ContentData | Record<string, ContentData>;

        // Om det finns flera listor, spara dem
        if (sectionConfig.listItemConfigs) {
          const sharedLists = new Set(sectionConfig.sharedLists || []);
          const sharedListsData: ContentData = {};
          const localizedListsData: ContentData = {};

          // Behåll befintliga delade listor som inte finns i listItemsByKey
          if (initialData) {
            const dataAsRecord = initialData as unknown as Record<
              string,
              unknown
            >;
            Object.keys(sectionConfig.listItemConfigs).forEach((listKey) => {
              const isShared = sharedLists.has(listKey);
              if (
                isShared &&
                !(listKey in currentListItemsByKey) &&
                dataAsRecord[listKey] &&
                Array.isArray(dataAsRecord[listKey])
              ) {
                sharedListsData[listKey] = dataAsRecord[
                  listKey
                ] as ContentData[];
              }
            });
          }

          // Separera delade listor från språk-specifika listor
          Object.keys(currentListItemsByKey).forEach((listKey) => {
            const listConfig = sectionConfig.listItemConfigs![listKey];
            const isShared = sharedLists.has(listKey);
            const localizedFields = new Set(listConfig.localizedFields || []);

            if (isShared) {
              const processedList = currentListItemsByKey[listKey].map(
                (item) => {
                  const processedItem: ContentData = { ...item };

                  if (localizedFields.size > 0 && activeLanguage) {
                    Object.keys(item).forEach((fieldId) => {
                      if (localizedFields.has(fieldId)) {
                        const existingValue = item[fieldId];
                        let descriptions: Record<string, string>;

                        if (
                          typeof existingValue === "object" &&
                          existingValue !== null &&
                          !Array.isArray(existingValue)
                        ) {
                          descriptions = {
                            ...(existingValue as Record<string, string>),
                          };
                        } else {
                          descriptions = {};
                          if (
                            typeof existingValue === "string" &&
                            existingValue
                          ) {
                            descriptions.en = existingValue;
                            descriptions.sv = existingValue;
                            descriptions.fr = existingValue;
                          }
                        }

                        const currentValue = item[fieldId];
                        if (typeof currentValue === "string") {
                          descriptions[activeLanguage] = currentValue;
                        } else if (
                          typeof currentValue === "object" &&
                          currentValue !== null &&
                          !Array.isArray(currentValue)
                        ) {
                          const currentObj = currentValue as Record<
                            string,
                            string
                          >;
                          Object.keys(currentObj).forEach((lang) => {
                            descriptions[lang] = currentObj[lang];
                          });
                        }

                        processedItem[fieldId] = descriptions;
                      }
                    });
                  }

                  return processedItem;
                }
              );

              sharedListsData[listKey] = processedList;
            } else {
              localizedListsData[listKey] = currentListItemsByKey[listKey];
            }
          });

          // Kombinera med språk-struktur
          if (sectionConfig.languages && sectionConfig.languages.length > 0) {
            const existingData = initialData as
              | Record<string, ContentData>
              | ContentData;
            const isLocalized =
              typeof existingData === "object" &&
              existingData !== null &&
              !Array.isArray(existingData) &&
              sectionConfig.languages[0] in existingData;

            if (isLocalized) {
              const existingLocalized = existingData as unknown as Record<
                string,
                ContentData
              >;
              const updatedLocalized: Record<string, ContentData> = {};
              const sharedFieldIds = new Set(
                sectionConfig.sharedFields?.map((f) => f.id) || []
              );

              Object.keys(existingLocalized).forEach((lang) => {
                if (sharedFieldIds.has(lang)) {
                  return;
                }
                if (sectionConfig.languages!.includes(lang)) {
                  if (lang === activeLanguage) {
                    updatedLocalized[lang] = {
                      ...filteredFormData,
                      ...localizedListsData,
                    };
                  } else {
                    const langData = existingLocalized[lang];
                    const filteredLangData: ContentData = {};
                    Object.keys(langData).forEach((key) => {
                      if (
                        allowedFieldIds.has(key) ||
                        sectionConfig.listItemConfigs![key]
                      ) {
                        filteredLangData[key] = langData[key];
                      }
                    });
                    updatedLocalized[lang] = filteredLangData;
                  }
                }
              });

              const filteredUpdatedLocalized: Record<string, ContentData> = {};
              Object.keys(updatedLocalized).forEach((key) => {
                if (!sharedFieldIds.has(key)) {
                  filteredUpdatedLocalized[key] = updatedLocalized[key];
                }
              });

              dataToSave = {
                ...sharedListsData,
                ...filteredUpdatedLocalized,
                ...sanitizedSharedData,
              } as Record<string, ContentData>;
            } else {
              dataToSave = {
                ...sanitizedSharedData,
                ...sharedListsData,
                [activeLanguage!]: {
                  ...filteredFormData,
                  ...localizedListsData,
                },
              } as Record<string, ContentData>;
            }
          } else {
            dataToSave = {
              ...sanitizedSharedData,
              ...filteredFormData,
              ...sharedListsData,
              ...localizedListsData,
            } as ContentData;
          }
        } else if (sectionConfig.listItemConfig) {
          // En lista
          if (sectionConfig.languages && sectionConfig.languages.length > 0) {
            const existingData = initialData as
              | Record<string, ContentData>
              | ContentData;
            const isLocalized =
              typeof existingData === "object" &&
              existingData !== null &&
              !Array.isArray(existingData) &&
              sectionConfig.languages[0] in existingData;

            if (isLocalized) {
              const existingLocalized = existingData as unknown as Record<
                string,
                ContentData
              >;
              const updatedLocalized: Record<string, ContentData> = {};
              const sharedFieldIds = new Set(
                sectionConfig.sharedFields?.map((f) => f.id) || []
              );

              Object.keys(existingLocalized).forEach((lang) => {
                if (sharedFieldIds.has(lang)) {
                  return;
                }
                if (lang === activeLanguage) {
                  updatedLocalized[lang] = {
                    ...filteredFormData,
                  };
                } else {
                  const langData = existingLocalized[lang];
                  const filteredLangData: ContentData = {};
                  Object.keys(langData).forEach((key) => {
                    if (allowedFieldIds.has(key)) {
                      filteredLangData[key] = langData[key];
                    }
                  });
                  updatedLocalized[lang] = filteredLangData;
                }
              });

              const filteredUpdatedLocalized: Record<string, ContentData> = {};
              Object.keys(updatedLocalized).forEach((key) => {
                if (!sharedFieldIds.has(key)) {
                  filteredUpdatedLocalized[key] = updatedLocalized[key];
                }
              });

              dataToSave = {
                items: currentListItems,
                ...filteredUpdatedLocalized,
                ...sanitizedSharedData,
              } as unknown as Record<string, ContentData>;
            } else {
              dataToSave = {
                items: currentListItems,
                ...sanitizedSharedData,
                [activeLanguage!]: {
                  ...filteredFormData,
                },
              } as unknown as Record<string, ContentData>;
            }
          } else {
            dataToSave = {
              items: currentListItems,
            } as ContentData;
          }
        } else {
          // Ingen lista
          if (sectionConfig.languages && sectionConfig.languages.length > 0) {
            const existingData = initialData as
              | Record<string, ContentData>
              | ContentData;
            const isLocalized =
              typeof existingData === "object" &&
              existingData !== null &&
              !Array.isArray(existingData) &&
              sectionConfig.languages[0] in existingData;

            if (isLocalized) {
              const existingLocalized = existingData as unknown as Record<
                string,
                ContentData
              >;
              const updatedLocalized: Record<string, ContentData> = {};
              const sharedFieldIds = new Set(
                sectionConfig.sharedFields?.map((f) => f.id) || []
              );

              Object.keys(existingLocalized).forEach((lang) => {
                if (sharedFieldIds.has(lang)) {
                  return;
                }
                if (lang === activeLanguage) {
                  updatedLocalized[lang] = filteredFormData;
                } else {
                  const langData = existingLocalized[lang];
                  const filteredLangData: ContentData = {};
                  Object.keys(langData).forEach((key) => {
                    if (allowedFieldIds.has(key)) {
                      filteredLangData[key] = langData[key];
                    }
                  });
                  updatedLocalized[lang] = filteredLangData;
                }
              });

              const filteredUpdatedLocalized: Record<string, ContentData> = {};
              Object.keys(updatedLocalized).forEach((key) => {
                if (!sharedFieldIds.has(key)) {
                  filteredUpdatedLocalized[key] = updatedLocalized[key];
                }
              });

              dataToSave = {
                ...filteredUpdatedLocalized,
                ...sanitizedSharedData,
              } as Record<string, ContentData>;
            } else {
              dataToSave = {
                [activeLanguage!]: filteredFormData,
                ...sanitizedSharedData,
              } as Record<string, ContentData>;
            }
          } else {
            dataToSave = {
              ...filteredFormData,
              ...sanitizedSharedData,
            } as ContentData;
          }
        }

        await onSave(dataToSave as ContentData);
        setSaveStatus("success");

        // Dölj success-meddelandet efter 2 sekunder
        setTimeout(() => {
          setSaveStatus("idle");
        }, 2000);
      } catch (error) {
        console.error("Error auto-saving:", error);
        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    },
    [
      formData,
      sharedData,
      listItems,
      listItemsByKey,
      activeLanguage,
      sectionConfig,
      initialData,
      isSaving,
      onSave,
    ]
  );

  // List-hantering funktioner (för en lista)
  const addListItem = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!sectionConfig.listItemConfig) return;

    const newItem: ContentData = {};
    sectionConfig.listItemConfig.fields.forEach((field) => {
      if (field.nestedFields) {
        // För nested fields (t.ex. startDate)
        const nestedObj: NestedContentData = {};
        field.nestedFields.forEach((nestedField) => {
          nestedObj[nestedField.id] = "";
        });
        newItem[field.id] = nestedObj;
      } else {
        newItem[field.id] = "";
      }
    });
    // Generera ett unikt ID
    newItem.id = crypto.randomUUID();

    // Lägg till nytt item högst upp i listan
    setListItems([newItem, ...listItems]);
    // Ingen autosave här - användaren ska kunna fylla i fält först
  };

  const removeListItem = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updatedItems = listItems.filter((_, i) => i !== index);
    setListItems(updatedItems);
    // Spara direkt med uppdaterade items
    performAutoSave(updatedItems, undefined);
  };

  // Spara ett specifikt item (för save-knapp per item)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveSingleListItem = async (_itemIndex: number) => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const allowedFieldIds = new Set(sectionConfig.fields.map((f) => f.id));
      const filteredFormData: ContentData = {};
      Object.keys(formData).forEach((key) => {
        if (allowedFieldIds.has(key)) {
          filteredFormData[key] = formData[key];
        }
      });

      const sanitizedSharedData = sanitizeSharedData(sharedData);

      // Skapa data med bara det uppdaterade item:et
      const updatedItems = [...listItems];
      let dataToSave: ContentData | Record<string, ContentData> = {
        items: updatedItems,
        ...sanitizedSharedData,
      } as ContentData;

      if (sectionConfig.languages && sectionConfig.languages.length > 0) {
        const existingData = initialData as
          | Record<string, ContentData>
          | ContentData;
        const isLocalized =
          typeof existingData === "object" &&
          existingData !== null &&
          !Array.isArray(existingData) &&
          sectionConfig.languages[0] in existingData;

        if (isLocalized) {
          const existingLocalized = existingData as unknown as Record<
            string,
            ContentData
          >;
          const updatedLocalized: Record<string, ContentData> = {};
          const sharedFieldIds = new Set(
            sectionConfig.sharedFields?.map((f) => f.id) || []
          );

          Object.keys(existingLocalized).forEach((lang) => {
            if (sharedFieldIds.has(lang)) {
              return;
            }
            if (lang === activeLanguage) {
              updatedLocalized[lang] = filteredFormData;
            } else {
              const langData = existingLocalized[lang];
              const filteredLangData: ContentData = {};
              Object.keys(langData).forEach((key) => {
                if (allowedFieldIds.has(key)) {
                  filteredLangData[key] = langData[key];
                }
              });
              updatedLocalized[lang] = filteredLangData;
            }
          });

          const filteredUpdatedLocalized: Record<string, ContentData> = {};
          Object.keys(updatedLocalized).forEach((key) => {
            if (!sharedFieldIds.has(key)) {
              filteredUpdatedLocalized[key] = updatedLocalized[key];
            }
          });

          dataToSave = {
            items: updatedItems,
            ...filteredUpdatedLocalized,
            ...sanitizedSharedData,
          } as unknown as Record<string, ContentData>;
        }
      }

      await onSave(dataToSave as unknown as ContentData);
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error saving item:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateListItem = (
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const updatedItems = [...listItems];
    const listConfig = sectionConfig.listItemConfig;
    const localizedFields = new Set(listConfig?.localizedFields || []);
    const isLocalized = localizedFields.has(fieldId);

    if (nestedFieldId) {
      // Uppdatera nested field (t.ex. startDate.day)
      if (
        !updatedItems[index][fieldId] ||
        typeof updatedItems[index][fieldId] !== "object"
      ) {
        updatedItems[index][fieldId] = {};
      }
      (updatedItems[index][fieldId] as NestedContentData)[nestedFieldId] =
        value as string | number | boolean | null;
    } else if (isLocalized && activeLanguage) {
      // För localizedFields, spara som objekt med språk-nycklar
      const existingValue = updatedItems[index][fieldId];
      const localizedValue =
        typeof existingValue === "object" &&
        existingValue !== null &&
        !Array.isArray(existingValue)
          ? (existingValue as Record<string, string>)
          : {};

      localizedValue[activeLanguage] = value as string;
      updatedItems[index][fieldId] = localizedValue;
    } else {
      // Uppdatera vanligt field
      updatedItems[index][fieldId] = value;
    }
    setListItems(updatedItems);
  };

  // List-hantering funktioner (för flera listor)
  const addListItemToKey = (listKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const listConfig = sectionConfig.listItemConfigs?.[listKey];
    if (!listConfig) return;

    const newItem: ContentData = {};
    listConfig.fields.forEach((field) => {
      if (field.nestedFields) {
        const nestedObj: NestedContentData = {};
        field.nestedFields.forEach((nestedField) => {
          nestedObj[nestedField.id] = "";
        });
        newItem[field.id] = nestedObj;
      } else {
        newItem[field.id] = "";
      }
    });
    newItem.id = crypto.randomUUID();

    // Lägg till nytt item högst upp i listan
    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: [newItem, ...(listItemsByKey[listKey] || [])],
    });
    // Ingen autosave här - användaren ska kunna fylla i fält först
  };

  const removeListItemFromKey = (
    listKey: string,
    index: number,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updatedList = (listItemsByKey[listKey] || []).filter(
      (_, i) => i !== index
    );
    const updatedListItemsByKey = {
      ...listItemsByKey,
      [listKey]: updatedList,
    };
    setListItemsByKey(updatedListItemsByKey);
    // Spara direkt med uppdaterade items
    performAutoSave(undefined, updatedListItemsByKey);
  };

  // Spara ett specifikt item i en lista (för save-knapp per item)
  const saveSingleListItemInKey = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _listKey: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _itemIndex: number
  ) => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const allowedFieldIds = new Set(sectionConfig.fields.map((f) => f.id));
      const filteredFormData: ContentData = {};
      Object.keys(formData).forEach((key) => {
        if (allowedFieldIds.has(key)) {
          filteredFormData[key] = formData[key];
        }
      });

      const sanitizedSharedData = sanitizeSharedData(sharedData);

      // Skapa data med bara den uppdaterade listan
      const updatedListItemsByKey = { ...listItemsByKey };
      const sharedLists = new Set(sectionConfig.sharedLists || []);
      const sharedListsData: ContentData = {};
      const localizedListsData: ContentData = {};

      // Behåll befintliga delade listor som inte finns i listItemsByKey
      if (initialData) {
        const dataAsRecord = initialData as unknown as Record<string, unknown>;
        Object.keys(sectionConfig.listItemConfigs || {}).forEach((key) => {
          const isShared = sharedLists.has(key);
          if (
            isShared &&
            !(key in updatedListItemsByKey) &&
            dataAsRecord[key] &&
            Array.isArray(dataAsRecord[key])
          ) {
            sharedListsData[key] = dataAsRecord[key] as ContentData[];
          }
        });
      }

      // Processa alla listor
      Object.keys(updatedListItemsByKey).forEach((key) => {
        const listConfig = sectionConfig.listItemConfigs![key];
        const isShared = sharedLists.has(key);
        const localizedFields = new Set(listConfig.localizedFields || []);

        if (isShared) {
          const processedList = updatedListItemsByKey[key].map((item) => {
            const processedItem: ContentData = { ...item };

            if (localizedFields.size > 0 && activeLanguage) {
              Object.keys(item).forEach((fieldId) => {
                if (localizedFields.has(fieldId)) {
                  const existingValue = item[fieldId];
                  let descriptions: Record<string, string>;

                  if (
                    typeof existingValue === "object" &&
                    existingValue !== null &&
                    !Array.isArray(existingValue)
                  ) {
                    descriptions = {
                      ...(existingValue as Record<string, string>),
                    };
                  } else {
                    descriptions = {};
                    if (typeof existingValue === "string" && existingValue) {
                      descriptions.en = existingValue;
                      descriptions.sv = existingValue;
                      descriptions.fr = existingValue;
                    }
                  }

                  const currentValue = item[fieldId];
                  if (typeof currentValue === "string") {
                    descriptions[activeLanguage] = currentValue;
                  } else if (
                    typeof currentValue === "object" &&
                    currentValue !== null &&
                    !Array.isArray(currentValue)
                  ) {
                    const currentObj = currentValue as Record<string, string>;
                    Object.keys(currentObj).forEach((lang) => {
                      descriptions[lang] = currentObj[lang];
                    });
                  }

                  processedItem[fieldId] = descriptions;
                }
              });
            }

            return processedItem;
          });

          sharedListsData[key] = processedList;
        } else {
          localizedListsData[key] = updatedListItemsByKey[key];
        }
      });

      // Kombinera med språk-struktur
      let dataToSave: ContentData | Record<string, ContentData>;
      if (sectionConfig.languages && sectionConfig.languages.length > 0) {
        const existingData = initialData as
          | Record<string, ContentData>
          | ContentData;
        const isLocalized =
          typeof existingData === "object" &&
          existingData !== null &&
          !Array.isArray(existingData) &&
          sectionConfig.languages[0] in existingData;

        if (isLocalized) {
          const existingLocalized = existingData as unknown as Record<
            string,
            ContentData
          >;
          const updatedLocalized: Record<string, ContentData> = {};
          const sharedFieldIds = new Set(
            sectionConfig.sharedFields?.map((f) => f.id) || []
          );

          Object.keys(existingLocalized).forEach((lang) => {
            if (sharedFieldIds.has(lang)) {
              return;
            }
            if (sectionConfig.languages!.includes(lang)) {
              if (lang === activeLanguage) {
                updatedLocalized[lang] = {
                  ...filteredFormData,
                  ...localizedListsData,
                };
              } else {
                const langData = existingLocalized[lang];
                const filteredLangData: ContentData = {};
                Object.keys(langData).forEach((key) => {
                  if (
                    allowedFieldIds.has(key) ||
                    sectionConfig.listItemConfigs![key]
                  ) {
                    filteredLangData[key] = langData[key];
                  }
                });
                updatedLocalized[lang] = filteredLangData;
              }
            }
          });

          const filteredUpdatedLocalized: Record<string, ContentData> = {};
          Object.keys(updatedLocalized).forEach((key) => {
            if (!sharedFieldIds.has(key)) {
              filteredUpdatedLocalized[key] = updatedLocalized[key];
            }
          });

          dataToSave = {
            ...sharedListsData,
            ...filteredUpdatedLocalized,
            ...sanitizedSharedData,
          } as Record<string, ContentData>;
        } else {
          dataToSave = {
            ...sanitizedSharedData,
            ...sharedListsData,
            [activeLanguage!]: {
              ...filteredFormData,
              ...localizedListsData,
            },
          } as Record<string, ContentData>;
        }
      } else {
        dataToSave = {
          ...sanitizedSharedData,
          ...filteredFormData,
          ...sharedListsData,
          ...localizedListsData,
        } as ContentData;
      }

      await onSave(dataToSave as unknown as ContentData);
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Error saving item:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateListItemInKey = (
    listKey: string,
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const updatedItems = [...(listItemsByKey[listKey] || [])];
    const listConfig = sectionConfig.listItemConfigs?.[listKey];
    const localizedFields = new Set(listConfig?.localizedFields || []);
    const isLocalized = localizedFields.has(fieldId);

    if (nestedFieldId) {
      if (
        !updatedItems[index][fieldId] ||
        typeof updatedItems[index][fieldId] !== "object"
      ) {
        updatedItems[index][fieldId] = {};
      }
      (updatedItems[index][fieldId] as NestedContentData)[nestedFieldId] =
        value as string | number | boolean | null;
    } else if (isLocalized && activeLanguage) {
      // För localizedFields, spara som objekt med språk-nycklar
      const existingValue = updatedItems[index][fieldId];
      const localizedValue =
        typeof existingValue === "object" &&
        existingValue !== null &&
        !Array.isArray(existingValue)
          ? (existingValue as Record<string, string>)
          : {};

      localizedValue[activeLanguage] = value as string;
      updatedItems[index][fieldId] = localizedValue;
    } else {
      updatedItems[index][fieldId] = value;
    }
    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: updatedItems,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Filtrera formData för att bara inkludera fält som finns i config
      const allowedFieldIds = new Set(sectionConfig.fields.map((f) => f.id));
      const filteredFormData: ContentData = {};
      Object.keys(formData).forEach((key) => {
        if (allowedFieldIds.has(key)) {
          filteredFormData[key] = formData[key];
        }
      });

      // Sanitize sharedData för att säkerställa att alla värden är primitiva
      const sanitizedSharedData = sanitizeSharedData(sharedData);

      let dataToSave: ContentData | Record<string, ContentData>;

      // Om det finns flera listor, spara dem
      if (sectionConfig.listItemConfigs) {
        const sharedLists = new Set(sectionConfig.sharedLists || []);
        const sharedListsData: ContentData = {};
        const localizedListsData: ContentData = {};

        // Först: Behåll befintliga delade listor som inte finns i listItemsByKey
        // (t.ex. om videos inte laddades men finns i databasen)
        if (initialData) {
          const dataAsRecord = initialData as unknown as Record<
            string,
            unknown
          >;
          Object.keys(sectionConfig.listItemConfigs).forEach((listKey) => {
            const isShared = sharedLists.has(listKey);
            // Om listan är delad och saknas i listItemsByKey, behåll den från initialData
            if (
              isShared &&
              !(listKey in listItemsByKey) &&
              dataAsRecord[listKey] &&
              Array.isArray(dataAsRecord[listKey])
            ) {
              sharedListsData[listKey] = dataAsRecord[listKey] as ContentData[];
            }
          });
        }

        // Separera delade listor från språk-specifika listor
        Object.keys(listItemsByKey).forEach((listKey) => {
          const listConfig = sectionConfig.listItemConfigs![listKey];
          const isShared = sharedLists.has(listKey);
          const localizedFields = new Set(listConfig.localizedFields || []);

          if (isShared) {
            // För delade listor, hantera localizedFields (t.ex. description för videos)
            const processedList = listItemsByKey[listKey].map((item) => {
              const processedItem: ContentData = { ...item };

              // Om det finns localizedFields, konvertera dem till språk-struktur
              if (localizedFields.size > 0 && activeLanguage) {
                Object.keys(item).forEach((fieldId) => {
                  if (localizedFields.has(fieldId)) {
                    // Hämta befintlig språk-struktur eller skapa ny
                    const existingValue = item[fieldId];
                    let descriptions: Record<string, string>;

                    if (
                      typeof existingValue === "object" &&
                      existingValue !== null &&
                      !Array.isArray(existingValue)
                    ) {
                      // Om det redan är ett objekt, kopiera det (för att undvika cirkulär referens)
                      descriptions = {
                        ...(existingValue as Record<string, string>),
                      };
                    } else {
                      // Om det är en sträng eller null, skapa nytt objekt
                      descriptions = {};
                      // Om det var en sträng, sätt den för alla språk som fallback
                      if (typeof existingValue === "string" && existingValue) {
                        descriptions.en = existingValue;
                        descriptions.sv = existingValue;
                        descriptions.fr = existingValue;
                      }
                    }

                    // Uppdatera det aktiva språket
                    // Notera: I listItemsByKey är värdet redan ett objekt med språk-nycklar
                    // eftersom updateListItemInKey konverterar det till objekt
                    // Så vi behöver bara kopiera det befintliga objektet
                    // Men om det är en sträng (vilket inte borde hända), hantera det också
                    const currentValue = item[fieldId];
                    if (typeof currentValue === "string") {
                      // Om det är en sträng, sätt den för aktivt språk
                      descriptions[activeLanguage] = currentValue;
                    } else if (
                      typeof currentValue === "object" &&
                      currentValue !== null &&
                      !Array.isArray(currentValue)
                    ) {
                      // Om det redan är ett objekt, kopiera alla värden
                      const currentObj = currentValue as Record<string, string>;
                      Object.keys(currentObj).forEach((lang) => {
                        descriptions[lang] = currentObj[lang];
                      });
                    }

                    processedItem[fieldId] = descriptions;
                  }
                });
              }

              return processedItem;
            });

            // Alltid spara den uppdaterade listan om den finns i listItemsByKey
            // (även om den är tom - användaren kan ha tagit bort alla items)
            sharedListsData[listKey] = processedList;
          } else {
            // Språk-specifik lista
            localizedListsData[listKey] = listItemsByKey[listKey];
          }
        });

        // Kombinera fields (om de finns) med alla listor
        if (sectionConfig.languages && sectionConfig.languages.length > 0) {
          // Språk-struktur
          const existingData = initialData as
            | Record<string, ContentData>
            | ContentData;
          const isLocalized =
            typeof existingData === "object" &&
            existingData !== null &&
            !Array.isArray(existingData) &&
            sectionConfig.languages[0] in existingData;

          if (isLocalized) {
            const existingLocalized = existingData as unknown as Record<
              string,
              ContentData
            >;
            const updatedLocalized: Record<string, ContentData> = {};

            // Separera språk-nycklar från delade fält
            const sharedFieldIds = new Set(
              sectionConfig.sharedFields?.map((f) => f.id) || []
            );

            // Behåll alla språk, men uppdatera det aktiva språket
            Object.keys(existingLocalized).forEach((lang) => {
              // Hoppa över delade fält - de hanteras separat
              if (sharedFieldIds.has(lang)) {
                return;
              }
              if (sectionConfig.languages!.includes(lang)) {
                if (lang === activeLanguage) {
                  updatedLocalized[lang] = {
                    ...filteredFormData,
                    ...localizedListsData,
                  };
                } else {
                  // Behåll befintlig data för andra språk
                  const langData = existingLocalized[lang];
                  const filteredLangData: ContentData = {};
                  Object.keys(langData).forEach((key) => {
                    if (
                      allowedFieldIds.has(key) ||
                      sectionConfig.listItemConfigs![key]
                    ) {
                      filteredLangData[key] = langData[key];
                    }
                  });
                  updatedLocalized[lang] = filteredLangData;
                }
              }
            });

            // Filtrera bort delade fält från updatedLocalized om de finns där
            const filteredUpdatedLocalized: Record<string, ContentData> = {};
            Object.keys(updatedLocalized).forEach((key) => {
              if (!sharedFieldIds.has(key)) {
                filteredUpdatedLocalized[key] = updatedLocalized[key];
              }
            });

            // Lägg till delade fält och delade listor på toppnivån
            // VIKTIGT: Lägg till sanitizedSharedData SIST så att delade fält inte skrivs över
            dataToSave = {
              ...sharedListsData,
              ...filteredUpdatedLocalized,
              ...sanitizedSharedData, // Lägg till delade fält SIST så de inte skrivs över
            } as Record<string, ContentData>;
          } else {
            // Skapa ny språk-struktur
            dataToSave = {
              ...sanitizedSharedData,
              ...sharedListsData,
              [activeLanguage!]: {
                ...filteredFormData,
                ...localizedListsData,
              },
            } as Record<string, ContentData>;
          }
        } else {
          // Ingen språk-struktur
          dataToSave = {
            ...sanitizedSharedData,
            ...filteredFormData,
            ...sharedListsData,
            ...localizedListsData,
          } as ContentData;
        }
      } else if (sectionConfig.listItemConfig) {
        // Om det finns en lista, spara den
        // Om det också finns languages, spara items på toppnivån med språk-struktur
        if (sectionConfig.languages && sectionConfig.languages.length > 0) {
          // Språk-struktur med items på toppnivån
          const existingData = initialData as
            | Record<string, ContentData>
            | ContentData;
          const isLocalized =
            typeof existingData === "object" &&
            existingData !== null &&
            !Array.isArray(existingData) &&
            sectionConfig.languages[0] in existingData;

          if (isLocalized) {
            const existingLocalized = existingData as unknown as Record<
              string,
              ContentData
            >;
            const updatedLocalized: Record<string, ContentData> = {};

            // Separera språk-nycklar från delade fält
            const sharedFieldIds = new Set(
              sectionConfig.sharedFields?.map((f) => f.id) || []
            );

            // Behåll alla språk, men uppdatera det aktiva språket
            Object.keys(existingLocalized).forEach((lang) => {
              // Hoppa över delade fält - de hanteras separat
              if (sharedFieldIds.has(lang)) {
                return;
              }
              if (sectionConfig.languages!.includes(lang)) {
                if (lang === activeLanguage) {
                  updatedLocalized[lang] = {
                    ...filteredFormData,
                  };
                } else {
                  // Behåll befintlig data för andra språk
                  const langData = existingLocalized[lang];
                  const filteredLangData: ContentData = {};
                  Object.keys(langData).forEach((key) => {
                    if (allowedFieldIds.has(key)) {
                      filteredLangData[key] = langData[key];
                    }
                  });
                  updatedLocalized[lang] = filteredLangData;
                }
              }
            });

            // Filtrera bort delade fält från updatedLocalized om de finns där
            const filteredUpdatedLocalized: Record<string, ContentData> = {};
            Object.keys(updatedLocalized).forEach((key) => {
              if (!sharedFieldIds.has(key)) {
                filteredUpdatedLocalized[key] = updatedLocalized[key];
              }
            });

            // Lägg till items på toppnivån tillsammans med språk-data
            dataToSave = {
              items: listItems,
              ...filteredUpdatedLocalized,
              ...sanitizedSharedData,
            } as unknown as Record<string, ContentData>;
          } else {
            // Skapa ny språk-struktur med items på toppnivån
            dataToSave = {
              items: listItems,
              ...sanitizedSharedData,
              [activeLanguage!]: {
                ...filteredFormData,
              },
            } as unknown as Record<string, ContentData>;
          }
        } else if (
          sectionConfig.type !== "list" &&
          sectionConfig.fields.length > 0
        ) {
          // Ingen språk-struktur, men det finns fields
          dataToSave = {
            ...filteredFormData,
            items: listItems,
          } as ContentData;
        } else {
          // Bara lista, ingen språk-struktur, inga fields
          dataToSave = { items: listItems } as ContentData;
        }
      } else if (
        sectionConfig.languages &&
        sectionConfig.languages.length > 0
      ) {
        // Om sektionen har språk, spara som språk-struktur
        // Hämta befintlig data eller skapa ny struktur
        const existingData = initialData as
          | Record<string, ContentData>
          | ContentData;
        const isLocalized =
          typeof existingData === "object" &&
          existingData !== null &&
          !Array.isArray(existingData) &&
          sectionConfig.languages[0] in existingData;

        if (isLocalized) {
          // Uppdatera befintlig språk-struktur, men filtrera bort gamla fält
          const existingLocalized = existingData as unknown as Record<
            string,
            ContentData
          >;
          const updatedLocalized: Record<string, ContentData> = {};
          const sharedFieldIds = new Set(
            sectionConfig.sharedFields?.map((f) => f.id) || []
          );

          // Behåll alla språk, men uppdatera det aktiva språket med filtrerad data
          Object.keys(existingLocalized).forEach((lang) => {
            // Hoppa över delade fält - de hanteras separat
            if (sharedFieldIds.has(lang)) {
              return;
            }
            if (lang === activeLanguage) {
              updatedLocalized[lang] = filteredFormData;
            } else {
              // Filtrera även andra språk för att ta bort fält som inte finns i config
              const langData = existingLocalized[lang];
              const filteredLangData: ContentData = {};
              Object.keys(langData).forEach((key) => {
                if (allowedFieldIds.has(key)) {
                  filteredLangData[key] = langData[key];
                }
              });
              updatedLocalized[lang] = filteredLangData;
            }
          });
          // Lägg till delade fält på toppnivån
          // VIKTIGT: Lägg till sanitizedSharedData SIST så att delade fält inte skrivs över
          dataToSave = {
            ...updatedLocalized,
            ...sanitizedSharedData, // Lägg till delade fält SIST så de inte skrivs över
          } as Record<string, ContentData>;
        } else {
          // Skapa ny språk-struktur med delade fält
          // VIKTIGT: Lägg till sanitizedSharedData SIST så att delade fält inte skrivs över
          dataToSave = {
            [activeLanguage!]: filteredFormData,
            ...sanitizedSharedData, // Lägg till delade fält SIST så de inte skrivs över
          } as Record<string, ContentData>;
        }
      } else {
        // Ingen språk-struktur, spara direkt med delade fält
        // VIKTIGT: Lägg till sanitizedSharedData SIST så att delade fält inte skrivs över
        dataToSave = {
          ...filteredFormData,
          ...sanitizedSharedData, // Lägg till delade fält SIST så de inte skrivs över
        } as ContentData;
      }

      await onSave(dataToSave as ContentData);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving content:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSharedField = (field: EditorField) => {
    const value = sharedData[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={`shared-${field.id}`}
            value={value as string}
            onChange={(e) => handleSharedChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "textarea":
        return (
          <textarea
            id={`shared-${field.id}`}
            value={value as string}
            onChange={(e) => handleSharedChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={5}
            className={styles.textarea}
          />
        );

      case "image":
        return (
          <div>
            <label
              htmlFor={`shared-${field.id}-file`}
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                cursor:
                  uploadingImage === `shared-${field.id}`
                    ? "not-allowed"
                    : "pointer",
                opacity: uploadingImage === `shared-${field.id}` ? 0.6 : 1,
                marginBottom: value ? "0.5rem" : "0",
              }}
            >
              {uploadingImage === `shared-${field.id}`
                ? "Uploading..."
                : value
                ? "Replace Image"
                : "Upload Image"}
            </label>
            <input
              type="file"
              id={`shared-${field.id}-file`}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUploadForShared(field.id, file);
                }
              }}
              disabled={uploadingImage === `shared-${field.id}`}
            />
            {value && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={value as string}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleImageUploadForShared = async (fieldId: string, file: File) => {
    const uploadId = `shared-${fieldId}`;
    setUploadingImage(uploadId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Bestäm mapp baserat på fält-ID eller sektion
      // För home-sektionen: alla bilder går till "hero"
      // För about-sektionen: aboutImage går till "hero"
      // För media-sektionen: gallery-bilder kan gå till "gallery" (om det finns)
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";
      formData.append("folder", folder);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      // Säkerställ att vi sparar en sträng, inte ett objekt
      const imageUrl =
        typeof data.url === "string" ? data.url : String(data.url || "");
      if (!imageUrl) {
        throw new Error("No URL returned from upload");
      }
      handleSharedChange(fieldId, imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  const renderField = (field: SectionConfig["fields"][0]) => {
    const value = formData[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            id={field.id}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "textarea":
        return (
          <textarea
            id={field.id}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={5}
            className={styles.textarea}
          />
        );

      case "rich-text":
        return (
          <textarea
            id={field.id}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={10}
            className={styles.textarea}
          />
        );

      case "number":
        return (
          <input
            type="number"
            id={field.id}
            value={value as number}
            onChange={(e) =>
              handleChange(field.id, parseFloat(e.target.value) || 0)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "date":
        // Date field med nested fields (day, month, year)
        if (field.nestedFields) {
          const dateValue = (value as NestedContentData) || {};
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {field.nestedFields.map((nestedField) => (
                <input
                  key={nestedField.id}
                  type={nestedField.id === "year" ? "number" : "text"}
                  value={String(dateValue[nestedField.id] ?? "")}
                  onChange={(e) => {
                    const newDateValue = {
                      ...dateValue,
                      [nestedField.id]:
                        nestedField.id === "year"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    };
                    handleChange(field.id, newDateValue);
                  }}
                  placeholder={nestedField.placeholder || nestedField.label}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              ))}
            </div>
          );
        }
        return (
          <input
            type="date"
            id={field.id}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "image":
        return (
          <div>
            <label
              htmlFor={`${field.id}-file`}
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                cursor: uploadingImage === field.id ? "not-allowed" : "pointer",
                opacity: uploadingImage === field.id ? 0.6 : 1,
                marginBottom: value ? "0.5rem" : "0",
              }}
            >
              {uploadingImage === field.id
                ? "Uploading..."
                : value
                ? "Replace Image"
                : "Upload Image"}
            </label>
            <input
              type="file"
              id={`${field.id}-file`}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(field.id, file);
                }
              }}
              disabled={uploadingImage === field.id}
            />
            {value && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={value as string}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={field.id}
            value={value as string}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );
    }
  };
  // Rendera ett fält för ett list-item
  const renderListItemField = (
    field: SectionConfig["fields"][0],
    item: ContentData,
    itemIndex: number
  ) => {
    const listConfig = sectionConfig.listItemConfig;
    const localizedFields = new Set(listConfig?.localizedFields || []);
    const isLocalized = localizedFields.has(field.id);

    // För localizedFields, hämta värdet för aktivt språk
    let value: ContentDataValue = "";
    if (isLocalized && activeLanguage) {
      const fieldValue = item[field.id];
      if (
        typeof fieldValue === "object" &&
        fieldValue !== null &&
        !Array.isArray(fieldValue)
      ) {
        value = (fieldValue as Record<string, string>)[activeLanguage] || "";
      } else {
        value = "";
      }
    } else {
      value = item[field.id] || "";
    }

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              updateListItem(itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value as string}
            onChange={(e) =>
              updateListItem(itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            rows={3}
            className={styles.textarea}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) =>
              updateListItem(
                itemIndex,
                field.id,
                parseFloat(e.target.value) || 0
              )
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "date":
        // Date field med nested fields (day, month, year)
        if (field.nestedFields) {
          const dateValue = (value as NestedContentData) || {};
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {field.nestedFields.map((nestedField) => (
                <input
                  key={nestedField.id}
                  type={nestedField.id === "year" ? "number" : "text"}
                  value={String(dateValue[nestedField.id] ?? "")}
                  onChange={(e) => {
                    const newDateValue = {
                      ...dateValue,
                      [nestedField.id]:
                        nestedField.id === "year"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    };
                    updateListItem(itemIndex, field.id, newDateValue);
                  }}
                  placeholder={nestedField.placeholder || nestedField.label}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              ))}
            </div>
          );
        }
        return (
          <input
            type="date"
            value={value as string}
            onChange={(e) =>
              updateListItem(itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "image":
        const uploadId = `list-item-${itemIndex}-${field.id}`;
        return (
          <div>
            <label
              htmlFor={`${uploadId}-file`}
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                cursor: uploadingImage === uploadId ? "not-allowed" : "pointer",
                opacity: uploadingImage === uploadId ? 0.6 : 1,
                marginBottom: value ? "0.5rem" : "0",
              }}
            >
              {uploadingImage === uploadId
                ? "Uploading..."
                : value
                ? "Replace Image"
                : "Upload Image"}
            </label>
            <input
              type="file"
              id={`${uploadId}-file`}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUploadForListItem(itemIndex, field.id, file);
                }
              }}
              disabled={uploadingImage === uploadId}
            />
            {value && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={value as string}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              updateListItem(itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );
    }
  };

  // Rendera ett fält för ett list-item i en specifik lista (för flera listor)
  const renderListItemFieldForKey = (
    field: SectionConfig["fields"][0],
    item: ContentData,
    itemIndex: number,
    listKey: string
  ) => {
    const listConfig = sectionConfig.listItemConfigs?.[listKey];
    const localizedFields = new Set(listConfig?.localizedFields || []);
    const isLocalized = localizedFields.has(field.id);

    // För localizedFields, hämta värdet för aktivt språk
    let value: ContentDataValue = "";
    if (isLocalized && activeLanguage) {
      const fieldValue = item[field.id];
      if (
        typeof fieldValue === "object" &&
        fieldValue !== null &&
        !Array.isArray(fieldValue)
      ) {
        value = (fieldValue as Record<string, string>)[activeLanguage] || "";
      } else {
        value = "";
      }
    } else {
      value = item[field.id] || "";
    }

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              updateListItemInKey(listKey, itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value as string}
            onChange={(e) =>
              updateListItemInKey(listKey, itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            rows={3}
            className={styles.textarea}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) =>
              updateListItemInKey(
                listKey,
                itemIndex,
                field.id,
                parseFloat(e.target.value) || 0
              )
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "date":
        // Date field med nested fields (day, month, year)
        if (field.nestedFields) {
          const dateValue = (value as NestedContentData) || {};
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {field.nestedFields.map((nestedField) => (
                <input
                  key={nestedField.id}
                  type={nestedField.id === "year" ? "number" : "text"}
                  value={String(dateValue[nestedField.id] ?? "")}
                  onChange={(e) => {
                    const newDateValue = {
                      ...dateValue,
                      [nestedField.id]:
                        nestedField.id === "year"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    };
                    updateListItemInKey(
                      listKey,
                      itemIndex,
                      field.id,
                      newDateValue
                    );
                  }}
                  placeholder={nestedField.placeholder || nestedField.label}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
              ))}
            </div>
          );
        }
        return (
          <input
            type="date"
            value={value as string}
            onChange={(e) =>
              updateListItemInKey(listKey, itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );

      case "image":
        const uploadIdForKey = `list-item-${listKey}-${itemIndex}-${field.id}`;
        return (
          <div>
            <label
              htmlFor={`${uploadIdForKey}-file`}
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: "0.375rem",
                cursor:
                  uploadingImage === uploadIdForKey ? "not-allowed" : "pointer",
                opacity: uploadingImage === uploadIdForKey ? 0.6 : 1,
                marginBottom: value ? "0.5rem" : "0",
              }}
            >
              {uploadingImage === uploadIdForKey
                ? "Uploading..."
                : value
                ? "Replace Image"
                : "Upload Image"}
            </label>
            <input
              type="file"
              id={`${uploadIdForKey}-file`}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUploadForListItemInKey(
                    listKey,
                    itemIndex,
                    field.id,
                    file
                  );
                }
              }}
              disabled={uploadingImage === uploadIdForKey}
            />
            {value && (
              <div style={{ marginTop: "0.5rem" }}>
                <img
                  src={value as string}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={value as string}
            onChange={(e) =>
              updateListItemInKey(listKey, itemIndex, field.id, e.target.value)
            }
            required={field.required}
            placeholder={field.placeholder}
            className={styles.input}
          />
        );
    }
  };

  const handleLanguageChange = (newLang: string) => {
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
  };

  return (
    <div className={styles.editorContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formHeader}>
          <h2 className={styles.sectionTitle}>{sectionConfig.name}</h2>
          <button
            type="submit"
            disabled={isSaving}
            className={styles.saveButton}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Delade fält (t.ex. bilder) - visas ovanför språk-tabs */}
        {sectionConfig.sharedFields &&
          sectionConfig.sharedFields.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ marginBottom: "1rem", color: "#333" }}>
                Shared Fields (applies to all languages)
              </h3>
              {sectionConfig.sharedFields.map((field) => (
                <div key={field.id} className={styles.fieldGroup}>
                  <label
                    htmlFor={`shared-${field.id}`}
                    className={styles.label}
                  >
                    {field.label}{" "}
                    {field.required && (
                      <span className={styles.required}>*</span>
                    )}
                  </label>
                  {renderSharedField(field)}
                </div>
              ))}
              <div style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
                <hr style={{ border: "1px solid #e0e0e0" }} />
              </div>
            </div>
          )}

        {/* Språk-tabs om språk är konfigurerat */}
        {sectionConfig.languages && sectionConfig.languages.length > 0 && (
          <div
            style={{ marginBottom: "1rem", borderBottom: "1px solid #e0e0e0" }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {sectionConfig.languages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderBottom:
                      activeLanguage === lang
                        ? "2px solid #3b82f6"
                        : "2px solid transparent",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    color: activeLanguage === lang ? "#3b82f6" : "#666",
                    fontWeight: activeLanguage === lang ? "600" : "400",
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.fieldsContainer}>
          {/* Render fields om de finns (och typen inte är "list" eller om det finns fields) */}
          {sectionConfig.fields.length > 0 && sectionConfig.type !== "list" && (
            <>
              {sectionConfig.fields.map((field) => (
                <div key={field.id} className={styles.fieldGroup}>
                  <label htmlFor={field.id} className={styles.label}>
                    {field.label}{" "}
                    {field.required && (
                      <span className={styles.required}>*</span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </>
          )}

          {/* Render lista om listItemConfig finns */}
          {sectionConfig.listItemConfig && (
            <>
              {/* Lägg till mellanrum om både fields och lista finns */}
              {sectionConfig.fields.length > 0 &&
                sectionConfig.type !== "list" && (
                  <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                    <hr style={{ border: "1px solid #e0e0e0" }} />
                  </div>
                )}

              <div>
                <div
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: 0 }}>List Items ({listItems.length})</h3>
                  <button
                    type="button"
                    onClick={(e) => addListItem(e)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    + Add Item
                  </button>
                </div>

                {listItems.length === 0 ? (
                  <p style={{ color: "#666", fontStyle: "italic" }}>
                    No items in list. Click &quot;Add Item&quot; to add your
                    first item.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem",
                    }}
                  >
                    {listItems.map((item, index) => {
                      const itemId =
                        typeof item.id === "string" ||
                        typeof item.id === "number"
                          ? String(item.id)
                          : index;
                      return (
                        <div
                          key={itemId}
                          style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "0.5rem",
                            padding: "1.5rem",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "1rem",
                            }}
                          >
                            <h4 style={{ margin: 0, color: "#333" }}>
                              Item #{index + 1}
                            </h4>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  await saveSingleListItem(index);
                                }}
                                disabled={isSaving}
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  cursor: isSaving ? "not-allowed" : "pointer",
                                  fontSize: "0.875rem",
                                  opacity: isSaving ? 0.6 : 1,
                                }}
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => removeListItem(index, e)}
                                style={{
                                  padding: "0.375rem 0.75rem",
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  cursor: "pointer",
                                  fontSize: "0.875rem",
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "1rem",
                            }}
                          >
                            {sectionConfig.listItemConfig?.fields
                              .filter((field) => field.id !== "id")
                              .map((field) => (
                                <div
                                  key={field.id}
                                  className={styles.fieldGroup}
                                >
                                  <label className={styles.label}>
                                    {field.label}{" "}
                                    {field.required && (
                                      <span className={styles.required}>*</span>
                                    )}
                                  </label>
                                  {renderListItemField(field, item, index)}
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Render flera listor om listItemConfigs finns */}
          {sectionConfig.listItemConfigs &&
            Object.keys(sectionConfig.listItemConfigs || {}).map((listKey) => {
              const listConfig = sectionConfig.listItemConfigs![listKey];
              const items = listItemsByKey[listKey] || [];
              const listName =
                listKey.charAt(0).toUpperCase() +
                listKey.slice(1).replace(/([A-Z])/g, " $1");

              return (
                <div key={listKey}>
                  {/* Lägg till mellanrum om det finns fields eller andra listor före */}
                  {(sectionConfig.fields.length > 0 ||
                    sectionConfig.listItemConfig ||
                    (sectionConfig.listItemConfigs &&
                      Object.keys(sectionConfig.listItemConfigs).indexOf(
                        listKey
                      ) > 0)) && (
                    <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                      <hr style={{ border: "1px solid #e0e0e0" }} />
                    </div>
                  )}

                  <div>
                    <div
                      style={{
                        marginBottom: "1rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }}>
                        {listName} ({items.length})
                      </h3>
                      <button
                        type="button"
                        onClick={(e) => addListItemToKey(listKey, e)}
                        style={{
                          padding: "0.5rem 1rem",
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        + Add Item
                      </button>
                    </div>

                    {items.length === 0 ? (
                      <p style={{ color: "#666", fontStyle: "italic" }}>
                        No items in {listName.toLowerCase()}. Click &quot;Add
                        Item&quot; to add your first item.
                      </p>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.5rem",
                        }}
                      >
                        {items.map((item, index) => {
                          const itemId =
                            typeof item.id === "string" ||
                            typeof item.id === "number"
                              ? String(item.id)
                              : index;
                          return (
                            <div
                              key={itemId}
                              style={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "0.5rem",
                                padding: "1.5rem",
                                backgroundColor: "#fafafa",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "1rem",
                                }}
                              >
                                <h4 style={{ margin: 0, color: "#333" }}>
                                  Item #{index + 1}
                                </h4>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    type="button"
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      await saveSingleListItemInKey(
                                        listKey,
                                        index
                                      );
                                    }}
                                    disabled={isSaving}
                                    style={{
                                      padding: "0.375rem 0.75rem",
                                      backgroundColor: "#3b82f6",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "0.375rem",
                                      cursor: isSaving
                                        ? "not-allowed"
                                        : "pointer",
                                      fontSize: "0.875rem",
                                      opacity: isSaving ? 0.6 : 1,
                                    }}
                                  >
                                    {isSaving ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      removeListItemFromKey(listKey, index, e)
                                    }
                                    style={{
                                      padding: "0.375rem 0.75rem",
                                      backgroundColor: "#ef4444",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "0.375rem",
                                      cursor: "pointer",
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "1rem",
                                }}
                              >
                                {listConfig.fields
                                  .filter((field) => field.id !== "id")
                                  .map((field) => (
                                    <div
                                      key={field.id}
                                      className={styles.fieldGroup}
                                    >
                                      <label className={styles.label}>
                                        {field.label}{" "}
                                        {field.required && (
                                          <span className={styles.required}>
                                            *
                                          </span>
                                        )}
                                      </label>
                                      {renderListItemFieldForKey(
                                        field,
                                        item,
                                        index,
                                        listKey
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Om typen är "list" och det INTE finns listItemConfig eller listItemConfigs, visa tomt */}
          {sectionConfig.type === "list" &&
            !sectionConfig.listItemConfig &&
            !sectionConfig.listItemConfigs && (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                No list configuration found. Please add listItemConfig or
                listItemConfigs to your section.
              </p>
            )}

          {/* Om det varken finns fields eller lista */}
          {sectionConfig.fields.length === 0 &&
            !sectionConfig.listItemConfig &&
            !sectionConfig.listItemConfigs &&
            sectionConfig.type !== "list" && (
              <p style={{ color: "#666", fontStyle: "italic" }}>
                No fields configured for this section.
              </p>
            )}
        </div>
        {saveStatus === "success" && (
          <div className={styles.successMessage}>
            {" "}
            ✓ Changes saved successfully
          </div>
        )}
        {saveStatus === "error" && (
          <div className={styles.errorMessage}>
            ✗ Error saving changes. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
