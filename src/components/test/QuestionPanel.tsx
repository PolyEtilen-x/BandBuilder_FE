import QuestionRenderer from "./QuestionRenderer"

export default function QuestionPanel({
  questionBlocks = [],
  answers,
  updateAnswer
}:any){

  if (!questionBlocks.length) {
    return <p>No questions</p>
  }

  return (
    
    <aside
      style={{
        padding:"30px",
        overflowY:"auto",
        color: "#000"
      }}
    >
      {questionBlocks.map((block:any, index:number)=>(
        <div key={index} style={{marginBottom:40}}>

          <h3>{block.instruction}</h3>

          {block.question_type === "selecting_factors" && (
            <QuestionRenderer
              question={{ id: block.questions_range }}
              type={block.question_type}
              value={answers[block.questions_range]}
              onChange={updateAnswer}
              extra={block}
            />
          )}
          
          {block.questions?.map((q:any)=>(

            <QuestionRenderer
              key={q.id}
              question={q}
              type={block.question_type}  
              value={answers[q.id]}
              onChange={updateAnswer}
              extra={block}            
            />
          ))}
        </div>
      ))}
    </aside>
  )
}