import React from "react"

export interface Highlight {
  id: string
  passageId: string
  paraIndex: number
  startOffset: number
  endOffset: number
  selectedText: string
  color: string
  createdAt: number
}

/**
 * Declaratively slices the text content and inserts <mark> elements for each non-overlapping highlight.
 * This completely avoids raw DOM modifications and prevents nested tag errors.
 */
export function renderHighlightedText(
  text: string,
  highlights: Highlight[],
  onRemove: (id: string) => void
): React.ReactNode {
  if (!highlights || highlights.length === 0) {
    return text;
  }

  // Sort highlights by startOffset ascending
  const sorted = [...highlights].sort((a, b) => a.startOffset - b.startOffset);

  const result: React.ReactNode[] = [];
  let currentIndex = 0;

  sorted.forEach((hl) => {
    // Skip overlapping highlights to prevent nested tags or layout breaks
    if (hl.startOffset < currentIndex) {
      return;
    }

    // Insert plain text leading up to the highlight
    if (hl.startOffset > currentIndex) {
      result.push(
        <span key={`text-${currentIndex}-${hl.startOffset}`}>
          {text.slice(currentIndex, hl.startOffset)}
        </span>
      );
    }

    // Insert highlighted text segment
    result.push(
      <mark
        key={hl.id}
        className="bb-highlight"
        style={{
          backgroundColor: hl.color || "rgba(140, 181, 253, 0.4)",
          borderRadius: "4px",
          padding: "1px 2px",
          cursor: "pointer",
          transition: "background-color 0.2s"
        }}
        title="Double-click to remove highlight"
        onDoubleClick={(e) => {
          e.stopPropagation();
          onRemove(hl.id);
        }}
      >
        {text.slice(hl.startOffset, hl.endOffset)}
      </mark>
    );

    currentIndex = hl.endOffset;
  });

  // Insert any remaining plain text at the end
  if (currentIndex < text.length) {
    result.push(
      <span key={`text-end-${currentIndex}`}>
        {text.slice(currentIndex)}
      </span>
    );
  }

  return <>{result}</>;
}
