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
        overflowY:"auto",
        color: "#000"
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