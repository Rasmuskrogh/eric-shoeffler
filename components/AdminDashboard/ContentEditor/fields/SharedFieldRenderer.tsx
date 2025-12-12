import React from "react";
import { EditorField } from "../../types";
import { useContentEditorContext } from "../context";
import styles from "../../ContentEditor.module.css";

interface SharedFieldRendererProps {
  field: EditorField;
}

export function SharedFieldRenderer({ field }: SharedFieldRendererProps) {
  const {
    sharedData,
    handleSharedChange,
    uploadingImage,
    handleImageUploadForShared,
  } = useContentEditorContext();

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
      const isUploading = uploadingImage === `shared-${field.id}`;
      return (
        <div>
          <label
            htmlFor={`shared-${field.id}-file`}
            className={`${styles.imageUploadLabel} ${
              isUploading ? styles.imageUploadLabelUploading : ""
            } ${value ? styles.imageUploadLabelWithImage : ""}`}
          >
            {isUploading
              ? "Uploading..."
              : value
              ? "Replace Image"
              : "Upload Image"}
          </label>
          <input
            type="file"
            id={`shared-${field.id}-file`}
            accept="image/*"
            className={styles.imageUploadInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUploadForShared(field.id, file);
              }
            }}
            disabled={isUploading}
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
      return null;
  }
}

