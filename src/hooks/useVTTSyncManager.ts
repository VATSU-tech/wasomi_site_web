/**
 * VTT Synchronization Manager
 * Manages audio-text-scroll synchronization with smooth auto-scroll
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { VTTCue } from "@/lib/vtt-parser";

interface VTTSyncManagerProps {
  isPlaying: boolean;
  currentCue: VTTCue | null;
  cues: VTTCue[];
  onSyncChange?: (syncData: { cueIndex: number; progress: number }) => void;
}

interface ScrollSyncState {
  activeCueIndex: number;
  userInteracting: boolean;
  autoScrollEnabled: boolean;
}

export function useVTTSyncManager({
  isPlaying,
  currentCue,
  cues,
  onSyncChange,
}: VTTSyncManagerProps) {
  const [syncState, setSyncState] = useState<ScrollSyncState>({
    activeCueIndex: 0,
    userInteracting: false,
    autoScrollEnabled: true,
  });

  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  // Find current cue index
  const cueIndex = currentCue
    ? cues.findIndex((c) => c.id === currentCue.id)
    : -1;

  // Auto-scroll to current cue
  useEffect(() => {
    if (
      !isPlaying ||
      !currentCue ||
      !syncState.autoScrollEnabled ||
      syncState.userInteracting
    ) {
      return;
    }

    const element = document.getElementById(`cue-${currentCue.id}`);
    if (!element) return;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Scroll smoothly with slight delay for natural feel
    scrollTimeout.current = setTimeout(() => {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [
    currentCue,
    isPlaying,
    syncState.autoScrollEnabled,
    syncState.userInteracting,
  ]);

  // Detect user scroll interaction
  useEffect(() => {
    const handleWheel = () => {
      setSyncState((prev) => ({
        ...prev,
        userInteracting: true,
        autoScrollEnabled: false,
      }));

      // Re-enable auto-scroll after 3 seconds of no interaction
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setSyncState((prev) => ({
          ...prev,
          userInteracting: false,
          autoScrollEnabled: true,
        }));
      }, 3000);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Call callback when cue changes
  useEffect(() => {
    if (cueIndex >= 0 && onSyncChange) {
      const progress = ((cueIndex + 1) / cues.length) * 100;
      onSyncChange({ cueIndex, progress });
    }
  }, [cueIndex, cues, onSyncChange]);

  // Update active cue index
  useEffect(() => {
    setSyncState((prev) => ({
      ...prev,
      activeCueIndex: cueIndex >= 0 ? cueIndex : prev.activeCueIndex,
    }));
  }, [cueIndex]);

  const toggleAutoScroll = useCallback(() => {
    setSyncState((prev) => ({
      ...prev,
      autoScrollEnabled: !prev.autoScrollEnabled,
      userInteracting: false,
    }));
  }, []);

  return {
    syncState,
    cueIndex,
    toggleAutoScroll,
    targetRef,
  };
}
