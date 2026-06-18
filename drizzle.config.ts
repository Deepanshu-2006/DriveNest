import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});
