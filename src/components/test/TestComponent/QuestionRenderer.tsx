import { lazy, Suspense } from "react"

const FillBlank = lazy(() => import("../QuestionTypes/FillBlankQuestion"))
const MCQ = lazy(() => import("../QuestionTypes/MCQQuestion"))
const TrueFalse = lazy(() => import("../QuestionTypes/TFQuestion"))

const MatchingFeatures = lazy(() => import("../QuestionTypes/MatchingQuestion"))
const TableCompletion = lazy(() => import("../QuestionTypes/TableComQuestion"))
const SelectingFactors = lazy(() => import("../QuestionTypes/SelectingFactorsQuestion"))
const CauseEffect = lazy(() => import("../QuestionTypes/MatchingCauseEffectQuestion"))

export default function QuestionRenderer({
  question,
  type,
  value,
  onChange,
  extra,
  isReview = false
}: any) {

  return (

    <Suspense fallback={<p>Loading...</p>}>

      {/* summary_completion */}
      {type === "summary_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}

      {/* multiple_choice */}
      {type === "multiple_choice" && (
        <MCQ question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}


      {/* yes_no_not_given */}
      {type === "yes_no_not_given" && (
        <TrueFalse question={question} value={value} onChange={onChange} type={type} isReview={isReview} />
      )}

      {/* true_false_not_given */}
      {type === "true_false_not_given" && (
        <TrueFalse question={question} value={value} onChange={onChange} type={type} isReview={isReview} />
      )}


      {/* matching_features */}
      {type === "matching_features" && (
        <MatchingFeatures
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
          isReview={isReview}
        />
      )}

      {/* table_completion */}
      {type === "table_completion" && (
        <TableCompletion
          question={question}
          headers={extra?.table_headers || []}
          value={value}
          onChange={onChange}
          isReview={isReview}
        />
      )}

      {/* selecting_factors */}
      {type === "selecting_factors" && (
        <SelectingFactors
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
          isReview={isReview}
        />
      )}

      {/* matching_cause_effect */}
      {type === "matching_cause_effect" && (
        <CauseEffect
          question={question}
          effects={extra?.effects || []}
          value={value}
          onChange={onChange}
          isReview={isReview}
        />
      )}

      {/* form_completion */}
      {type === "form_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}

      {/* note_completion */}
      {type === "note_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}

      {/* sentence_completion */}
      {type === "sentence_completion" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}

      {/* short_answer */}
      {type === "short_answer" && (
        <FillBlank question={question} value={value} onChange={onChange} extra={extra} isReview={isReview} />
      )}

      {/* matching (listening) */}
      {type === "matching" && (
        <MatchingFeatures
          question={question}
          options={extra?.options || []}
          value={value}
          onChange={onChange}
          isReview={isReview}
        />
      )}
    </Suspense>
  )
}