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
        padding: "24px",
        overflowY: "auto",
        color: "#000",
        fontSize: "15px",
        lineHeight: 1.6
      }}
    >
      {questionBlocks.map((block:any, index:number)=>(
        <div key={index} style={{marginBottom:32}}>

          <h3 
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "12px"
            }}
          >
            {block.instruction}
          </h3>

          {block.question_type === "selecting_factors" && (
            <QuestionRenderer
              question={{ id: block.questions_range }}
              type={block.question_type}
              value={answers[block.questions_range]}
              onChange={updateAnswer}
              extra={block}
            />
          )}
          {!block.questions && (
            <QuestionRenderer
              question={{ id: block.questions_range }}
              type={block.question_type}
              value={answers[block.questions_range]}
              onChange={updateAnswer}
              extra={block}
            />
          )}

          {block.questions?.map((q:any)=>(
            <div id={`question-${q.id}`} key={q.id}>
              <QuestionRenderer
                question={q}
                type={block.question_type}
                value={answers[q.id]}
                onChange={updateAnswer}
                extra={block}
              />
            </div>
          ))}
        </div>
      ))}
    </aside>
  )
}