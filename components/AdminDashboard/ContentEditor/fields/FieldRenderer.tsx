import React from "react";
import { EditorField, ContentDataValue, NestedContentData } from "../../types";
import { useContentEditorContext } from "../context";
import styles from "../../ContentEditor.module.css";

interface FieldRendererProps {
  field: EditorField;
  value: ContentDataValue;
  onChange: (value: ContentDataValue) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const { uploadingImage, handleImageUpload } = useContentEditorContext();

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          id={field.id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(e.target.value)}
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
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
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
                  const newDateValue = {
                    ...dateValue,
                    [nestedField.id]:
                      nestedField.id === "year"
                        ? parseInt(e.target.value) || 0
                        : e.target.value,
                  };
                  onChange(newDateValue);
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
          id={field.id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );

    case "image":
      const isUploadingField = uploadingImage === field.id;
      return (
        <div>
          <label
            htmlFor={`${field.id}-file`}
            className={`${styles.imageUploadLabel} ${
              isUploadingField ? styles.imageUploadLabelUploading : ""
            } ${value ? styles.imageUploadLabelWithImage : ""}`}
          >
            {isUploadingField
              ? "Uploading..."
              : value
              ? "Replace Image"
              : "Upload Image"}
          </label>
          <input
            type="file"
            id={`${field.id}-file`}
            accept="image/*"
            className={styles.imageUploadInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(field.id, file);
              }
            }}
            disabled={isUploadingField}
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
          id={field.id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
          className={styles.input}
        />
      );
  }
}
