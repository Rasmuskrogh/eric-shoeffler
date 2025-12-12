import { useEffect, useCallback, useMemo } from "react";
import {
  ContentData,
  ContentEditorProps,
  NestedContentData,
  ContentDataValue,
} from "./types";
import styles from "./ContentEditor.module.css";
// Import extracted modules
import {
  useContentEditorState,
  useLanguageSwitching,
} from "./ContentEditor/hooks";
import { sanitizeSharedData } from "./ContentEditor/data/dataSanitization";
import { useImageUpload } from "./ContentEditor/imageUpload/useImageUpload";
import { ContentEditorProvider } from "./ContentEditor/context";
// Import UI components
import {
  LanguageTabs,
  SharedFieldsSection,
  FieldsSection,
  ListSection,
  FormActions,
} from "./ContentEditor/ui";

export default function ContentEditor({
  sectionConfig,
  initialData,
  onSave,
}: ContentEditorProps) {
  // Use extracted state hook
  const {
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
  } = useContentEditorState(initialData, sectionConfig);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, sectionConfig, activeLanguage]);

  const handleChange = (fieldId: string, value: ContentDataValue) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  const handleSharedChange = (fieldId: string, value: ContentDataValue) => {
    setSharedData((prevData) => ({
      ...prevData,
      [fieldId]: value,
    }));
  };

  // Image upload functions are now provided by useImageUpload hook (initialized below after updateListItemInKey)

  // sanitizeSharedData is now imported from dataSanitization module

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
        // Säkerställ att items alltid är en array (för shared lists validering)
        const currentListItems = Array.isArray(
          overrideListItems !== undefined ? overrideListItems : listItems
        )
          ? overrideListItems !== undefined
            ? overrideListItems
            : listItems
          : [];
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

              // Säkerställ att items alltid är en array (för shared lists validering)
              const itemsArray = Array.isArray(currentListItems)
                ? currentListItems
                : [];

              // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { items: _, ...sharedDataWithoutItems } =
                sanitizedSharedData;

              dataToSave = {
                ...filteredUpdatedLocalized,
                ...sharedDataWithoutItems,
                items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
              } as unknown as Record<string, ContentData>;
            } else {
              // Säkerställ att items alltid är en array (för shared lists validering)
              const itemsArray = Array.isArray(currentListItems)
                ? currentListItems
                : [];

              // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { items: _, ...sharedDataWithoutItems } =
                sanitizedSharedData;

              dataToSave = {
                ...sharedDataWithoutItems,
                items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
                [activeLanguage!]: {
                  ...filteredFormData,
                },
              } as unknown as Record<string, ContentData>;
            }
          } else {
            // Säkerställ att items alltid är en array (för shared lists validering)
            const itemsArray = Array.isArray(currentListItems)
              ? currentListItems
              : [];

            // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

            dataToSave = {
              ...sharedDataWithoutItems,
              items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
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
      } catch {
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
      setIsSaving,
      setSaveStatus,
    ]
  );

  // List management hooks - initialized after performAutoSave is defined
  // Note: We need to initialize these after performAutoSave because of circular dependency
  // For now, we'll keep the functions inline but can refactor later

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

      // Hämta alla befintliga items från initialData som backup
      // listItems state innehåller redan alla items från initialData (laddade i useEffect)
      // men vi behöver en backup om listItems av någon anledning är tom eller ofullständig
      let existingItems: ContentData[] = [];
      if (initialData) {
        const existingData = initialData as
          | Record<string, ContentData>
          | ContentData;
        const isLocalized =
          sectionConfig.languages &&
          sectionConfig.languages.length > 0 &&
          typeof existingData === "object" &&
          existingData !== null &&
          !Array.isArray(existingData) &&
          sectionConfig.languages[0] in existingData;

        if (isLocalized) {
          // För lokaliserad data, items finns på toppnivån (t.ex. schedule: { items: [...], en: {...}, sv: {...} })
          const dataAsRecord = existingData as unknown as Record<
            string,
            unknown
          >;
          if (dataAsRecord.items && Array.isArray(dataAsRecord.items)) {
            existingItems = dataAsRecord.items as ContentData[];
          }
        } else {
          // För icke-lokaliserad data, items finns direkt i initialData.items
          if (Array.isArray((existingData as ContentData).items)) {
            existingItems = (existingData as ContentData)
              .items as ContentData[];
          }
        }
      }

      // Använd listItems från state som primär källa (de innehåller redan alla items från initialData + uppdateringar)
      // listItems laddas i useEffect från initialData.items, så den borde alltid innehålla alla items
      let updatedItems: ContentData[] = [];

      if (listItems.length > 0) {
        // listItems innehåller redan alla items från initialData (laddade i useEffect rad 36-65)
        // plus eventuella uppdateringar från updateListItem, så använd dem direkt
        updatedItems = [...listItems];
      } else {
        // Om listItems är tom (vilket inte borde hända normalt), använd existingItems som backup
        updatedItems = [...existingItems];
      }

      // Extra säkerhet: säkerställ att vi inte förlorar några items genom att merga med existingItems
      // om det finns items i existingItems som inte finns i updatedItems
      if (existingItems.length > 0 && updatedItems.length > 0) {
        const updatedItemsIds = new Set(
          updatedItems
            .map((item) => {
              // Hantera både string och number IDs
              if (item.id !== undefined && item.id !== null) {
                return String(item.id);
              }
              return null;
            })
            .filter((id): id is string => id !== null)
        );

        // Lägg till items från existingItems som saknas i updatedItems
        existingItems.forEach((item) => {
          const itemId =
            item.id !== undefined && item.id !== null ? String(item.id) : null;
          if (itemId && !updatedItemsIds.has(itemId)) {
            updatedItems.push(item);
          }
        });
      }

      // Säkerställ att items alltid är en array (för shared lists validering)
      const itemsArray = Array.isArray(updatedItems) ? updatedItems : [];

      // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

      let dataToSave: ContentData | Record<string, ContentData> = {
        ...sharedDataWithoutItems,
        items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
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

          // Säkerställ att items alltid är en array (för shared lists validering)
          const itemsArray = Array.isArray(updatedItems) ? updatedItems : [];

          // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

          dataToSave = {
            ...filteredUpdatedLocalized,
            ...sharedDataWithoutItems,
            items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
          } as unknown as Record<string, ContentData>;
        }
      }

      await onSave(dataToSave as unknown as ContentData);
      setSaveStatus("success");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    } catch {
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

  // Image upload hook will be initialized after updateListItemInKey is defined

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
    } catch {
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

  // Initialize image upload hook after updateListItemInKey is defined
  const {
    handleImageUpload,
    handleImageUploadForListItem,
    handleImageUploadForListItemInKey,
    handleImageUploadForShared,
  } = useImageUpload(
    sectionConfig,
    setUploadingImage,
    handleChange,
    updateListItem,
    updateListItemInKey,
    handleSharedChange
  );

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
              // Säkerställ att det alltid är en array (för shared lists validering)
              sharedListsData[listKey] = Array.isArray(dataAsRecord[listKey])
                ? (dataAsRecord[listKey] as ContentData[])
                : [];
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
            // Säkerställ att det alltid är en array (för shared lists validering)
            sharedListsData[listKey] = Array.isArray(processedList)
              ? processedList
              : [];
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

            // Säkerställ att items alltid är en array (för shared lists validering)
            const itemsArray = Array.isArray(listItems) ? listItems : [];

            // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

            // Lägg till items på toppnivån tillsammans med språk-data
            dataToSave = {
              ...filteredUpdatedLocalized,
              ...sharedDataWithoutItems,
              items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
            } as unknown as Record<string, ContentData>;
          } else {
            // Säkerställ att items alltid är en array (för shared lists validering)
            const itemsArray = Array.isArray(listItems) ? listItems : [];

            // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

            // Skapa ny språk-struktur med items på toppnivån
            dataToSave = {
              ...sharedDataWithoutItems,
              items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
              [activeLanguage!]: {
                ...filteredFormData,
              },
            } as unknown as Record<string, ContentData>;
          }
        } else if (
          sectionConfig.type !== "list" &&
          sectionConfig.fields.length > 0
        ) {
          // Säkerställ att items alltid är en array (för shared lists validering)
          const itemsArray = Array.isArray(listItems) ? listItems : [];

          // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

          // Ingen språk-struktur, men det finns fields
          dataToSave = {
            ...filteredFormData,
            ...sharedDataWithoutItems,
            items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
          } as ContentData;
        } else {
          // Säkerställ att items alltid är en array (för shared lists validering)
          const itemsArray = Array.isArray(listItems) ? listItems : [];

          // Ta bort items från sanitizedSharedData om den finns där (för att undvika att skriva över arrayen)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { items: _, ...sharedDataWithoutItems } = sanitizedSharedData;

          // Bara lista, ingen språk-struktur, inga fields
          dataToSave = {
            ...sharedDataWithoutItems,
            items: itemsArray, // Sätt items EFTER sharedData för att säkerställa att det är en array
          } as ContentData;
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
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Field rendering is now handled by extracted components:
  // - SharedFieldRenderer for shared fields
  // - FieldRenderer for regular fields
  // - ListItemFieldRenderer for list item fields

  // Use extracted language switching hook
  const { handleLanguageChange } = useLanguageSwitching({
    sectionConfig,
    initialData,
    activeLanguage,
    setActiveLanguage,
    setFormData,
    formData,
  });

  // Create context value with all state and handlers
  const contextValue = useMemo(
    () => ({
      // State
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
      // Config
      sectionConfig,
      initialData,
      // Handlers
      handleChange,
      handleSharedChange,
      handleLanguageChange,
      handleImageUpload,
      handleImageUploadForListItem,
      handleImageUploadForListItemInKey,
      handleImageUploadForShared,
      updateListItem,
      updateListItemInKey,
      addListItem,
      removeListItem,
      addListItemToKey,
      removeListItemFromKey,
      saveSingleListItem,
      saveSingleListItemInKey,
      performAutoSave,
      handleSubmit,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      formData,
      sharedData,
      isSaving,
      saveStatus,
      uploadingImage,
      activeLanguage,
      listItems,
      listItemsByKey,
      sectionConfig,
      initialData,
      handleChange,
      handleSharedChange,
      handleLanguageChange,
      handleImageUpload,
      handleImageUploadForListItem,
      handleImageUploadForListItemInKey,
      handleImageUploadForShared,
      updateListItem,
      updateListItemInKey,
      addListItem,
      removeListItem,
      addListItemToKey,
      removeListItemFromKey,
      saveSingleListItem,
      saveSingleListItemInKey,
      performAutoSave,
      handleSubmit,
    ]
  );

  return (
    <ContentEditorProvider value={contextValue}>
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

          <SharedFieldsSection />
          <LanguageTabs />

          <div className={styles.fieldsContainer}>
            <FieldsSection />

            {/* Render lista om listItemConfig finns */}
            {sectionConfig.listItemConfig && (
              <ListSection
                showDivider={
                  sectionConfig.fields.length > 0 &&
                  sectionConfig.type !== "list"
                }
              />
            )}

            {/* Render flera listor om listItemConfigs finns */}
            {sectionConfig.listItemConfigs &&
              Object.keys(sectionConfig.listItemConfigs || {}).map(
                (listKey, index) => {
                  const showDivider =
                    sectionConfig.fields.length > 0 ||
                    !!sectionConfig.listItemConfig ||
                    index > 0;

                  return (
                    <ListSection
                      key={listKey}
                      listKey={listKey}
                      showDivider={showDivider}
                    />
                  );
                }
              )}

            {/* Om typen är "list" och det INTE finns listItemConfig eller listItemConfigs, visa tomt */}
            {sectionConfig.type === "list" &&
              !sectionConfig.listItemConfig &&
              !sectionConfig.listItemConfigs && (
                <p className={styles.emptyStateMessage}>
                  No list configuration found. Please add listItemConfig or
                  listItemConfigs to your section.
                </p>
              )}

            {/* Om det varken finns fields eller lista */}
            {sectionConfig.fields.length === 0 &&
              !sectionConfig.listItemConfig &&
              !sectionConfig.listItemConfigs &&
              sectionConfig.type !== "list" && (
                <p className={styles.emptyStateMessage}>
                  No fields configured for this section.
                </p>
              )}
          </div>
          <FormActions />
        </form>
      </div>
    </ContentEditorProvider>
  );
}
