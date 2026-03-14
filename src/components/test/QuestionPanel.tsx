import QuestionRenderer from "./QuestionRenderer"

export default function QuestionPanel({
  questions,
  answers,
  updateAnswer
}:any){

  return (

    <aside
      style={{
        padding:"30px",
        overflowY:"auto"
      }}
    >

      {questions.map((q:any)=>(
        
        <QuestionRenderer
          key={q.id}
          question={q}
          value={answers[q.id]}
          onChange={updateAnswer}
        />

      ))}

    </aside>

  )

}