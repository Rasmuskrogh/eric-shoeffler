import React from "react";
import { useContentEditorContext } from "../context";
import { FieldRenderer } from "../fields";
import styles from "../../ContentEditor.module.css";

export function FieldsSection() {
  const { sectionConfig, formData, handleChange } = useContentEditorContext();

  if (sectionConfig.fields.length === 0 || sectionConfig.type === "list") {
    return null;
  }

  return (
    <>
      {sectionConfig.fields.map((field) => (
        <div key={field.id} className={styles.fieldGroup}>
          <label htmlFor={field.id} className={styles.label}>
            {field.label}{" "}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <FieldRenderer
            field={field}
            value={formData[field.id] || ""}
            onChange={(value) => handleChange(field.id, value)}
          />
        </div>
      ))}
    </>
  );
}

