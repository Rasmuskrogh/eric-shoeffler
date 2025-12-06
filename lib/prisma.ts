import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only disable TLS certificate validation in development environment
// This is needed for some PostgreSQL providers with self-signed certificates
// Note: This will show a warning in the console, which is expected in development
if (
  process.env.NODE_ENV === "development" &&
  !process.env.NODE_TLS_REJECT_UNAUTHORIZED
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

let pool: Pool | undefined;
let adapter: PrismaPg | undefined;

if (process.env.DATABASE_URL) {
  try {
    console.log("[Prisma] Initializing database connection");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    adapter = new PrismaPg(pool);
    console.log("[Prisma] Database connection initialized successfully");
  } catch (error) {
    console.error("[Prisma] Failed to create database pool:", error);
    console.error("[Prisma] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
} else {
  console.error("[Prisma] DATABASE_URL is not set!");
}

// Create Prisma client with adapter if available
// In production, DATABASE_URL should always be set
const createPrismaClient = () => {
  if (!adapter) {
    throw new Error(
      "DATABASE_URL is not set. Please configure DATABASE_URL environment variable."
    );
  }
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
