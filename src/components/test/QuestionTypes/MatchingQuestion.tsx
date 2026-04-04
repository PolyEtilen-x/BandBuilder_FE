export default function MatchingFeaturesQuestion({
  question,
  options,
  value,
  onChange
}:any){

  return(
    <div id={`question-${question.id}`} style={{marginBottom:30}}>
      ({question.number}) {question.text || "Choose the correct answer"}

      <select
        value={value || ""}
        onChange={(e)=>onChange(question.id,e.target.value)}
      >
        <option value="">Select</option>
        {options.map((op:string)=>(
          <option key={op} value={op}>{op}</option>
        ))}
      </select>

    </div>
  )
}