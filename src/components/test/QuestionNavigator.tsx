export default function QuestionNavigator({
  questionBlocks = [],
  answers
}:any){

  const flatQuestions = questionBlocks.flatMap((block:any) => {
    if (block.questions) return block.questions
    return []
  })

  function goToQuestion(id:string){
    const el = document.getElementById(`question-${id}`)

    if(el){
      el.scrollIntoView({
        behavior:"smooth",
        block:"center"
      })
    }
  }
  return(
    <nav
      style={{
        borderTop:"1px solid #eee",
        padding:"10px 20px",
        display:"flex",
        gap:"20px",
        overflowX:"auto"
      }}
    >
      {flatQuestions.map((q:any)=>{
        const answered = answers[q.id]
        return(
          <button
            key={q.id}
            onClick={()=>goToQuestion(q.id)}
            style={{
              width:38,
              height:38,
              borderRadius:"50%",
              border:"none",
              cursor:"pointer",

              background:answered
                ? "#3b82f6"
                : "#dbeafe",

              color:answered
                ? "#fff"
                : "#1e3a8a"
            }}
          >
            {q.number}
          </button>
        )
      })}
    </nav>
  )
}