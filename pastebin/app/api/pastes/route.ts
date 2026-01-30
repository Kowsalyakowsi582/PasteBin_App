import { sql } from "@/lib/db";
import { generatePasteId } from "@/lib/paste-utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate content
    if (
      !body.content ||
      typeof body.content !== "string" ||
      body.content.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate ttl_seconds
    if (body.ttl_seconds !== undefined) {
      if (!Number.isInteger(body.ttl_seconds) || body.ttl_seconds < 1) {
        return NextResponse.json(
          { error: "ttl_seconds must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

    // Validate max_views
    if (body.max_views !== undefined) {
      if (!Number.isInteger(body.max_views) || body.max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

    // Generate unique ID
    const id = generatePasteId();

    // Calculate expires_at if ttl_seconds is provided
    let expiresAt = null;
    if (body.ttl_seconds) {
      const now = new Date();
      expiresAt = new Date(now.getTime() + body.ttl_seconds * 1000);
    }

    // Insert paste into database
    await sql`
      INSERT INTO pastes (id, content, expires_at, max_views)
      VALUES (${id}, ${body.content}, ${expiresAt}, ${body.max_views ?? null})
    `;

    // Build the URL
    const baseUrl = request.nextUrl.origin;
    const url = `${baseUrl}/p/${id}`;

    return NextResponse.json({ id, url }, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
