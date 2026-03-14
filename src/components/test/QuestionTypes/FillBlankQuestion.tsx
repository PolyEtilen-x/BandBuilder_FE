type Props = {
  question: any
  value: string
  onChange: (id:number,value:string)=>void
}

export default function FillBlankQuestion({
  question,
  value,
  onChange
}:Props){

  const parts = question.text.split("_____")

  return (

    <div
      id={`question-${question.id}`}
      style={{marginBottom:30,lineHeight:1.8}}
    >

      <span>{parts[0]}</span>

      <input
        type="text"
        value={value || ""}
        onChange={(e)=>onChange(question.id,e.target.value)}
        style={{
          border:"none",
          borderBottom:"2px solid #3b82f6",
          outline:"none",
          width:120,
          margin:"0 6px"
        }}
      />

      <span>{parts[1]}</span>

    </div>

  )

}