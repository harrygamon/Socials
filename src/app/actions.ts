"use server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function getData() {
  try {
    const data = await sql`SELECT * FROM users`;
    return data;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  }
} 