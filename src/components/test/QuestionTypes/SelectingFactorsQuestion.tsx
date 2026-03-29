export default function SelectingFactorsQuestion({
  question,
  options,
  value = [],
  onChange
}:any){

  function toggle(op:string){
    if(value.includes(op)){
      onChange(question.id, value.filter((v:string)=>v!==op))
    }else{
      onChange(question.id, [...value, op])
    }
  }

  return(
    <div style={{marginBottom:30}}>

      <p>({question.number}) {question.text}</p>

      {options.map((op:string)=>(
        <label key={op} style={{display:"block"}}>
          <input
            type="checkbox"
            checked={value.includes(op)}
            onChange={()=>toggle(op)}
          />
          {" "} {op}
        </label>
      ))}

    </div>
  )
}