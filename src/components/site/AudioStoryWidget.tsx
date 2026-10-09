import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, X, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const AUDIO_SRC = "/docs/historique_audio.mp3";
const DISMISSED_KEY = "audio-story-widget-dismissed";

/**
 * Floating pill widget that invites the visitor to listen to the school's story.
 * Appears on every site page (not in the /app portal).
 *
 * – Plays / pauses the school history audio
 * – Shows a thin progress bar while playing
 * – Dismissible (persisted per session via sessionStorage)
 * – Non-intrusive: fixed bottom-center, small footprint, doesn't block navigation
 */
export function AudioStoryWidget() {
  /* ── Dismiss state ──────────────────────────────────── */
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  /* ── Audio state ────────────────────────────────────── */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [ready, setReady] = useState(false);

  /* ── Entrance animation (slide-up after mount) ──── */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const id = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(id);
  }, [dismissed]);

  /* ── Create audio element once ──────────────────── */
  useEffect(() => {
    if (dismissed) return;

    const audio = new Audio(AUDIO_SRC);
    audio.preload = "metadata";
    audioRef.current = audio;

    const onMeta = () => {
      setDuration(audio.duration);
      setReady(true);
    };
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [dismissed]);

  /* ── Handlers ───────────────────────────────────── */
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const dismiss = useCallback(() => {
    audioRef.current?.pause();
    setVisible(false);
    // Wait for exit animation before fully hiding
    setTimeout(() => {
      setDismissed(true);
      try {
        sessionStorage.setItem(DISMISSED_KEY, "1");
      } catch {}
    }, 350);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ── Don't render if already dismissed ──────────── */
  if (dismissed) return null;

  return (
    <div
      role="complementary"
      aria-label="Écouter l'histoire de l'école"
      className={cn(
        // Positioning
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-40",
        // Shape
        "flex items-center gap-3 rounded-full",
        "px-4 py-2.5 sm:px-5 sm:py-3",
        // Background — frosted glass
        "bg-slate-900/85 backdrop-blur-xl",
        "border border-white/10 shadow-2xl shadow-black/30",
        // Transition
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 pointer-events-none",
      )}
    >
      {/* ── Play / Pause button ─────────────────── */}
      <button
        type="button"
        onClick={togglePlay}
        disabled={!ready}
        aria-label={isPlaying ? "Mettre en pause" : "Écouter notre histoire"}
        className={cn(
          "flex items-center justify-center",
          "size-10 sm:size-11 rounded-full",
          "bg-gradient-primary text-white",
          "shadow-lg hover:shadow-glow",
          "transition-all active:scale-95",
          "disabled:opacity-50 disabled:cursor-wait",
        )}
      >
        {isPlaying ? (
          <Pause className="size-4 sm:size-[18px]" fill="white" />
        ) : (
          <Play className="size-4 sm:size-[18px] ml-0.5" fill="white" />
        )}
      </button>

      {/* ── Label + progress ────────────────────── */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <Volume2 className="size-3.5 text-emerald-400 shrink-0 hidden sm:block" />
          <span className="text-[13px] sm:text-sm font-semibold text-white whitespace-nowrap">
            {isPlaying ? "Notre histoire" : "Écouter notre histoire"}
          </span>
          {isPlaying && duration > 0 && (
            <span className="text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
              {formatTime(currentTime)}/{formatTime(duration)}
            </span>
          )}
        </div>

        {/* Thin progress bar — only visible when playing or partially played */}
        {(isPlaying || progress > 0) && (
          <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-primary rounded-full transition-[width] duration-200 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* ── Close button ────────────────────────── */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer le lecteur audio"
        className={cn(
          "flex items-center justify-center",
          "size-7 sm:size-8 rounded-full",
          "text-slate-400 hover:text-white hover:bg-white/10",
          "transition-colors ml-1",
        )}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
