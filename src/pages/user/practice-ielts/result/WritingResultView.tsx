import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import "./WritingResultView.css"

interface Props {
  evaluation: any
  language: "vi" | "en"
}

export default function WritingResultView({ evaluation, language }: Props) {
  const [activeCriterion, setActiveCriterion] = useState<string | null>("task")

  if (!evaluation) return null

  // Determine if it is Task 1 or Task 2
  const isTask1 = !!evaluation.task1Essay
  const prefix = isTask1 ? "task1" : "task2"

  const band = evaluation[`${prefix}Band`]
  const essay = evaluation[`${prefix}Essay`]
  const wordCount = evaluation[`${prefix}WordCount`]
  const overallFeedback = evaluation[`${prefix}OverallFeedback`]
  const strengths = evaluation[`${prefix}KeyStrengths`] || []
  const weaknesses = evaluation[`${prefix}KeyWeaknesses`] || []
  const improvements = evaluation[`${prefix}PriorityImprovements`] || []

  // Criteria data mapping
  const criteriaList = [
    {
      key: "task",
      title: isTask1
        ? (language === "vi" ? "Task Achievement (Hoàn thành yêu cầu)" : "Task Achievement")
        : (language === "vi" ? "Task Response (Trả lời câu hỏi)" : "Task Response"),
      score: evaluation[`${prefix}${isTask1 ? "TaskAchievement" : "TaskResponse"}`],
      rationale: evaluation[`${prefix}${isTask1 ? "TaskAchievement" : "TaskResponse"}Rationale`],
      examples: evaluation[`${prefix}${isTask1 ? "TaskAchievement" : "TaskResponse"}Examples`],
      suggestions: evaluation[`${prefix}${isTask1 ? "TaskAchievement" : "TaskResponse"}Suggestions`],
    },
    {
      key: "coherence",
      title: language === "vi" ? "Coherence & Cohesion (Mạch lạc & Liên kết)" : "Coherence & Cohesion",
      score: evaluation[`${prefix}CoherenceCohesion`],
      rationale: evaluation[`${prefix}CoherenceCohesionRationale`],
      examples: evaluation[`${prefix}CoherenceCohesionExamples`],
      suggestions: evaluation[`${prefix}CoherenceCohesionSuggestions`],
    },
    {
      key: "lexical",
      title: language === "vi" ? "Lexical Resource (Vốn từ vựng)" : "Lexical Resource",
      score: evaluation[`${prefix}LexicalResource`],
      rationale: evaluation[`${prefix}LexicalResourceRationale`],
      examples: evaluation[`${prefix}LexicalResourceExamples`],
      suggestions: evaluation[`${prefix}LexicalResourceSuggestions`],
    },
    {
      key: "grammar",
      title: language === "vi" ? "Grammatical Range & Accuracy (Ngữ pháp)" : "Grammatical Range & Accuracy",
      score: evaluation[`${prefix}GrammaticalRange`],
      rationale: evaluation[`${prefix}GrammaticalRangeRationale`],
      examples: evaluation[`${prefix}GrammaticalRangeExamples`],
      suggestions: evaluation[`${prefix}GrammaticalRangeSuggestions`],
    },
  ]

  const getBandColor = (score: number) => {
    if (score >= 7.5) return "#10b981" // green matching theme
    if (score >= 5.5) return "#174593" // blue matching theme
    return "#f59e0b" // orange/yellow matching theme
  }

  return (
    <div className="writing-result-container">
      {/* 2-Column Grid */}
      <div className="writing-result-grid">
        {/* LEFT COLUMN: Essay and Overall Feedback */}
        <div className="writing-left-col">
          {/* Essay Card */}
          <div className="writing-card">
            <div className="writing-card-header">
              <h3 className="writing-card-title">
                {language === "vi" ? "Bài viết của bạn" : "Your Submitted Essay"}
              </h3>
              <span className="word-count-badge">
                {wordCount} {language === "vi" ? "từ" : "words"}
              </span>
            </div>
            <div className="essay-display">
              {essay}
            </div>
          </div>

          {/* AI Overall Feedback Card */}
          <div className="writing-card">
            <h3 className="writing-card-title" style={{ marginBottom: "12px" }}>
              {language === "vi" ? "Nhận xét tổng quan của Giám khảo" : "Overall Feedback"}
            </h3>
            <p className="criterion-text">
              {overallFeedback}
            </p>

            {/* Strengths & Weaknesses */}
            <div className="strengths-weaknesses-grid">
              <div>
                <span className="strength-title">
                  {language === "vi" ? "Điểm mạnh chính" : "Key Strengths"}
                </span>
                <ul className="bullet-list">
                  {strengths.map((str: string, idx: number) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="weakness-title">
                  {language === "vi" ? "Điểm cần khắc phục" : "Key Weaknesses"}
                </span>
                <ul className="bullet-list">
                  {weaknesses.map((weak: string, idx: number) => (
                    <li key={idx}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Criteria Breakdowns & Action Plan */}
        <div className="writing-right-col">
          {/* Summary Band Score Card */}
          <div className="band-score-hero-card">
            <div>
              <span className="band-score-hero-title">
                {language === "vi" ? "Điểm số ước lượng" : "Estimated Band Score"}
              </span>
              <h2 className="band-score-hero-sub">
                {language === "vi" ? `Writing Task ${isTask1 ? "1" : "2"}` : `Writing Task ${isTask1 ? "1" : "2"}`}
              </h2>
            </div>
            <div className="band-score-badge-circle">
              <span className="band-score-badge-number">{band}</span>
              <span className="band-score-badge-label">BAND</span>
            </div>
          </div>

          {/* Criteria Accordions */}
          <div>
            <h3 className="criteria-section-title">
              {language === "vi" ? "Đánh giá chi tiết 4 tiêu chí" : "Detailed Criteria Breakdown"}
            </h3>

            {criteriaList.map((crit) => {
              const isOpen = activeCriterion === crit.key
              const scoreColor = getBandColor(crit.score)

              return (
                <div key={crit.key} className={`criterion-accordion ${isOpen ? "open" : ""}`}>
                  {/* Header Row */}
                  <div
                    onClick={() => setActiveCriterion(isOpen ? null : crit.key)}
                    className="criterion-header"
                  >
                    <div className="criterion-header-left">
                      <span className="criterion-score-badge" style={{ background: scoreColor }}>
                        {crit.score}
                      </span>
                      <span className="criterion-title-text">{crit.title}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} style={{ color: "#64748b" }} /> : <ChevronDown size={16} style={{ color: "#64748b" }} />}
                  </div>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div className="criterion-body">
                      {/* Rationale */}
                      <div>
                        <div className="criterion-subtitle">
                          {language === "vi" ? "Lý giải điểm số (Rationale)" : "Rationale"}
                        </div>
                        <p className="criterion-text">
                          {crit.rationale}
                        </p>
                      </div>

                      {/* Examples */}
                      {crit.examples && crit.examples.trim() !== "" && (
                        <div className="criterion-examples-block">
                          <div className="criterion-examples-title">
                            {language === "vi" ? "Lỗi sai ví dụ & Sửa lại" : "Mistake Examples & Corrections"}
                          </div>
                          <p className="criterion-examples-text">
                            {crit.examples}
                          </p>
                        </div>
                      )}

                      {/* Suggestions */}
                      {crit.suggestions && crit.suggestions.trim() !== "" && (
                        <div className="criterion-suggestions-block">
                          <div className="criterion-suggestions-title">
                            {language === "vi" ? "Gợi ý cải thiện" : "Improvement Suggestions"}
                          </div>
                          <p className="criterion-suggestions-text">
                            {crit.suggestions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* AI Action Plan Card */}
          <div className="writing-card">
            <h3 className="writing-card-title" style={{ marginBottom: "16px" }}>
              {language === "vi" ? "Kế hoạch cải thiện ưu tiên" : "Priority Action Plan"}
            </h3>
            <div className="priority-list">
              {improvements.map((imp: string, idx: number) => (
                <div key={idx} className="priority-item">
                  <div className="priority-index">
                    {idx + 1}
                  </div>
                  <p className="priority-text">
                    {imp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task 1 Image Feedback details (if present) */}
      {isTask1 && evaluation.task1ImageFeedback && (
        <div className="writing-card" style={{ marginTop: "12px" }}>
          <h3 className="writing-card-title" style={{ marginBottom: "16px" }}>
            {language === "vi" ? "Phân tích biểu đồ và số liệu" : "Chart Data & Overview Analysis"}
          </h3>

          <div className="chart-analysis-row">
            <div className="chart-analysis-item">
              <span className="chart-analysis-label">
                {language === "vi" ? "Độ chính xác dữ liệu (Data Accuracy):" : "Data Accuracy Details:"}
              </span>
              <p className="chart-analysis-text">
                {evaluation.task1ImageFeedback.data_accuracy}
              </p>
            </div>

            <div className="chart-overview-status">
              <span className="chart-analysis-label">
                {language === "vi" ? "Đoạn mô tả chung (Overview):" : "Overview paragraph present:"}
              </span>
              <span className={`chart-overview-badge ${evaluation.task1ImageFeedback.overview_present ? "success" : "failed"}`}>
                {evaluation.task1ImageFeedback.overview_present
                  ? (language === "vi" ? "Đầy đủ" : "Yes")
                  : (language === "vi" ? "Thiếu / Chưa rõ ràng" : "No / Weak")}
              </span>
            </div>

            <div className="chart-features-grid">
              <div>
                <span className="chart-features-covered-title">
                  {language === "vi" ? "Đặc điểm chính đã mô tả" : "Key Features Described"}
                </span>
                <ul className="bullet-list" style={{ marginTop: "6px" }}>
                  {(evaluation.task1ImageFeedback.key_features_covered || []).map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="chart-features-missed-title">
                  {language === "vi" ? "Đặc điểm chính bị bỏ sót" : "Key Features Missed"}
                </span>
                <ul className="bullet-list" style={{ marginTop: "6px" }}>
                  {(evaluation.task1ImageFeedback.key_features_missed || []).map((feat: string, idx: number) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
