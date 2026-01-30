import { getPasteById, isPasteAvailable } from "@/lib/paste-utils";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentTime } from "@/lib/time";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params
  const { id } = await params;

  // Get current time
  const headersList = await headers();
  const currentTime = getCurrentTime(headersList);

  // Fetch paste from database
  const paste = await getPasteById(id);

  // Check if paste exists and is available
  if (!paste || !isPasteAvailable(paste, currentTime)) {
    notFound();
  }

  const viewsRemaining =
    paste.max_views !== null ? paste.max_views - paste.current_views : null;
  const expiresAt = paste.expires_at
    ? new Date(paste.expires_at).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Paste</h1>
          <p className="text-sm text-muted-foreground">ID: {id}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground">
            {paste.content}
          </pre>
        </div>

        {(viewsRemaining !== null || expiresAt !== null) && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h2 className="text-sm font-semibold text-foreground mb-2">
              Paste Info
            </h2>
            {viewsRemaining !== null && (
              <p className="text-sm text-muted-foreground">
                Views remaining: {viewsRemaining}
              </p>
            )}
            {expiresAt && (
              <p className="text-sm text-muted-foreground">
                Expires at: {expiresAt}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <a href="/" className="text-sm text-primary hover:underline">
            ← Create a new paste
          </a>
        </div>
      </div>
    </div>
  );
}
