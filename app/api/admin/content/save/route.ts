import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/AdminDashboard/auth";
import { prisma } from "@/lib/prisma";
import { dashboardConfig } from "@/components/AdminDashboard/config";
import type { ContentData } from "@/components/AdminDashboard/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sectionId, data } = body;

    if (!sectionId || !data) {
      return NextResponse.json(
        { error: "Missing sectionId or data" },
        { status: 400 }
      );
    }

    // Validate sectionId exists in config
    const sectionConfig = dashboardConfig.find(
      (section) => section.id === sectionId
    );

    if (!sectionConfig) {
      return NextResponse.json(
        { error: `Section ${sectionId} not found in config` },
        { status: 400 }
      );
    }

    // Validate that data matches config fields
    // Om sektionen har språk, kan data vara Record<string, ContentData>
    // Annars är det direkt ContentData
    const configFieldIds = sectionConfig.fields.map((field) => field.id);

    // Kolla om data är språk-struktur (Record<string, ContentData>)
    const isLocalized =
      sectionConfig.languages &&
      sectionConfig.languages.length > 0 &&
      typeof data === "object" &&
      data !== null &&
      !Array.isArray(data) &&
      sectionConfig.languages.some((lang) => lang in data);

    if (isLocalized) {
      // Validera varje språk-data
      const localizedData = data as Record<string, ContentData>;
      for (const [lang, langData] of Object.entries(localizedData)) {
        if (!sectionConfig.languages!.includes(lang)) {
          return NextResponse.json(
            {
              error: `Invalid language: ${lang}. Allowed languages: ${sectionConfig.languages!.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }

        const langDataKeys = Object.keys(langData);
        const missingRequiredFields = sectionConfig.fields
          .filter((field) => field.required)
          .filter((field) => !langDataKeys.includes(field.id));

        if (missingRequiredFields.length > 0) {
          return NextResponse.json(
            {
              error: `Missing required fields for ${lang}: ${missingRequiredFields
                .map((f) => f.id)
                .join(", ")}`,
            },
            { status: 400 }
          );
        }

        const invalidFields = langDataKeys.filter(
          (key) => !configFieldIds.includes(key)
        );

        if (invalidFields.length > 0) {
          return NextResponse.json(
            {
              error: `Invalid fields for ${lang}: ${invalidFields.join(
                ", "
              )}. Allowed fields: ${configFieldIds.join(", ")}`,
            },
            { status: 400 }
          );
        }
      }
    } else {
      // Direkt data-validering
      const dataKeys = Object.keys(data);

      // Check if all required fields are present
      const missingRequiredFields = sectionConfig.fields
        .filter((field) => field.required)
        .filter((field) => !dataKeys.includes(field.id));

      if (missingRequiredFields.length > 0) {
        return NextResponse.json(
          {
            error: `Missing required fields: ${missingRequiredFields
              .map((f) => f.id)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }

      // Check if data contains fields not in config
      const invalidFields = dataKeys.filter(
        (key) => !configFieldIds.includes(key)
      );

      if (invalidFields.length > 0) {
        return NextResponse.json(
          {
            error: `Invalid fields: ${invalidFields.join(
              ", "
            )}. Allowed fields: ${configFieldIds.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    const content = await prisma.content.upsert({
      where: { sectionId },
      update: { data: data, updatedAt: new Date() },
      create: { sectionId: sectionId, data: data },
    });

    return NextResponse.json({ success: true, content }, { status: 200 });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
