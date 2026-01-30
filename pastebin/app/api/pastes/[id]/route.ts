import {
  getPasteById,
  isPasteAvailable,
  incrementViewCount,
} from "@/lib/paste-utils";
import { getCurrentTime } from "@/lib/time";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentTime = getCurrentTime(request.headers);

    // Fetch paste from database
    const paste = await getPasteById(id);

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // Check if paste is available before incrementing view count
    if (!isPasteAvailable(paste, currentTime)) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // Increment view count
    await incrementViewCount(id);

    // Calculate remaining views
    let remainingViews = null;
    if (paste.max_views !== null) {
      remainingViews = paste.max_views - (paste.current_views + 1);
      // Ensure remaining_views doesn't go negative
      if (remainingViews < 0) {
        remainingViews = 0;
      }
    }

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: paste.expires_at
          ? new Date(paste.expires_at).toISOString()
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Error fetching paste:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
