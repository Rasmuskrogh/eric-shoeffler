import { AdminUser, Content } from "@/src/generated/prisma/client";

export type AdminUserType = AdminUser;
export type ContentType = Content;

export interface SectionConfig {
  id: string;
  name: string;
  type: "text" | "rich-text" | "image" | "mixed";
  languages?: string[];
  fields: EditorField[];
}

export interface EditorField {
  id: string;
  label: string;
  type: "text" | "textarea" | "rich-text" | "image" | "number";
  required?: boolean;
  placeholder?: string;
}

export interface ContentData {
  [key: string]: string | number | boolean | null;
}

export interface ContentEditorProps {
  sectionConfig: SectionConfig;
  initialData?: ContentData;
  onSave: (data: ContentData) => Promise<void>;
}

export interface AdminDashboardProps {
  initialContent: Record<string, ContentData | null>;
}
