/**
 * VTT Parser - Parse WebVTT subtitle files
 * Extracts timing and text cues for audio synchronization
 */

export interface VTTCue {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
}

export interface VTTData {
  cues: VTTCue[];
  totalDurationMs: number;
}

/**
 * Convert VTT time format (HH:MM:SS.mmm) to milliseconds
 */
function timeToMs(time: string): number {
  const parts = time.split(":");
  const seconds = parts[parts.length - 1];
  const minutes = parts[parts.length - 2] || "0";
  const hours = parts[parts.length - 3] || "0";

  return (
    parseInt(hours) * 3600000 +
    parseInt(minutes) * 60000 +
    parseFloat(seconds) * 1000
  );
}

/**
 * Parse VTT content and extract cues
 */
export function parseVTT(content: string): VTTData {
  const lines = content.split("\n").map((line) => line.trim());
  const cues: VTTCue[] = [];
  let maxEndTime = 0;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip header and empty lines
    if (line === "WEBVTT" || line === "" || line.startsWith("NOTE")) {
      i++;
      continue;
    }

    // Look for timestamp line (HH:MM:SS.mmm --> HH:MM:SS.mmm)
    if (line.includes("-->")) {
      const [startStr, endStr] = line.split("-->").map((s) => s.trim());
      const startMs = timeToMs(startStr);
      const endMs = timeToMs(endStr);

      // Get the text (could be multiple lines)
      const textLines: string[] = [];
      i++;
      while (i < lines.length && lines[i] !== "" && !lines[i].includes("-->")) {
        if (lines[i] && !lines[i].match(/^\d+$/)) {
          textLines.push(lines[i]);
        }
        i++;
      }

      const text = textLines.join(" ");
      if (text) {
        cues.push({
          id: `cue-${cues.length}`,
          startMs,
          endMs,
          text,
        });
        maxEndTime = Math.max(maxEndTime, endMs);
      }
      continue;
    }

    i++;
  }

  return {
    cues,
    totalDurationMs: maxEndTime,
  };
}

/**
 * Find the current cue based on current time
 */
export function getCurrentCue(
  cues: VTTCue[],
  currentTimeMs: number,
): VTTCue | null {
  return (
    cues.find(
      (cue) => currentTimeMs >= cue.startMs && currentTimeMs < cue.endMs,
    ) || null
  );
}

/**
 * Find all cues between start and end time
 */
export function getCuesBetween(
  cues: VTTCue[],
  startMs: number,
  endMs: number,
): VTTCue[] {
  return cues.filter((cue) => cue.startMs >= startMs && cue.endMs <= endMs);
}

/**
 * Get progress percentage (0-100)
 */
export function getProgress(
  currentTimeMs: number,
  totalDurationMs: number,
): number {
  if (totalDurationMs === 0) return 0;
  return Math.min(100, (currentTimeMs / totalDurationMs) * 100);
}

/**
 * Format milliseconds to HH:MM:SS
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
