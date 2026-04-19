"use client";

import { useCallback, useMemo, useState, useRef } from "react";
import DashboardLayout from "./DasboardLayout";
import ContentEditor from "./ContentEditor";
import { dashboardConfig } from "./config";
import type { ContentData, AdminDashboardProps } from "./types";

/** Schedule items must have a complete startDate or the public page can crash. */
function getScheduleSaveValidationError(data: ContentData): string | null {
  const record = data as Record<string, unknown>;
  const items = record.items;
  if (!Array.isArray(items) || items.length === 0) return null;

  const hasCompleteStartDate = (item: Record<string, unknown>): boolean => {
    const sd = item.startDate;
    if (!sd || typeof sd !== "object" || Array.isArray(sd)) return false;
    const start = sd as Record<string, unknown>;
    const year = start.year;
    const month = start.month;
    const day = start.day;
    if (year === undefined || year === null || String(year).trim() === "")
      return false;
    if (Number.isNaN(Number(year))) return false;
    if (month === undefined || month === null || String(month).trim() === "")
      return false;
    if (day === undefined || day === null || String(day).trim() === "")
      return false;
    if (Number.isNaN(Number(day))) return false;
    return true;
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    if (!hasCompleteStartDate(item as Record<string, unknown>)) {
      return `Evenemang ${i + 1}: Det går inte att spara utan fullständigt startdatum (år, månad och dag).`;
    }
  }
  return null;
}

export default function AdminDashboard({
  initialContent,
}: AdminDashboardProps) {
  const defaultSectionId = dashboardConfig[0]?.id || "";

  const [activeSectionId, setActiveSectionId] =
    useState<string>(defaultSectionId);
  const [contentBySection, setContentBySection] =
    useState<Record<string, ContentData | null>>(initialContent);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingSections, setLoadingSections] = useState<Set<string>>(
    new Set()
  );
  const activeSectionIdRef = useRef<string>(defaultSectionId);
  const contentBySectionRef =
    useRef<Record<string, ContentData | null>>(initialContent);

  // Keep refs in sync with state
  activeSectionIdRef.current = activeSectionId;
  contentBySectionRef.current = contentBySection;

  const activeSectionConfig = useMemo(
    () => dashboardConfig.find((section) => section.id === activeSectionId),
    [activeSectionId]
  );

  const loadSectionContent = useCallback(async (sectionId: string) => {
    // Check if already loaded using ref
    if (contentBySectionRef.current[sectionId] !== undefined) {
      return; // Already loaded, skip
    }

    // Check if already loading and add to loading set atomically
    let shouldLoad = false;
    setLoadingSections((prev) => {
      if (prev.has(sectionId)) {
        return prev; // Already loading, skip
      }
      shouldLoad = true;
      return new Set(prev).add(sectionId);
    });

    if (!shouldLoad) {
      return; // Already loading, skip
    }

    // Only clear error if this is the active section
    if (sectionId === activeSectionIdRef.current) {
      setErrorMessage(null);
    }

    try {
      const response = await fetch(
        `/api/admin/content/get?sectionId=${sectionId}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to load content");
      }

      const json = await response.json();

      // Always update the data (even if section changed, data is still valid)
      setContentBySection((previous) => {
        // Don't overwrite if already set (though this shouldn't happen)
        if (previous[sectionId] !== undefined) {
          return previous;
        }
        return {
          ...previous,
          [sectionId]: (json.content?.data ?? null) as ContentData | null,
        };
      });

      // Only clear error if this is still the active section when response arrives
      if (sectionId === activeSectionIdRef.current) {
        setErrorMessage(null);
      }
    } catch (error) {
      // Only show error if this is still the active section
      if (sectionId === activeSectionIdRef.current) {
        const message =
          error instanceof Error ? error.message : "Failed to load content";
        setErrorMessage(message);
      }
    } finally {
      // Remove from loading set
      setLoadingSections((prev) => {
        const next = new Set(prev);
        next.delete(sectionId);
        return next;
      });
    }
  }, []);

  const handleSectionChange = useCallback(
    async (sectionId: string) => {
      setActiveSectionId(sectionId);
      setErrorMessage(null);

      // Check if content needs to be loaded using ref
      // loadSectionContent will handle checking if already loading
      if (contentBySectionRef.current[sectionId] === undefined) {
        await loadSectionContent(sectionId);
      }
    },
    [loadSectionContent]
  );

  const handleSave = useCallback(
    async (sectionId: string, data: ContentData) => {
      try {
        if (sectionId === "schedule") {
          const validationError = getScheduleSaveValidationError(data);
          if (validationError) {
            setErrorMessage(validationError);
            throw new Error(validationError);
          }
        }

        // Debug: Logga vad som skickas till API:et
        const itemsValue = "items" in data ? (data as { items?: unknown }).items : undefined;
        console.log("[handleSave] Sending to API:", {
          sectionId,
          hasItems: "items" in data,
          itemsCount: Array.isArray(itemsValue) 
            ? itemsValue.length 
            : "not an array",
          topLevelKeys: Object.keys(data),
          dataPreview: JSON.stringify(data, null, 2).substring(0, 1000), // First 1000 chars
        });

        const response = await fetch("/api/admin/content/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sectionId, data }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error ?? "Failed to save content");
        }

        const json = await response.json();

        setContentBySection((previous) => ({
          ...previous,
          [sectionId]: (json.content?.data ?? data) as ContentData | null,
        }));
        setErrorMessage(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to save content";
        setErrorMessage(message);
        throw error;
      }
    },
    []
  );

  if (!activeSectionConfig) {
    return (
      <DashboardLayout>
        <p>No sections are configured for the dashboard</p>
      </DashboardLayout>
    );
  }

  const activeSectionData = contentBySection[activeSectionId] ?? null;
  const isActiveSectionLoading = loadingSections.has(activeSectionId);

  return (
    <DashboardLayout
      currentSection={activeSectionId}
      onSectionChange={handleSectionChange}
    >
      {errorMessage && (
        <div role="alert" style={{ marginBottom: "1rem", color: "#c53030" }}>
          {errorMessage}
        </div>
      )}

      {isActiveSectionLoading ? (
        <p>Loading section content...</p>
      ) : (
        <ContentEditor
          key={activeSectionId}
          sectionConfig={activeSectionConfig}
          initialData={activeSectionData ?? undefined}
          onSave={(data) => handleSave(activeSectionId, data)}
        />
      )}
    </DashboardLayout>
  );
}
