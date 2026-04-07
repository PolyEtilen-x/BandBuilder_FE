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
    const selection = window.getSelection()?.toString().trim()
    if (!selection) return

    if (activeTool === "dict") {
      lookup(selection)
    }
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

      <p
        style={{
          lineHeight: 1.8,
          color: colors.text.primary,
          fontSize: "16px",
          whiteSpace: "pre-line"
        }}
      >
        {passage?.content || "No passage"}
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