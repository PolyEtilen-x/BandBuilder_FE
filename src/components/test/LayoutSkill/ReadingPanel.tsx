import { useState, useEffect } from "react"
import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"
import { useHighlight } from "@/services/highlight/useHighlight"
import { getAbsoluteOffsets, normalizeAbsoluteOffsets } from "@/services/highlight/selection.utils"
import { renderHighlightedText } from "@/services/highlight/render.utils"

type ToolType = "highlight" | "note" | "dict"

type Props = {
  passage: any
  activeTool?: ToolType
}

export default function ReadingPanel({ passage, activeTool }: Props) {
  const { dict, loading, lookup, close, save } = useDictionary()
  const [manuallyClosed, setManuallyClosed] = useState(false)

  const passageId = passage?.id || passage?.title || "default-passage"
  const { highlights, addHighlight, removeHighlight } = useHighlight(passageId)

  // Reset manuallyClosed when tool changes
  useEffect(() => {
    setManuallyClosed(false)
  }, [activeTool])

  const handleParagraphMouseUp = (
    e: React.MouseEvent<HTMLParagraphElement>,
    pIndex: number,
    paraText: string
  ) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const container = e.currentTarget

    const offsets = getAbsoluteOffsets(container, range)
    if (!offsets) return

    const normalized = normalizeAbsoluteOffsets(
      paraText,
      offsets.startOffset,
      offsets.endOffset
    )
    if (!normalized) return

    if (activeTool === "highlight") {
      addHighlight(pIndex, normalized.start, normalized.end, normalized.text)
      selection.removeAllRanges()
    } else if (activeTool === "dict") {
      const sentence = getSentenceFromText(normalized.text)
      lookup(normalized.text, sentence)
      setManuallyClosed(false)
    }
  }

  const getSentenceFromText = (word: string) => {
    const content = passage?.content || ""
    const sentences = content.split(/(?<=[.!?])\s+/)
    return sentences.find((s: string) =>
      s.toLowerCase().includes(word.toLowerCase())
    ) || content
  }

  return (
    <article
      className={activeTool === "highlight" ? "highlight-active" : ""}
      style={{
        padding: "40px 50px",
        height: "100%",
        lineHeight: 2,
        maxWidth: "100%",
        fontSize: "18px",
        color: "#1a1a1a",
        position: "relative"
      }}
    >
      <h1 style={{
        color: "#000",
        fontSize: "28px",
        marginBottom: "12px",
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase"
      }}>
        {passage?.title || "READING PASSAGE"}
      </h1>

      <p style={{
        textAlign: "center",
        fontStyle: "italic",
        marginBottom: "40px",
        color: "#4b5563",
        fontSize: "16px"
      }}>
        {passage?.topic || "You should spend about 20 minutes on Questions 1-13"}
      </p>

      <div className="reading-content-wrapper" style={{ position: "relative" }}>
        {passage?.content?.split("\n\n").map((para: string, pIndex: number) => (
          <div key={pIndex} style={{ display: "flex", marginBottom: "24px", position: "relative" }}>
            <p
              onMouseUp={(e) => handleParagraphMouseUp(e, pIndex, para)}
              style={{
                margin: 0,
                textAlign: "justify",
                width: "100%",
                userSelect: "text"
              }}
            >
              {renderHighlightedText(
                para,
                highlights.filter((hl) => hl.paraIndex === pIndex),
                removeHighlight
              )}
            </p>
          </div>
        ))}
      </div>

      {dict && !manuallyClosed && (
        <DictionaryPanel
          dict={dict}
          loading={loading}
          onClose={() => {
            setManuallyClosed(true)
            close()
          }}
          onSave={save}
        />
      )}
    </article>
  )
}