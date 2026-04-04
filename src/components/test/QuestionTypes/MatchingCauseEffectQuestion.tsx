export default function MatchingCauseEffectQuestion({
  question,
  effects,
  value,
  onChange
}:any){

  return(
    <div id={`question-${question.id}`} style={{marginBottom:30}}>

      <p>({question.number}) {question.cause}</p>

      <select
        value={value || ""}
        onChange={(e)=>onChange(question.id,e.target.value)}
      >
        <option value="">Select effect</option>
        {effects.map((e:string)=>(
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

    </div>
  )
}