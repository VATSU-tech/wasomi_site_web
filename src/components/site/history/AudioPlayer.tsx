/**
 * Modern audio player component with premium styling
 */

import { useEffect, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useAudioSync } from "@/hooks/useAudioSync";
import { VTTCue, formatTime } from "@/lib/vtt-parser";

interface AudioPlayerProps {
  audioSrc: string;
  cues: VTTCue[];
  onCueChange?: (cue: VTTCue | null) => void;
}

export function AudioPlayer({ audioSrc, cues, onCueChange }: AudioPlayerProps) {
  const { state, togglePlayPause, toggleMute, seek, getProgress } =
    useAudioSync({
      audioSrc,
      cues,
      onCueChange,
    });

  const [isDragging, setIsDragging] = useState(false);

  // Format time display
  const currentTime = formatTime(state.currentTimeMs);
  const totalTime = formatTime(state.totalDurationMs);
  const progress = getProgress();

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.totalDurationMs;
    seek(Math.max(0, Math.min(newTime, state.totalDurationMs)));
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * state.totalDurationMs;
    seek(Math.max(0, Math.min(newTime, state.totalDurationMs)));
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
      {/* Controls Row */}
      <div className="flex items-center justify-between mb-6">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center size-14 rounded-full bg-gradient-primary hover:shadow-glow transition-all active:scale-95"
          aria-label={state.isPlaying ? "Pause" : "Play"}
        >
          {state.isPlaying ? (
            <Pause className="size-6 text-white" fill="white" />
          ) : (
            <Play className="size-6 text-white ml-0.5" fill="white" />
          )}
        </button>

        {/* Time Display */}
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-gradient min-w-[40px]">{currentTime}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-300 min-w-[40px]">{totalTime}</span>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="flex items-center justify-center size-10 rounded-lg hover:bg-slate-700 transition-colors"
          aria-label={state.isMuted ? "Unmute" : "Mute"}
        >
          {state.isMuted ? (
            <VolumeX className="size-5 text-slate-400" />
          ) : (
            <Volume2 className="size-5 text-slate-400" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div
        className="relative h-2 rounded-full bg-slate-700 cursor-pointer group"
        onClick={handleProgressClick}
        onMouseMove={handleProgressMouseMove}
        onMouseDown={handleProgressMouseDown}
      >
        {/* Buffered/Background */}
        <div className="absolute inset-0 rounded-full bg-slate-700" />

        {/* Progress */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-primary rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />

        {/* Hover indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 pointer-events-none"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
}
