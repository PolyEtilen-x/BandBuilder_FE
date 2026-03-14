import { lazy,Suspense } from "react"

const FillBlank = lazy(()=>import("./QuestionTypes/FillBlankQuestion"))
const MCQ = lazy(()=>import("./QuestionTypes/MCQQuestion"))
const TrueFalse = lazy(()=>import("./QuestionTypes/TFQuestion"))

export default function QuestionRenderer({
  question,
  value,
  onChange
}:any){

  return(

    <Suspense fallback={<p>Loading...</p>}>

      {question.type==="fill_blank" &&
        <FillBlank question={question} value={value} onChange={onChange}/>
      }

      {question.type==="mcq" &&
        <MCQ question={question} value={value} onChange={onChange}/>
      }

      {question.type==="true_false" &&
        <TrueFalse question={question} value={value} onChange={onChange}/>
      }

    </Suspense>

  )

}