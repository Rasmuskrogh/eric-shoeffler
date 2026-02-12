// Set TLS rejection before any imports to avoid warnings
// This is needed for PostgreSQL providers with self-signed certificates
if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaPool: Pool | undefined;
  prismaAdapter: PrismaPg | undefined;
};

let pool: Pool | undefined = globalForPrisma.prismaPool;
let adapter: PrismaPg | undefined = globalForPrisma.prismaAdapter;

if (process.env.DATABASE_URL) {
  if (!pool) {
    try {
      console.log("[Prisma] Initializing database connection");
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        // Keep connections alive so the server doesn’t close them
        keepAlive: true,
        // Release idle connections after 30s so new requests get fresh connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      adapter = new PrismaPg(pool);
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prismaPool = pool;
        globalForPrisma.prismaAdapter = adapter;
      }
      console.log("[Prisma] Database connection initialized successfully");
    } catch (error) {
      console.error("[Prisma] Failed to create database pool:", error);
      console.error("[Prisma] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  } else {
    adapter = globalForPrisma.prismaAdapter;
  }
} else {
  console.error("[Prisma] DATABASE_URL is not set!");
}

// Create Prisma client with adapter if available
// In production, DATABASE_URL should always be set
const createPrismaClient = () => {
  if (!adapter) {
    throw new Error("DATABASE_URL is not set. Please configure DATABASE_URL environment variable.");
  }
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
