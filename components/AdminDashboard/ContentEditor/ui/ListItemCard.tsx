import React from "react";
import { ContentData } from "../../types";
import { useContentEditorContext } from "../context";
import { ListItemFieldRenderer } from "../fields";
import styles from "../../ContentEditor.module.css";

interface ListItemCardProps {
  item: ContentData;
  index: number;
  listKey?: string; // Om undefined, används en lista, annars flera listor
}

export function ListItemCard({ item, index, listKey }: ListItemCardProps) {
  const {
    sectionConfig,
    isSaving,
    saveSingleListItem,
    saveSingleListItemInKey,
    removeListItem,
    removeListItemFromKey,
  } = useContentEditorContext();

  const listConfig = listKey
    ? sectionConfig.listItemConfigs?.[listKey]
    : sectionConfig.listItemConfig;

  if (!listConfig) {
    return null;
  }

  const handleSave = async () => {
    if (listKey) {
      await saveSingleListItemInKey(listKey, index);
    } else {
      await saveSingleListItem(index);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    if (listKey) {
      removeListItemFromKey(listKey, index, e);
    } else {
      removeListItem(index, e);
    }
  };

  return (
    <div className={styles.listItemCard}>
      <div className={styles.listItemHeader}>
        <h4 className={styles.listItemTitle}>Item #{index + 1}</h4>
        <div className={styles.listItemActions}>
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              await handleSave();
            }}
            disabled={isSaving}
            className={styles.saveItemButton}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleRemove}
            className={styles.removeItemButton}
          >
            Remove
          </button>
        </div>
      </div>

      <div className={styles.listItemFields}>
        {listConfig.fields
          .filter((field) => field.id !== "id")
          .map((field) => (
            <div key={field.id} className={styles.fieldGroup}>
              <label className={styles.label}>
                {field.label}{" "}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              <ListItemFieldRenderer
                field={field}
                item={item}
                itemIndex={index}
                listKey={listKey}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

