import { neon } from "@neondatabase/serverless";

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL!);

export interface Paste {
  id: string;
  content: string;
  created_at: Date;
  expires_at: Date | null;
  max_views: number | null;
  current_views: number;
  is_deleted: boolean;
}
