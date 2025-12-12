import React from "react";
import { useContentEditorContext } from "../context";
import styles from "../../ContentEditor.module.css";

export function FormActions() {
  const { saveStatus } = useContentEditorContext();

  return (
    <>
      {saveStatus === "success" && (
        <div className={styles.successMessage}>
          ✓ Changes saved successfully
        </div>
      )}
      {saveStatus === "error" && (
        <div className={styles.errorMessage}>
          ✗ Error saving changes. Please try again.
        </div>
      )}
    </>
  );
}

