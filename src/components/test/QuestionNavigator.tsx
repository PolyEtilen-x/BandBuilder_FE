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
        padding:"10px 16px",
        display:"flex",
        gap:"10px",
        overflowX:"auto",
        alignItems:"center"
      }}
    >
      {flatQuestions.map((q:any)=>{
        const answered = answers[q.id]
        return(
          <button
            key={q.id}
            onClick={()=>goToQuestion(q.id)}
            style={{
              width:34,
              height:34,
              borderRadius:"50%",
              border:"1px solid #ccc",
              cursor:"pointer",

              background: answered ? "#2563eb" : "#f3f4f6",
              color: answered ? "#fff" : "#111",

              fontSize:"13px",
              fontWeight:600
            }}
          >
            {q.number}
          </button>
        )
      })}
    </nav>
  )
}