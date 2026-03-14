export default function TrueFalseQuestion({
  question,
  value,
  onChange
}:any){

  const options=["True","False","Not Given"]

  return(

    <div
      id={`question-${question.id}`}
      style={{marginBottom:30}}
    >

      <p>
        ({question.id}) {question.question}
      </p>

      <div style={{marginTop:10}}>

        {options.map(op=>(
          
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