import colors from "@/styles/theme/colors";
import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"

type ToolType = "highlight" | "note" | "dict"

type Props = {
  passage: any
  activeTool?: ToolType 
}

export default function ReadingPanel({passage, activeTool}:Props){
  const { dict, loading, lookup, close, save } = useDictionary()

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return
    let range = selection.getRangeAt(0)
    range = expandRangeToWord(range)
    const text = range.toString().trim()
    if (!text) return

    if (activeTool === "highlight") {
      const span = document.createElement("span")
      span.style.background = "#8cb5fd"
      span.style.borderRadius = "4px"
      try {
        range.surroundContents(span)
        selection.removeAllRanges()
      } catch {
        const mark = document.createElement("mark")
        mark.appendChild(range.extractContents())
        range.insertNode(mark)
      }
    }

    if (activeTool === "dict") {
      lookup(text)
    }
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

  return (
    <article
      style={{
        padding: "40px 60px",
        height: "100%",
        lineHeight: 2,
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "19px",
        color: "#1a1a1a",
        position: "relative",
        backgroundColor: "#fff"
      }}
      onMouseUp={handleMouseUp}
    >
      <h1 style={{ 
        fontSize: "28px", 
        marginBottom: "16px", 
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
        color: "#64748b",
        fontSize: "16px",
        fontFamily: "sans-serif"
      }}>
        {passage?.topic || "You should spend about 20 minutes on Questions 1-13"}
      </p>

      <div style={{ position: "relative" }}>
        {passage?.content?.split("\n\n").map((para: string, pIndex: number) => (
          <div key={pIndex} style={{ display: "flex", marginBottom: "28px", position: "relative" }}>
            <div style={{
              position: "absolute",
              left: "-45px",
              width: "35px",
              textAlign: "right",
              fontSize: "14px",
              color: "#cbd5e1",
              fontWeight: 700,
              userSelect: "none",
              fontFamily: "sans-serif",
            }}>
              {(pIndex + 1) * 5}
            </div>
            <p style={{ margin: 0, textAlign: "justify", width: "100%" }}>
              {para}
            </p>
          </div>
        ))}
      </div>
      
      <DictionaryPanel
        dict={dict}
        loading={loading}
        onClose={close}
        onSave={save}
      />
    </article>
  )
}