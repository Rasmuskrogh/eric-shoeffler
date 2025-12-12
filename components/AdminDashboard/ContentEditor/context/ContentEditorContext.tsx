import React, { createContext, useContext, ReactNode } from "react";
import {
  SectionConfig,
  ContentData,
  ContentDataValue,
} from "../../types";

interface ContentEditorContextValue {
  // State
  formData: ContentData;
  setFormData: (data: ContentData | ((prev: ContentData) => ContentData)) => void;
  sharedData: ContentData;
  setSharedData: (data: ContentData | ((prev: ContentData) => ContentData)) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  saveStatus: "idle" | "success" | "error";
  setSaveStatus: (status: "idle" | "success" | "error") => void;
  uploadingImage: string | null;
  setUploadingImage: (id: string | null) => void;
  activeLanguage: string | null;
  setActiveLanguage: (lang: string | null) => void;
  listItems: ContentData[];
  setListItems: (items: ContentData[] | ((prev: ContentData[]) => ContentData[])) => void;
  listItemsByKey: Record<string, ContentData[]>;
  setListItemsByKey: (
    items: Record<string, ContentData[]> | ((prev: Record<string, ContentData[]>) => Record<string, ContentData[]>)
  ) => void;

  // Config
  sectionConfig: SectionConfig;
  initialData: ContentData | undefined;

  // Handlers
  handleChange: (fieldId: string, value: ContentDataValue) => void;
  handleSharedChange: (fieldId: string, value: ContentDataValue) => void;
  handleLanguageChange: (lang: string) => void;
  handleImageUpload: (fieldId: string, file: File) => void;
  handleImageUploadForListItem: (itemIndex: number, fieldId: string, file: File) => void;
  handleImageUploadForListItemInKey: (
    listKey: string,
    itemIndex: number,
    fieldId: string,
    file: File
  ) => void;
  handleImageUploadForShared: (fieldId: string, file: File) => void;
  updateListItem: (
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => void;
  updateListItemInKey: (
    listKey: string,
    index: number,
    fieldId: string,
    value: ContentDataValue,
    nestedFieldId?: string
  ) => void;
  addListItem: (e?: React.MouseEvent) => void;
  removeListItem: (index: number, e?: React.MouseEvent) => void;
  addListItemToKey: (listKey: string, e?: React.MouseEvent) => void;
  removeListItemFromKey: (listKey: string, index: number, e?: React.MouseEvent) => void;
  saveSingleListItem: (itemIndex: number) => Promise<void>;
  saveSingleListItemInKey: (listKey: string, itemIndex: number) => Promise<void>;
  performAutoSave: (
    overrideListItems?: ContentData[],
    overrideListItemsByKey?: Record<string, ContentData[]>
  ) => Promise<void>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ContentEditorContext = createContext<ContentEditorContextValue | undefined>(undefined);

export function useContentEditorContext() {
  const context = useContext(ContentEditorContext);
  if (!context) {
    throw new Error("useContentEditorContext must be used within ContentEditorProvider");
  }
  return context;
}

interface ContentEditorProviderProps {
  value: ContentEditorContextValue;
  children: ReactNode;
}

export function ContentEditorProvider({
  value,
  children,
}: ContentEditorProviderProps) {
  return (
    <ContentEditorContext.Provider value={value}>
      {children}
    </ContentEditorContext.Provider>
  );
}

