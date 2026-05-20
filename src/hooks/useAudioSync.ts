/**
 * Hook for managing audio playback and synchronization
 * Handles play, pause, mute, and timing sync
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { VTTCue } from "@/lib/vtt-parser";

export interface AudioSyncState {
  isPlaying: boolean;
  isMuted: boolean;
  currentTimeMs: number;
  totalDurationMs: number;
  currentCue: VTTCue | null;
}

interface UseAudioSyncOptions {
  audioSrc: string;
  cues: VTTCue[];
  onCueChange?: (cue: VTTCue | null) => void;
  autoPlay?: boolean;
}

export function useAudioSync({
  audioSrc,
  cues,
  onCueChange,
  autoPlay = false,
}: UseAudioSyncOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioSyncState>({
    isPlaying: false,
    isMuted: false,
    currentTimeMs: 0,
    totalDurationMs: 0,
    currentCue: null,
  });

  // Create audio element
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.addEventListener("loadedmetadata", () => {
        setState((prev) => ({
          ...prev,
          totalDurationMs: audio.duration * 1000,
        }));
      });
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioSrc]);

  // Update current time and find current cue
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTimeMs = audio.currentTime * 1000;
      const currentCue =
        cues.find(
          (cue) => currentTimeMs >= cue.startMs && currentTimeMs < cue.endMs,
        ) || null;

      setState((prev) => ({
        ...prev,
        currentTimeMs,
        currentCue,
      }));

      if (onCueChange && currentCue) {
        onCueChange(currentCue);
      }
    };

    const handlePlay = () => setState((prev) => ({ ...prev, isPlaying: true }));
    const handlePause = () =>
      setState((prev) => ({ ...prev, isPlaying: false }));

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [cues, onCueChange]);

  const play = useCallback(() => {
    audioRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    }
  }, []);

  const seek = useCallback((timeMs: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeMs / 1000;
    }
  }, []);

  const getProgress = useCallback(() => {
    if (state.totalDurationMs === 0) return 0;
    return (state.currentTimeMs / state.totalDurationMs) * 100;
  }, [state.currentTimeMs, state.totalDurationMs]);

  return {
    state,
    audioRef,
    play,
    pause,
    togglePlayPause,
    toggleMute,
    seek,
    getProgress,
  };
}
