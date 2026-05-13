import { useState, useEffect } from "react"
import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"

type ToolType = "highlight" | "note" | "dict"

type Props = {
  passage: any
  activeTool?: ToolType
}

export default function ReadingPanel({ passage, activeTool }: Props) {

  const { dict, loading, lookup, close, save } = useDictionary()
  const [manuallyClosed, setManuallyClosed] = useState(false)

  // Reset manuallyClosed when tool changes
  useEffect(() => {
    setManuallyClosed(false)
  }, [activeTool])

  const handleMouseUp = () => {
    if (activeTool !== "dict") return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    let range = selection.getRangeAt(0)
    range = expandRangeToWord(range)

    const text = range.toString().trim()
    if (!text) return

    const sentence = getSentenceFromText(text)
    lookup(text, sentence)
    setManuallyClosed(false)
  }

  const expandRangeToWord = (range: Range): Range => {
    const startNode = range.startContainer
    const endNode = range.endContainer
    if (startNode.nodeType !== 3 || endNode.nodeType !== 3) return range
    const text = startNode.textContent || ""
    let start = range.startOffset
    let end = range.endOffset
    while (start > 0 && /\w/.test(text[start - 1])) start--
    while (end < text.length && /\w/.test(text[end])) end++
    const newRange = document.createRange()
    newRange.setStart(startNode, start)
    newRange.setEnd(endNode, end)
    return newRange
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
      style={{
        padding: "40px 50px",
        height: "100%",
        lineHeight: 2,
        maxWidth: "100%",
        fontSize: "18px",
        color: "#1a1a1a",
        position: "relative"
      }}
      onMouseUp={handleMouseUp}
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
            <p style={{ margin: 0, textAlign: "justify", width: "100%" }}>
              {para}
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