import React from "react";
import { EditorField, ContentData, ContentDataValue, NestedContentData } from "../../types";
import { useContentEditorContext } from "../context";
import styles from "../../ContentEditor.module.css";

interface ListItemFieldRendererProps {
  field: EditorField;
  item: ContentData;
  itemIndex: number;
  listKey?: string; // Om undefined, används en lista, annars flera listor
}

export function ListItemFieldRenderer({
  field,
  item,
  itemIndex,
  listKey,
}: ListItemFieldRendererProps) {
  const {
    sectionConfig,
    activeLanguage,
    updateListItem,
    updateListItemInKey,
    uploadingImage,
    handleImageUploadForListItem,
    handleImageUploadForListItemInKey,
  } = useContentEditorContext();

  const listConfig = listKey
    ? sectionConfig.listItemConfigs?.[listKey]
    : sectionConfig.listItemConfig;
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

  const handleChange = (newValue: ContentDataValue) => {
    if (listKey) {
      updateListItemInKey(listKey, itemIndex, field.id, newValue);
    } else {
      updateListItem(itemIndex, field.id, newValue);
    }
  };

  const handleNestedChange = (nestedFieldId: string, nestedValue: string | number) => {
    if (listKey) {
      updateListItemInKey(listKey, itemIndex, field.id, nestedValue, nestedFieldId);
    } else {
      updateListItem(itemIndex, field.id, nestedValue, nestedFieldId);
    }
  };

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );

    case "textarea":
      return (
        <textarea
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
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
          onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );

    case "date":
      if (field.nestedFields) {
        const dateValue = (value as NestedContentData) || {};
        return (
          <div className={styles.dateFieldContainer}>
            {field.nestedFields.map((nestedField) => (
              <input
                key={nestedField.id}
                type={nestedField.id === "year" ? "number" : "text"}
                value={String(dateValue[nestedField.id] ?? "")}
                onChange={(e) => {
                  const nestedValue =
                    nestedField.id === "year"
                      ? parseInt(e.target.value) || 0
                      : e.target.value;
                  handleNestedChange(nestedField.id, nestedValue);
                }}
                placeholder={nestedField.placeholder || nestedField.label}
                className={`${styles.input} ${styles.dateFieldInput}`}
              />
            ))}
          </div>
        );
      }
      return (
        <input
          type="date"
          value={value as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );

    case "image":
      const uploadId = listKey
        ? `list-item-${listKey}-${itemIndex}-${field.id}`
        : `list-item-${itemIndex}-${field.id}`;
      const isUploadingListItem = uploadingImage === uploadId;
      return (
        <div>
          <label
            htmlFor={`${uploadId}-file`}
            className={`${styles.imageUploadLabel} ${
              isUploadingListItem ? styles.imageUploadLabelUploading : ""
            } ${value ? styles.imageUploadLabelWithImage : ""}`}
          >
            {isUploadingListItem
              ? "Uploading..."
              : value
              ? "Replace Image"
              : "Upload Image"}
          </label>
          <input
            type="file"
            id={`${uploadId}-file`}
            accept="image/*"
            className={styles.imageUploadInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (listKey) {
                  handleImageUploadForListItemInKey(listKey, itemIndex, field.id, file);
                } else {
                  handleImageUploadForListItem(itemIndex, field.id, file);
                }
              }
            }}
            disabled={isUploadingListItem}
          />
          {value && (
            <div className={styles.imagePreviewContainer}>
              <img
                src={value as string}
                alt="Preview"
                className={styles.imagePreview}
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
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );
  }
}

