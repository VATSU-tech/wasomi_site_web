/**
 * Hook for loading and parsing VTT subtitle data
 */

import { useEffect, useState } from "react";
import { parseVTT, VTTData } from "@/lib/vtt-parser";

export function useVTTData(vttFilePath: string) {
  const [data, setData] = useState<VTTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndParse = async () => {
      try {
        setLoading(true);
        const response = await fetch(vttFilePath);
        if (!response.ok) throw new Error("Failed to fetch VTT file");

        const content = await response.text();
        const parsed = parseVTT(content);
        setData(parsed);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParse();
  }, [vttFilePath]);

  return { data, loading, error };
}
