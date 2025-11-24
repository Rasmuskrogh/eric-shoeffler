import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/components/AdminDashboard/auth";
import AdminDashboard from "@/components/AdminDashboard/AdminDashboard";
import { dashboardConfig } from "@/components/AdminDashboard/config";
import { prisma } from "@/lib/prisma";
import type { ContentData } from "@/components/AdminDashboard/types";

export default async function AdminPage() {
  try {
    console.log("[AdminPage] Starting page render");
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("[AdminPage] No session, redirecting to login");
      redirect("/admin/login");
    }

    console.log("[AdminPage] Session found, fetching content");
    const sectionIds = dashboardConfig.map((section) => section.id);

    let existingContent: Awaited<ReturnType<typeof prisma.content.findMany>>;
    try {
      console.log("[AdminPage] Querying database for sections:", sectionIds);
      existingContent = await prisma.content.findMany({
        where: {
          sectionId: {
            in: sectionIds,
          },
        },
      });
      console.log("[AdminPage] Database query successful, found", existingContent.length, "items");
    } catch (dbError) {
      console.error("[AdminPage] Database error:", dbError);
      console.error("[AdminPage] Error details:", {
        message: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
      });
      // Return empty content map if database query fails
      existingContent = [];
    }

    const contentMap = sectionIds.reduce<Record<string, ContentData | null>>(
      (accumulator, sectionId) => {
        accumulator[sectionId] = null;
        return accumulator;
      },
      {}
    );

    existingContent.forEach((content) => {
      contentMap[content.sectionId] = (content.data ??
        null) as ContentData | null;
    });

    console.log("[AdminPage] Rendering AdminDashboard");
    return <AdminDashboard initialContent={contentMap} />;
  } catch (error) {
    console.error("[AdminPage] Fatal error:", error);
    console.error("[AdminPage] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    // Re-throw to trigger error boundary
    throw error;
  }
}
