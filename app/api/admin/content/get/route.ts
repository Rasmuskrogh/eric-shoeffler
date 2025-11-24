import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/AdminDashboard/auth";
import { prisma } from "@/lib/prisma";
import { dashboardConfig } from "@/components/AdminDashboard/config";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      // Get all content, but only for sections in config
      const configSectionIds = dashboardConfig.map((section) => section.id);
      const allContent = await prisma.content.findMany({
        where: {
          sectionId: {
            in: configSectionIds,
          },
        },
      });
      return NextResponse.json(
        { success: true, content: allContent },
        { status: 200 }
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

    const content = await prisma.content.findUnique({
      where: { sectionId },
    });

    if (!content) {
      return NextResponse.json(
        { success: true, content: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true, content }, { status: 200 });
  } catch (error) {
    console.error("Error getting content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
