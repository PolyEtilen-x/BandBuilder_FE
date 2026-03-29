export default function TableCompletionQuestion({
  question,
  headers,
  value,
  onChange
}:any){

  return(
    <div style={{marginBottom:20}}>

      <p>({question.number}) {question.text}</p>

      <input
        type="text"
        value={value || ""}
        onChange={(e)=>onChange(question.id,e.target.value)}
      />

    </div>
  )
}