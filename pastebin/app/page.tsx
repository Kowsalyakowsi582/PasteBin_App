"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttlSeconds, setTtlSeconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPasteUrl("");

    try {
      const body: any = { content };

      if (ttlSeconds) {
        const ttl = Number.parseInt(ttlSeconds, 10);
        if (isNaN(ttl) || ttl < 1) {
          setError("TTL must be a positive integer");
          setLoading(false);
          return;
        }
        body.ttl_seconds = ttl;
      }

      if (maxViews) {
        const views = Number.parseInt(maxViews, 10);
        if (isNaN(views) || views < 1) {
          setError("Max views must be a positive integer");
          setLoading(false);
          return;
        }
        body.max_views = views;
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create paste");
        setLoading(false);
        return;
      }

      setPasteUrl(data.url);
      setContent("");
      setTtlSeconds("");
      setMaxViews("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pasteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Pastebin Lite
          </h1>
          <p className="text-muted-foreground">
            Share text quickly with optional expiry and view limits
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Paste</CardTitle>
            <CardDescription>
              Enter your text below and optionally set expiry constraints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your text here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={10}
                  className="font-mono mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ttl">Time to Live (seconds)</Label>
                  <Input
                    id="ttl"
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={ttlSeconds}
                    onChange={(e) => setTtlSeconds(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="maxViews">Max Views</Label>
                  <Input
                    id="maxViews"
                    type="number"
                    min="1"
                    placeholder="Optional"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {pasteUrl && (
                <Alert>
                  <AlertDescription className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">
                        Paste created successfully!
                      </p>
                      <a
                        href={pasteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {pasteUrl}
                      </a>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="shrink-0 bg-transparent"
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Paste"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
