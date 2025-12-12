import type { SectionConfig, ContentDataValue, NestedContentData } from "../../types";

/**
 * Hook to handle image uploads for different contexts
 */
export function useImageUpload(
  sectionConfig: SectionConfig,
  setUploadingImage: (id: string | null) => void,
  handleChange: (
    fieldId: string,
    value: string | number | boolean | NestedContentData
  ) => void,
  updateListItem?: (
    index: number,
    fieldId: string,
    value: ContentDataValue
  ) => void,
  updateListItemInKey?: (
    listKey: string,
    index: number,
    fieldId: string,
    value: ContentDataValue
  ) => void,
  handleSharedChange?: (
    fieldId: string,
    value: string | number | boolean | NestedContentData
  ) => void
) {
  const uploadImage = async (
    file: File,
    folder: string,
    onSuccess: (url: string, width?: number, height?: number) => void
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/content/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      onSuccess(data.url, data.width, data.height);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      throw error;
    }
  };

  const handleImageUpload = async (fieldId: string, file: File) => {
    setUploadingImage(fieldId);

    try {
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";

      await uploadImage(file, folder, (url) => {
        handleChange(fieldId, url);
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageUploadForListItem = async (
    itemIndex: number,
    fieldId: string,
    file: File
  ) => {
    const uploadId = `list-item-${itemIndex}-${fieldId}`;
    setUploadingImage(uploadId);

    try {
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";

      await uploadImage(file, folder, (url, width, height) => {
        if (updateListItem) {
          updateListItem(itemIndex, fieldId, url);
          // Spara width/height automatiskt i bakgrunden
          if (width && height) {
            updateListItem(itemIndex, "width", width);
            updateListItem(itemIndex, "height", height);
          }
        }
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageUploadForListItemInKey = async (
    listKey: string,
    itemIndex: number,
    fieldId: string,
    file: File
  ) => {
    const uploadId = `list-item-${listKey}-${itemIndex}-${fieldId}`;
    setUploadingImage(uploadId);

    try {
      const folder =
        sectionConfig.id === "media" &&
        listKey === "gallery" &&
        fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";

      await uploadImage(file, folder, (url, width, height) => {
        if (updateListItemInKey) {
          updateListItemInKey(listKey, itemIndex, fieldId, url);
          // Spara width/height automatiskt i bakgrunden
          if (width && height) {
            updateListItemInKey(listKey, itemIndex, "width", width);
            updateListItemInKey(listKey, itemIndex, "height", height);
          }
        }
      });
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageUploadForShared = async (fieldId: string, file: File) => {
    setUploadingImage(`shared-${fieldId}`);

    try {
      const folder =
        sectionConfig.id === "media" && fieldId === "url"
          ? "eric-schoeffler/gallery"
          : "hero";

      await uploadImage(file, folder, (url) => {
        // Use handleSharedChange if provided, otherwise fall back to handleChange
        if (handleSharedChange) {
          handleSharedChange(fieldId, url);
        } else {
          handleChange(fieldId, url);
        }
      });
    } finally {
      setUploadingImage(null);
    }
  };

  return {
    handleImageUpload,
    handleImageUploadForListItem,
    handleImageUploadForListItemInKey,
    handleImageUploadForShared,
  };
}

