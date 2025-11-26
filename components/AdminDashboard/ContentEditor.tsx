import { useEffect, useState } from "react";
import {
  SectionConfig,
  ContentData,
  ContentEditorProps,
  NestedContentData,
  ContentDataValue,
} from "./types";
import styles from "./ContentEditor.module.css";
import { getImageDimensions } from "@/lib/imageDimensions";

export default function ContentEditor({
  sectionConfig,
  initialData,
  onSave,
}: ContentEditorProps) {
  const [formData, setFormData] = useState<ContentData>(initialData || {});
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
        setListItems(initialData.items as ContentData[]);
      } else {
        setListItems([]);
      }
    }

    // Hantera flera listor om listItemConfigs finns
    if (sectionConfig.listItemConfigs) {
      const lists: Record<string, ContentData[]> = {};
      Object.keys(sectionConfig.listItemConfigs).forEach((listKey) => {
        // Förvänta sig initialData[listKey] som array
        if (
          initialData &&
          initialData[listKey] &&
          Array.isArray(initialData[listKey])
        ) {
          lists[listKey] = initialData[listKey] as ContentData[];
        } else {
          lists[listKey] = [];
        }
      });
      setListItemsByKey(lists);
    }

    // Hantera vanliga fields om typen INTE är "list" eller om det finns fields
    if (sectionConfig.type !== "list" || sectionConfig.fields.length > 0) {
      if (initialData) {
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
            setFormData(localizedData[defaultLang] || {});
          } else {
            // Fallback: behandla som direkt data
            setFormData(initialData);
          }
        } else {
          setFormData(initialData);
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

  const handleImageUpload = async (fieldId: string, file: File) => {
    setUploadingImage(fieldId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      handleChange(fieldId, data.url);
      if (data.width && data.height) {
        const widthField = sectionConfig.fields.find((f) => f.id === "width");
        const heightField = sectionConfig.fields.find((f) => f.id === "height");
        if (widthField) handleChange("width", data.width);
        if (heightField) handleChange("height", data.height);
      }
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

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      updateListItem(itemIndex, fieldId, data.url);
      if (data.width && data.height && sectionConfig.listItemConfig) {
        const widthField = sectionConfig.listItemConfig.fields.find(
          (f) => f.id === "width"
        );
        const heightField = sectionConfig.listItemConfig.fields.find(
          (f) => f.id === "height"
        );
        if (widthField) updateListItem(itemIndex, "width", data.width);
        if (heightField) updateListItem(itemIndex, "height", data.height);
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

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      updateListItemInKey(listKey, itemIndex, fieldId, data.url);
      if (data.width && data.height) {
        const listConfig = sectionConfig.listItemConfigs?.[listKey];
        if (listConfig) {
          const widthField = listConfig.fields.find((f) => f.id === "width");
          const heightField = listConfig.fields.find((f) => f.id === "height");
          if (widthField)
            updateListItemInKey(listKey, itemIndex, "width", data.width);
          if (heightField)
            updateListItemInKey(listKey, itemIndex, "height", data.height);
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(null);
    }
  };

  // List-hantering funktioner (för en lista)
  const addListItem = () => {
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

    setListItems([...listItems, newItem]);
  };

  const removeListItem = (index: number) => {
    setListItems(listItems.filter((_, i) => i !== index));
  };

  const updateListItem = (
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const updatedItems = [...listItems];
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
    } else {
      // Uppdatera vanligt field
      updatedItems[index][fieldId] = value;
    }
    setListItems(updatedItems);
  };

  // List-hantering funktioner (för flera listor)
  const addListItemToKey = (listKey: string) => {
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

    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: [...(listItemsByKey[listKey] || []), newItem],
    });
  };

  const removeListItemFromKey = (listKey: string, index: number) => {
    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: (listItemsByKey[listKey] || []).filter((_, i) => i !== index),
    });
  };

  const updateListItemInKey = (
    listKey: string,
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const updatedItems = [...(listItemsByKey[listKey] || [])];
    if (nestedFieldId) {
      if (
        !updatedItems[index][fieldId] ||
        typeof updatedItems[index][fieldId] !== "object"
      ) {
        updatedItems[index][fieldId] = {};
      }
      (updatedItems[index][fieldId] as NestedContentData)[nestedFieldId] =
        value as string | number | boolean | null;
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
      let dataToSave: ContentData | Record<string, ContentData>;

      // Om det finns flera listor, spara dem
      if (sectionConfig.listItemConfigs) {
        // Kombinera fields (om de finns) med alla listor
        const listsData: ContentData = { ...listItemsByKey };
        if (sectionConfig.fields.length > 0) {
          dataToSave = {
            ...formData,
            ...listsData,
          } as ContentData;
        } else {
          dataToSave = listsData;
        }
      } else if (sectionConfig.listItemConfig) {
        // Om det finns en lista, spara den
        // Om det också finns fields, kombinera dem
        if (sectionConfig.type !== "list" && sectionConfig.fields.length > 0) {
          dataToSave = {
            ...formData,
            items: listItems,
          } as ContentData;
        } else {
          // Bara lista
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
          // Uppdatera befintlig språk-struktur
          dataToSave = {
            ...(existingData as unknown as Record<string, ContentData>),
            [activeLanguage!]: formData,
          };
        } else {
          // Skapa ny språk-struktur
          dataToSave = {
            [activeLanguage!]: formData,
          };
        }
      } else {
        // Ingen språk-struktur, spara direkt
        dataToSave = formData;
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
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                type="url"
                id={field.id}
                value={value as string}
                onChange={(e) => handleChange(field.id, e.target.value)}
                onBlur={async (e) => {
                  const url = e.target.value;
                  if (url) {
                    const dimensions = await getImageDimensions(url);
                    if (dimensions) {
                      handleChange(field.id, url);
                      // Uppdatera width/height om de finns
                      const widthField = sectionConfig.fields.find(
                        (f) => f.id === "width"
                      );
                      const heightField = sectionConfig.fields.find(
                        (f) => f.id === "height"
                      );
                      if (widthField) handleChange("width", dimensions.width);
                      if (heightField)
                        handleChange("height", dimensions.height);
                    }
                  }
                }}
                required={field.required}
                placeholder={
                  field.placeholder || "https://example.com/image.jpg"
                }
                className={styles.input}
                style={{ flex: 1 }}
              />
              <label
                htmlFor={`${field.id}-file`}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "0.375rem",
                  cursor:
                    uploadingImage === field.id ? "not-allowed" : "pointer",
                  opacity: uploadingImage === field.id ? 0.6 : 1,
                }}
              >
                {uploadingImage === field.id ? "Uploading..." : "Upload"}
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
            </div>
            {value && (
              <img
                src={value as string}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "0.5rem",
                  borderRadius: "0.375rem",
                }}
              />
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
    const value = item[field.id] || "";

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
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                type="url"
                value={value as string}
                onChange={(e) =>
                  updateListItem(itemIndex, field.id, e.target.value)
                }
                onBlur={async (e) => {
                  const url = e.target.value;
                  if (url) {
                    const dimensions = await getImageDimensions(url);
                    if (dimensions) {
                      handleChange(field.id, url);
                      // Uppdatera width/height om de finns
                      const widthField = sectionConfig.fields.find(
                        (f) => f.id === "width"
                      );
                      const heightField = sectionConfig.fields.find(
                        (f) => f.id === "height"
                      );
                      if (widthField) handleChange("width", dimensions.width);
                      if (heightField)
                        handleChange("height", dimensions.height);
                    }
                  }
                }}
                required={field.required}
                placeholder={
                  field.placeholder || "https://example.com/image.jpg"
                }
                className={styles.input}
                style={{ flex: 1 }}
              />
              <label
                htmlFor={`${uploadId}-file`}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "0.375rem",
                  cursor:
                    uploadingImage === uploadId ? "not-allowed" : "pointer",
                  opacity: uploadingImage === uploadId ? 0.6 : 1,
                }}
              >
                {uploadingImage === uploadId ? "Uploading..." : "Upload"}
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
            </div>
            {value && (
              <img
                src={value as string}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "0.5rem",
                  borderRadius: "0.375rem",
                }}
              />
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
    const value = item[field.id] || "";

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
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                type="url"
                value={value as string}
                onChange={(e) =>
                  updateListItemInKey(
                    listKey,
                    itemIndex,
                    field.id,
                    e.target.value
                  )
                }
                onBlur={async (e) => {
                  const url = e.target.value;
                  if (url) {
                    const dimensions = await getImageDimensions(url);
                    if (dimensions) {
                      handleChange(field.id, url);
                      // Uppdatera width/height om de finns
                      const widthField = sectionConfig.fields.find(
                        (f) => f.id === "width"
                      );
                      const heightField = sectionConfig.fields.find(
                        (f) => f.id === "height"
                      );
                      if (widthField) handleChange("width", dimensions.width);
                      if (heightField)
                        handleChange("height", dimensions.height);
                    }
                  }
                }}
                required={field.required}
                placeholder={
                  field.placeholder || "https://example.com/image.jpg"
                }
                className={styles.input}
                style={{ flex: 1 }}
              />
              <label
                htmlFor={`${uploadIdForKey}-file`}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  borderRadius: "0.375rem",
                  cursor:
                    uploadingImage === uploadIdForKey
                      ? "not-allowed"
                      : "pointer",
                  opacity: uploadingImage === uploadIdForKey ? 0.6 : 1,
                }}
              >
                {uploadingImage === uploadIdForKey ? "Uploading..." : "Upload"}
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
            </div>
            {value && (
              <img
                src={value as string}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "0.5rem",
                  borderRadius: "0.375rem",
                }}
              />
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
                    onClick={addListItem}
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
                            <button
                              type="button"
                              onClick={() => removeListItem(index)}
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
                        onClick={() => addListItemToKey(listKey)}
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
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeListItemFromKey(listKey, index)
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
