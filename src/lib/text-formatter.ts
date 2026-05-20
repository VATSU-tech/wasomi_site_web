/**
 * Text formatting utilities for history content
 * Transforms raw text into structured, readable paragraphs
 */

export interface FormattedParagraph {
  id: string;
  text: string;
  isHeading?: boolean;
  isList?: boolean;
}

/**
 * Parse raw text into structured paragraphs
 */
export function formatHistoryText(rawText: string): FormattedParagraph[] {
  const lines = rawText.split("\n").filter((line) => line.trim());
  const paragraphs: FormattedParagraph[] = [];
  let currentParagraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect headings (all caps, numbered, or followed by empty line pattern)
    const isHeading =
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 2 &&
      !trimmed.includes("*") &&
      !trimmed.match(/^[\d.]+/);

    // Detect list items
    const isListItem = trimmed.startsWith("*") || trimmed.startsWith("-");

    if (isHeading) {
      // Save current paragraph if exists
      if (currentParagraph.length > 0) {
        paragraphs.push({
          id: `para-${paragraphs.length}`,
          text: currentParagraph.join(" "),
          isHeading: false,
        });
        currentParagraph = [];
      }

      // Add heading
      paragraphs.push({
        id: `para-${paragraphs.length}`,
        text: trimmed,
        isHeading: true,
      });
    } else if (isListItem) {
      // Save current paragraph if exists
      if (currentParagraph.length > 0) {
        paragraphs.push({
          id: `para-${paragraphs.length}`,
          text: currentParagraph.join(" "),
          isHeading: false,
        });
        currentParagraph = [];
      }

      // Add list item
      paragraphs.push({
        id: `para-${paragraphs.length}`,
        text: trimmed.replace(/^[*-]\s*/, ""),
        isList: true,
      });
    } else {
      // Regular text
      currentParagraph.push(trimmed);
    }
  }

  // Add remaining paragraph
  if (currentParagraph.length > 0) {
    paragraphs.push({
      id: `para-${paragraphs.length}`,
      text: currentParagraph.join(" "),
      isHeading: false,
    });
  }

  return paragraphs;
}
