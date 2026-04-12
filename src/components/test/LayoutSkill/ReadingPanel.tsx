import colors from "@/styles/theme/colors";
import { useDictionary } from "@/services/dictionary/useDictionary"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"
import "./style.css"

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
      const sentence = getSentenceFromText(text)
      lookup(text, sentence)
    }
  }

  const expandRangeToWord = (range: Range): Range => {
    const startNode = range.startContainer
    const endNode = range.endContainer

    if (startNode.nodeType !== 3 || endNode.nodeType !== 3) return range

    const text = startNode.textContent || ""

    let start = range.startOffset
    let end = range.endOffset

    while (start > 0 && /\w/.test(text[start - 1])) {
      start--
    }

    while (end < text.length && /\w/.test(text[end])) {
      end++
    }

    const newRange = document.createRange()
    newRange.setStart(startNode, start)
    newRange.setEnd(endNode, end)

    return newRange
  }

  const getSentenceFromText = (word: string) => {
    const content = passage?.content || ""

    const sentences: string[] = content.split(/(?<=[.!?])\s+/)

    return sentences.find((s: string) =>
      s.toLowerCase().includes(word.toLowerCase())
      ) || content
  }
    
  return (
    <article
      style={{
        padding:"30px",
        overflowY:"auto",
        borderRight:"1px solid #eee",
        lineHeight:1.8,
        maxWidth:"100%"
      }} 
      onMouseUp={handleMouseUp}
    >
      <h1 style={{color: "#000", fontSize: "24px", marginBottom: "16px", fontWeight: "bold"}}>
        {passage?.title || "PASSAGE"}
      </h1>
      <h3 style={{lineHeight:1.7, color: colors.text.primary, fontSize: "18px", marginBottom: "24px", fontWeight: 500 }}>
        {passage?.topic || passage?.text  || "No passage"}
      </h3>

      <p className="reading-text">
        {passage?.content}
      </p>
      
      <DictionaryPanel
        dict={dict}
        loading={loading}
        onClose={close}
        onSave={save}
      />
    </article>
  )

}