import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connectivity
    await sql`SELECT 1`;
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[v0] Health check failed:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
