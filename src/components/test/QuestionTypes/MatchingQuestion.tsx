export default function MatchingFeaturesQuestion({
  question,
  options,
  value,
  onChange
}:any){

  return(
    <div style={{marginBottom:30}}>

      <p>({question.number}) {question.text}</p>

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