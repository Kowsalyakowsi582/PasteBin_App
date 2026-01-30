import { sql, type Paste } from "./db";

export function generatePasteId(): string {
  // Generate a random 8-character alphanumeric ID
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export function isPasteAvailable(paste: Paste, currentTime: Date): boolean {
  // Check if paste is deleted
  if (paste.is_deleted) {
    return false;
  }

  // Check if paste has exceeded view limit
  if (paste.max_views !== null && paste.current_views >= paste.max_views) {
    return false;
  }

  // Check if paste has expired
  if (paste.expires_at !== null && currentTime >= new Date(paste.expires_at)) {
    return false;
  }

  return true;
}

export async function incrementViewCount(pasteId: string): Promise<void> {
  await sql`
    UPDATE pastes 
    SET current_views = current_views + 1 
    WHERE id = ${pasteId}
  `;
}

export async function getPasteById(pasteId: string): Promise<Paste | null> {
  const result = await sql`
    SELECT * FROM pastes WHERE id = ${pasteId}
  `;

  if (result.length === 0) {
    return null;
  }

  return result[0] as Paste;
}
