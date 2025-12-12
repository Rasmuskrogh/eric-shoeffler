import { useCallback } from "react";
import { SectionConfig, ContentData, ContentDataValue, NestedContentData } from "../../types";

interface UseListManagementProps {
  sectionConfig: SectionConfig;
  listItems: ContentData[];
  setListItems: (items: ContentData[] | ((prev: ContentData[]) => ContentData[])) => void;
  activeLanguage: string | null;
  performAutoSave: (overrideListItems?: ContentData[], overrideListItemsByKey?: Record<string, ContentData[]>) => Promise<void>;
}

export function useListManagement({
  sectionConfig,
  listItems,
  setListItems,
  activeLanguage,
  performAutoSave,
}: UseListManagementProps) {
  const addListItem = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!sectionConfig.listItemConfig) return;

    const newItem: ContentData = {};
    sectionConfig.listItemConfig.fields.forEach((field) => {
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

    setListItems([newItem, ...listItems]);
  }, [sectionConfig.listItemConfig, listItems, setListItems]);

  const removeListItem = useCallback((index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const updatedItems = listItems.filter((_, i) => i !== index);
    setListItems(updatedItems);
    performAutoSave(updatedItems, undefined);
  }, [listItems, setListItems, performAutoSave]);

  const updateListItem = useCallback((
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => {
    const updatedItems = [...listItems];
    const listConfig = sectionConfig.listItemConfig;
    const localizedFields = new Set(listConfig?.localizedFields || []);
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
    setListItems(updatedItems);
  }, [listItems, setListItems, sectionConfig.listItemConfig, activeLanguage]);

  return {
    addListItem,
    removeListItem,
    updateListItem,
  };
}

