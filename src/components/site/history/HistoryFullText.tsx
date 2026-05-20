/**
 * Immersive full history text component with audio synchronization
 * Displays the complete history with background, auto-scroll, and visual highlights
 */

import { useEffect, useState, useMemo } from "react";
import { useAudioSync } from "@/hooks/useAudioSync";
import { useVTTData } from "@/hooks/useVTTData";
import { useVTTSyncManager } from "@/hooks/useVTTSyncManager";
import { useTextContent } from "@/hooks/useTextContent";
import { formatHistoryText } from "@/lib/text-formatter";
import { VTTCue } from "@/lib/vtt-parser";

interface HistoryFullTextProps {
  textPath: string;
  audioPath: string;
  vttPath: string;
  backgroundImage: string;
  backgroundOpacity?: number;
}

export function HistoryFullText({
  textPath,
  audioPath,
  vttPath,
  backgroundImage,
  backgroundOpacity = 0.5,
}: HistoryFullTextProps) {
  const [rawText, setRawText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { data: vttData } = useVTTData(vttPath);

  // Load and format text
  useEffect(() => {
    fetch(textPath)
      .then((res) => res.text())
      .then((text) => {
        setRawText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load history text:", err);
        setLoading(false);
      });
  }, [textPath]);

  const formattedParagraphs = useMemo(
    () => formatHistoryText(rawText),
    [rawText],
  );
  const cues = vttData?.cues || [];

  // Audio sync
  const {
    state: audioState,
    togglePlayPause,
    toggleMute,
  } = useAudioSync({
    audioSrc: audioPath,
    cues,
  });

  // VTT sync manager
  const { cueIndex } = useVTTSyncManager({
    isPlaying: audioState.isPlaying,
    currentCue: audioState.currentCue,
    cues,
  });

  if (loading) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <section className="relative py-24 min-h-screen">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: backgroundOpacity }}
      />

      {/* Gradient overlay for extra elegance */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />

      {/* Content */}
      <div className="relative container mx-auto px-4 max-w-4xl">
        {/* Progress Indicator */}
        {/* <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-white">
              {audioState.currentCue
                ? `${Math.round((cueIndex / cues.length) * 100)}%`
                : "0%"}
            </h3>
            <div className="text-sm text-slate-300">
              {audioState.isPlaying ? "▶ En cours de lecture" : "⏸ En pause"}
            </div>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-200"
              style={{
                width: `${cueIndex >= 0 ? ((cueIndex + 1) / cues.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div> */}

        {/* Text Content */}
        <article className="prose prose-invert max-w-none">
          {formattedParagraphs.map((para, index) => {
            const cueId = `cue-${para.id}`;
            const isActive =
              audioState.currentCue &&
              audioState.currentCue.id &&
              index === cueIndex;

            return (
              <div
                key={para.id}
                id={cueId}
                className={`transition-all duration-300 ${
                  para.isHeading
                    ? "mb-8 mt-12"
                    : para.isList
                      ? "mb-3 ml-6"
                      : "mb-6"
                }`}
              >
                {para.isHeading ? (
                  <h2
                    className={`font-display text-3xl md:text-4xl font-bold mb-4 ${
                      isActive ? "text-gradient" : "text-white"
                    }`}
                  >
                    {para.text}
                  </h2>
                ) : para.isList ? (
                  <div
                    className={`relative pl-4 text-base md:text-lg leading-relaxed ${
                      isActive
                        ? "text-white bg-white/5 px-4 py-2 rounded-lg"
                        : "text-slate-200"
                    }`}
                  >
                    <div className="absolute left-0 top-2 size-2 rounded-full bg-gradient-primary" />
                    {para.text}
                  </div>
                ) : (
                  <p
                    className={`text-base md:text-lg leading-relaxed transition-all ${
                      isActive
                        ? "text-white font-semibold bg-white/10 px-4 py-3 rounded-lg"
                        : "text-slate-200"
                    }`}
                  >
                    {para.text}
                  </p>
                )}
              </div>
            );
          })}
        </article>

        {/* End of content indicator */}
        <div className="mt-16 text-center opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-slate-300 italic">Fin de l'historique</p>
        </div>
      </div>
    </section>
  );
}
