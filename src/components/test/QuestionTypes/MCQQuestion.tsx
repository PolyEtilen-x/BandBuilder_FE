export default function MCQQuestion({
  question,
  value,
  onChange
}:any){

  return(

    <div
      id={`question-${question.id}`}
      style={{marginBottom:30}}
    >

      <p>
        ({question.id}) {question.question}
      </p>

      <div style={{marginTop:10}}>

        {question.options.map((op:string)=>(
          
          <label
            key={op}
            style={{
              display:"block",
              marginBottom:5
            }}
          >

            <input
              type="radio"
              checked={value===op}
              onChange={()=>onChange(question.id,op)}
            />

            {" "} {op}

          </label>

        ))}

      </div>

    </div>

  )

}