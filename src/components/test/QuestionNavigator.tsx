export default function QuestionNavigator({
  questions,
  answers,
  groups
}:any){

  function goToQuestion(id:number){

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
        gap:"40px",
        overflowX:"auto"
      }}
    >

      {groups.map((group:any)=>{

        const nums = questions.filter(
          (q:any)=>q.id>=group.start && q.id<=group.end
        )

        return(

          <div key={group.label}>

            <p style={{fontSize:14}}>
              {group.label}
            </p>

            <div
              style={{
                display:"flex",
                gap:"8px",
                marginTop:"5px"
              }}
            >

              {nums.map((q:any)=>{

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
                    {q.id}
                  </button>

                )

              })}

            </div>

          </div>

        )

      })}

    </nav>

  )

}