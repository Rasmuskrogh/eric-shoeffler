import React from "react";
import { useContentEditorContext } from "../context";
import { ListItemCard } from "./ListItemCard";
import styles from "../../ContentEditor.module.css";

interface ListSectionProps {
  listKey?: string; // Om undefined, används en lista, annars flera listor
  showDivider?: boolean;
}

export function ListSection({ listKey, showDivider = false }: ListSectionProps) {
  const {
    sectionConfig,
    listItems,
    listItemsByKey,
    addListItem,
    addListItemToKey,
  } = useContentEditorContext();

  const items = listKey ? listItemsByKey[listKey] || [] : listItems;
  const listConfig = listKey
    ? sectionConfig.listItemConfigs?.[listKey]
    : sectionConfig.listItemConfig;

  if (!listConfig) {
    return null;
  }

  const listName = listKey
    ? listKey.charAt(0).toUpperCase() +
      listKey.slice(1).replace(/([A-Z])/g, " $1")
    : "List Items";

  const handleAddItem = (e?: React.MouseEvent) => {
    if (listKey) {
      addListItemToKey(listKey, e);
    } else {
      addListItem(e);
    }
  };

  return (
    <>
      {showDivider && (
        <div className={styles.listSectionDivider}>
          <hr />
        </div>
      )}

      <div>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>
            {listName} ({items.length})
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className={styles.addItemButton}
          >
            + Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <p className={styles.emptyListMessage}>
            No items in {listName.toLowerCase()}. Click &quot;Add Item&quot; to
            add your first item.
          </p>
        ) : (
          <div className={styles.listItemsContainer}>
            {items.map((item, index) => (
              <ListItemCard
                key={
                  typeof item.id === "string" || typeof item.id === "number"
                    ? String(item.id)
                    : index
                }
                item={item}
                index={index}
                listKey={listKey}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

