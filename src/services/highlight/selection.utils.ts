/**
 * Selection Manager Utilities
 * Handles absolute text selection tracking and word normalization
 */

/**
 * Gets absolute character start and end offsets of a Range relative to a parent container's plain text content.
 * Walks through all text nodes inside the container using DOM TreeWalker.
 */
export function getAbsoluteOffsets(container: HTMLElement, range: Range): { startOffset: number; endOffset: number } | null {
  let startOffset = 0;
  let endOffset = 0;
  let startFound = false;
  let endFound = false;

  const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let charCount = 0;

  while (treeWalker.nextNode()) {
    const currentNode = treeWalker.currentNode;

    if (currentNode === range.startContainer) {
      startOffset = charCount + range.startOffset;
      startFound = true;
    }

    if (currentNode === range.endContainer) {
      endOffset = charCount + range.endOffset;
      endFound = true;
      break;
    }

    charCount += currentNode.textContent?.length || 0;
  }

  if (startFound && endFound) {
    return { startOffset, endOffset };
  }

  return null;
}

/**
 * Normalizes absolute start and end offsets to complete word boundaries in the text.
 * Expands selection leftward and rightward based on word characters (including single quotes and hyphens).
 */
export function normalizeAbsoluteOffsets(
  text: string,
  start: number,
  end: number
): { start: number; end: number; text: string } | null {
  const wordCharRegex = /[\w'-]/;

  let newStart = start;
  let newEnd = end;

  // Expand start offset leftward to include the beginning of the word
  while (newStart > 0 && wordCharRegex.test(text[newStart - 1])) {
    newStart--;
  }

  // Expand end offset rightward to include the end of the word
  while (newEnd < text.length && wordCharRegex.test(text[newEnd])) {
    newEnd++;
  }

  const selectedText = text.slice(newStart, newEnd).trim();
  if (!selectedText) return null;

  return {
    start: newStart,
    end: newEnd,
    text: selectedText
  };
}
