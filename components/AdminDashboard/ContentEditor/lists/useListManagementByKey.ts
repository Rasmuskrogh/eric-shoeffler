import { useCallback } from "react";
import { SectionConfig, ContentData, ContentDataValue, NestedContentData } from "../../types";

interface UseListManagementByKeyProps {
  sectionConfig: SectionConfig;
  listItemsByKey: Record<string, ContentData[]>;
  setListItemsByKey: (items: Record<string, ContentData[]> | ((prev: Record<string, ContentData[]>) => Record<string, ContentData[]>)) => void;
  activeLanguage: string | null;
  performAutoSave: (overrideListItems?: ContentData[], overrideListItemsByKey?: Record<string, ContentData[]>) => Promise<void>;
}

export function useListManagementByKey({
  sectionConfig,
  listItemsByKey,
  setListItemsByKey,
  activeLanguage,
  performAutoSave,
}: UseListManagementByKeyProps) {
  const addListItemToKey = useCallback((listKey: string, e?: React.MouseEvent) => {
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

    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: [newItem, ...(listItemsByKey[listKey] || [])],
    });
  }, [sectionConfig.listItemConfigs, listItemsByKey, setListItemsByKey]);

  const removeListItemFromKey = useCallback((
    listKey: string,
    index: number,
    e?: React.MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updatedItems = (listItemsByKey[listKey] || []).filter((_, i) => i !== index);
    setListItemsByKey({
      ...listItemsByKey,
      [listKey]: updatedItems,
    });
    performAutoSave(undefined, {
      ...listItemsByKey,
      [listKey]: updatedItems,
    });
  }, [listItemsByKey, setListItemsByKey, performAutoSave]);

  const updateListItemInKey = useCallback((
    listKey: string,
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const listConfig = sectionConfig.listItemConfigs?.[listKey];
    if (!listConfig) return;

    const updatedItems = [...(listItemsByKey[listKey] || [])];
    const localizedFields = new Set(listConfig.localizedFields || []);
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
  }, [sectionConfig.listItemConfigs, listItemsByKey, setListItemsByKey, activeLanguage]);

  return {
    addListItemToKey,
    removeListItemFromKey,
    updateListItemInKey,
  };
}

