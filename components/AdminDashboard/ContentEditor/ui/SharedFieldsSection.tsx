import React from "react";
import { useContentEditorContext } from "../context";
import { SharedFieldRenderer } from "../fields";
import styles from "../../ContentEditor.module.css";

export function SharedFieldsSection() {
  const { sectionConfig } = useContentEditorContext();

  if (!sectionConfig.sharedFields || sectionConfig.sharedFields.length === 0) {
    return null;
  }

  return (
    <div className={styles.sharedFieldsSection}>
      <h3 className={styles.sharedFieldsTitle}>
        Shared Fields (applies to all languages)
      </h3>
      {sectionConfig.sharedFields.map((field) => (
        <div key={field.id} className={styles.fieldGroup}>
          <label htmlFor={`shared-${field.id}`} className={styles.label}>
            {field.label}{" "}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <SharedFieldRenderer field={field} />
        </div>
      ))}
      <div className={styles.sharedFieldsDivider}>
        <hr />
      </div>
    </div>
  );
}

