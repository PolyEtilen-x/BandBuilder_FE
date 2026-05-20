import { useState, useEffect, useCallback } from "react"
import { Highlight } from "./render.utils"

/**
 * Custom hook to manage persistence, retrieval, and updates for text highlights.
 * Uses localStorage to rehydrate highlights when reloading pages or returning to passages.
 */
export function useHighlight(passageId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([])

  // Rehydrate highlights from localStorage on passage/section change
  useEffect(() => {
    if (!passageId) return;

    const key = `bandbuilder-highlights-${passageId}`;
    const stored = localStorage.getItem(key);

    const timer = setTimeout(() => {
      if (stored) {
        try {
          setHighlights(JSON.parse(stored));
        } catch (err) {
          console.error("Failed to parse stored highlights:", err);
        }
      } else {
        setHighlights([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [passageId]);

  // Persistence handler
  const saveHighlights = useCallback(
    (newHighlights: Highlight[]) => {
      if (!passageId) return;
      const key = `bandbuilder-highlights-${passageId}`;
      localStorage.setItem(key, JSON.stringify(newHighlights));
      setHighlights(newHighlights);
    },
    [passageId]
  );

  /**
   * Adds a new highlight while intelligently merging or overriding overlapping highlights
   * in the exact same paragraph container to prevent duplicate spans.
   */
  const addHighlight = useCallback(
    (
      paraIndex: number,
      startOffset: number,
      endOffset: number,
      selectedText: string,
      color: string = "rgba(140, 181, 253, 0.4)"
    ) => {
      const newHighlight: Highlight = {
        id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        passageId,
        paraIndex,
        startOffset,
        endOffset,
        selectedText,
        color,
        createdAt: Date.now(),
      };

      setHighlights((prev) => {
        // Exclude pre-existing highlights that overlap with the new selection bounds in the same paragraph
        const filtered = prev.filter(
          (hl) =>
            hl.paraIndex !== paraIndex ||
            !(
              (startOffset >= hl.startOffset && startOffset < hl.endOffset) ||
              (endOffset > hl.startOffset && endOffset <= hl.endOffset) ||
              (startOffset <= hl.startOffset && endOffset >= hl.endOffset)
            )
        );

        const updated = [...filtered, newHighlight];
        saveHighlights(updated);
        return updated;
      });
    },
    [passageId, saveHighlights]
  );

  /**
   * Deletes a specific highlight by its unique identifier.
   */
  const removeHighlight = useCallback(
    (id: string) => {
      setHighlights((prev) => {
        const updated = prev.filter((hl) => hl.id !== id);
        saveHighlights(updated);
        return updated;
      });
    },
    [saveHighlights]
  );

  /**
   * Clears all highlights for the current passage context.
   */
  const clearHighlights = useCallback(() => {
    saveHighlights([]);
  }, [saveHighlights]);

  return {
    highlights,
    addHighlight,
    removeHighlight,
    clearHighlights,
  };
}
