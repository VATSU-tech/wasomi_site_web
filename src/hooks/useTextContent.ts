/**
 * Hook for loading raw text content
 */

import { useEffect, useState } from "react";

export function useTextContent(textPath: string) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(textPath);
        if (!response.ok) throw new Error("Failed to fetch text content");

        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setContent("");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [textPath]);

  return { content, loading, error };
}
