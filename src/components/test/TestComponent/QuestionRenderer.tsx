import { lazy,Suspense } from "react"

const FillBlank = lazy(()=>import("../QuestionTypes/FillBlankQuestion"))
const MCQ = lazy(()=>import("../QuestionTypes/MCQQuestion"))
const TrueFalse = lazy(()=>import("../QuestionTypes/TFQuestion"))

const MatchingFeatures = lazy(()=>import("../QuestionTypes/MatchingQuestion"))
const TableCompletion = lazy(()=>import("../QuestionTypes/TableComQuestion"))
const SelectingFactors = lazy(()=>import("../QuestionTypes/SelectingFactorsQuestion"))
const CauseEffect = lazy(()=>import("../QuestionTypes/MatchingCauseEffectQuestion"))

export default function QuestionRenderer({
  question,
  type,
  value,
  onChange,
  extra
}:any){

  return(

    <Suspense fallback={<p>Loading...</p>}>

      {/* summary_completion */}
      {type==="summary_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra}/>
      )}

      {/* multiple_choice */}
      {type==="multiple_choice" && (
        <MCQ question={question} value={value} onChange={onChange} extra={extra}/>
      )}


      {/* yes_no_not_given */}
      {type==="yes_no_not_given" && (
        <TrueFalse question={question} value={value} onChange={onChange} type={type}/>
      )}

      {/* true_false_not_given */}
      {type==="true_false_not_given" && (
        <TrueFalse question={question} value={value} onChange={onChange} type={type}/>
      )}


      {/* matching_features */}
      {type==="matching_features" && (
        <MatchingFeatures
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
        />
      )}

      {/* table_completion */}
      {type==="table_completion" && (
        <TableCompletion
          question={question}
          headers={extra?.table_headers || []}
          value={value}
          onChange={onChange}
        />
      )}

      {/* selecting_factors */}
      {type==="selecting_factors" && (
        <SelectingFactors
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
        />
      )}

      {/* matching_cause_effect */}
      {type==="matching_cause_effect" && (
        <CauseEffect
          question={question}
          effects={extra?.effects || []}
          value={value}
          onChange={onChange}
        />
      )}

      {/* form_completion */}
      {type==="form_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra}/>
      )}

      {/* note_completion */}
      {type==="note_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra}/>
      )}

      {/* sentence_completion */}
      {type==="sentence_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra}/>
      )}

      {/* short_answer */}
      {type==="short_answer" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra}/>
      )}

      {/* matching (listening) */}
      {type==="matching" && (
        <MatchingFeatures
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
        />
      )}
    </Suspense>
  )
}