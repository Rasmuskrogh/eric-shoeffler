import { AdminUser, Content } from "@/src/generated/prisma/client";

export type AdminUserType = AdminUser;
export type ContentType = Content;

export interface EditorField {
  id: string;
  label: string;
  type: "text" | "textarea" | "rich-text" | "image" | "number" | "date";
  required?: boolean;
  placeholder?: string;
  // För nested objects (t.ex. startDate: { day, month, year })
  nestedFields?: EditorField[];
}

export interface ListItemConfig {
  // Fält som definierar strukturen för varje objekt i listan
  fields: EditorField[];
}

export interface SectionConfig {
  id: string;
  name: string;
  type: "text" | "rich-text" | "image" | "mixed" | "list";
  languages?: string[];
  fields: EditorField[];
  // För list-typ: definiera strukturen för list-items (en lista)
  listItemConfig?: ListItemConfig;
  // För flera listor: objekt där nyckeln är namnet på listan
  listItemConfigs?: Record<string, ListItemConfig>;
}

// Typ för nested objects (t.ex. startDate: { day, month, year })
export type NestedContentData = Record<
  string,
  string | number | boolean | null
>;

// Typ för array av ContentData (för listor)
export type ContentDataArray = ContentData[];

// Typ för list items (objekt i en lista)
export type ListItem = ContentData;

// Rekursiv typ för att hantera nested objects och arrays
export type ContentDataValue =
  | string
  | number
  | boolean
  | null
  | NestedContentData
  | ContentDataArray;

export interface ContentData {
  [key: string]: ContentDataValue;
}

export interface ContentEditorProps {
  sectionConfig: SectionConfig;
  initialData?: ContentData;
  onSave: (data: ContentData) => Promise<void>;
}

export interface AdminDashboardProps {
  initialContent: Record<string, ContentData | null>;
}
