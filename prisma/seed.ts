import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "password";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existingAdmin) {
    console.log(`Admin user "${username}" already exists`);
    return;
  }

  await prisma.adminUser.create({
    data: {
      username,
      password: hashedPassword,
    },
  });

  console.log(`Admin user "${username}" created successfully`);
  console.log(`Login with  username: ${username}`);
  console.log(`Password: ${password}`);
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
