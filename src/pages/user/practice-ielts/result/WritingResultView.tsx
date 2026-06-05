import { useState } from "react"
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, FileText, BarChart3, TrendingUp } from "lucide-react"

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
    if (score >= 7.5) return "#22c55e" // green
    if (score >= 5.5) return "#3b82f6" // blue
    return "#eab308" // yellow
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {/* 2-Column Responsive Layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px"
      }}>
        {/* LEFT COLUMN: Essay and Overall Feedback */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Essay Card */}
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>
                <FileText size={18} style={{ color: "#3b82f6" }} />
                <span>{language === "vi" ? "Bài viết của bạn" : "Your Submitted Essay"}</span>
              </div>
              <span style={{
                background: "#f1f5f9",
                color: "#475569",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600
              }}>
                {wordCount} {language === "vi" ? "từ" : "words"}
              </span>
            </div>
            <div style={{
              background: "#f8fafc",
              padding: "16px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#334155",
              whiteSpace: "pre-wrap",
              maxHeight: "350px",
              overflowY: "auto",
              border: "1px solid #e2e8f0"
            }}>
              {essay}
            </div>
          </div>

          {/* AI Overall Feedback Card */}
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#1e293b", fontSize: "16px" }}>
              <Sparkles size={18} style={{ color: "#e11d48" }} />
              <span>{language === "vi" ? "Nhận xét tổng quan của Giám khảo AI" : "AI Examiner's Overall Feedback"}</span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569", margin: 0 }}>
              {overallFeedback}
            </p>

            {/* Strengths & Weaknesses */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginTop: "8px"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={14} /> {language === "vi" ? "Điểm mạnh chính" : "Key Strengths"}
                </span>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                  {strengths.map((str: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{str}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626", display: "flex", alignItems: "center", gap: "6px" }}>
                  <AlertTriangle size={14} /> {language === "vi" ? "Điểm cần khắc phục" : "Key Weaknesses"}
                </span>
                <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                  {weaknesses.map((weak: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Criteria Breakdowns & Action Plan */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Summary Band Score Card */}
          <div style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)",
            borderRadius: "20px",
            padding: "24px",
            color: "#ffffff",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div>
              <span style={{ fontSize: "13px", color: "#93c5fd", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {language === "vi" ? "Điểm số ước lượng" : "Estimated Band Score"}
              </span>
              <h2 style={{ fontSize: "28px", fontWeight: 800, margin: "4px 0 0 0" }}>
                {language === "vi" ? `IELTS Writing Task ${isTask1 ? "1" : "2"}` : `IELTS Writing Task ${isTask1 ? "1" : "2"}`}
              </h2>
            </div>
            <div style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(4px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255, 255, 255, 0.2)"
            }}>
              <span style={{ fontSize: "22px", fontWeight: 900 }}>{band}</span>
              <span style={{ fontSize: "10px", fontWeight: 600, opacity: 0.8 }}>BAND</span>
            </div>
          </div>

          {/* Criteria Accordions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#1e293b", fontSize: "16px", marginBottom: "4px" }}>
              <BarChart3 size={18} style={{ color: "#3b82f6" }} />
              <span>{language === "vi" ? "Đánh giá chi tiết 4 tiêu chí" : "Detailed Criteria Breakdown"}</span>
            </div>

            {criteriaList.map((crit) => {
              const isOpen = activeCriterion === crit.key
              const scoreColor = getBandColor(crit.score)

              return (
                <div key={crit.key} style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: isOpen ? "1px solid #cbd5e1" : "1px solid #f1f5f9",
                  boxShadow: isOpen ? "0 4px 12px rgba(0,0,0,0.05)" : "0 2px 4px rgba(0,0,0,0.02)",
                  overflow: "hidden",
                  transition: "all 0.2s"
                }}>
                  {/* Header Row */}
                  <div
                    onClick={() => setActiveCriterion(isOpen ? null : crit.key)}
                    style={{
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      background: isOpen ? "#f8fafc" : "#ffffff",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{
                        background: scoreColor,
                        color: "#ffffff",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        fontWeight: 800,
                        fontSize: "13px"
                      }}>
                        {crit.score}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}>{crit.title}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} style={{ color: "#64748b" }} /> : <ChevronDown size={16} style={{ color: "#64748b" }} />}
                  </div>

                  {/* Accordion Body */}
                  {isOpen && (
                    <div style={{
                      padding: "20px",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px"
                    }}>
                      {/* Rationale */}
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                          {language === "vi" ? "Lý giải điểm số (Rationale)" : "Rationale"}
                        </div>
                        <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: "#334155", margin: 0 }}>
                          {crit.rationale}
                        </p>
                      </div>

                      {/* Examples */}
                      {crit.examples && crit.examples.trim() !== "" && (
                        <div style={{ background: "#fff5f5", borderLeft: "4px solid #ef4444", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#b91c1c", textTransform: "uppercase", marginBottom: "4px" }}>
                            {language === "vi" ? "Lỗi sai ví dụ & Sửa lại" : "Mistake Examples & Corrections"}
                          </div>
                          <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#7f1d1d", margin: 0, whiteSpace: "pre-wrap" }}>
                            {crit.examples}
                          </p>
                        </div>
                      )}

                      {/* Suggestions */}
                      {crit.suggestions && crit.suggestions.trim() !== "" && (
                        <div style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", marginBottom: "4px" }}>
                            {language === "vi" ? "Gợi ý cải thiện" : "Improvement Suggestions"}
                          </div>
                          <p style={{ fontSize: "13px", lineHeight: 1.5, color: "#1e3a8a", margin: 0, whiteSpace: "pre-wrap" }}>
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
          <div style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#1e293b", fontSize: "16px", marginBottom: "16px" }}>
              <TrendingUp size={18} style={{ color: "#10b981" }} />
              <span>{language === "vi" ? "Kế hoạch cải thiện ưu tiên" : "Priority Action Plan"}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {improvements.map((imp: string, idx: number) => (
                <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <div style={{
                    background: "#e6f4ea",
                    color: "#137333",
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "2px"
                  }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#334155", margin: 0, lineHeight: 1.5 }}>
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
        <div style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          border: "1px solid #f1f5f9",
          marginTop: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#1e293b", fontSize: "16px", marginBottom: "16px" }}>
            <Lightbulb size={18} style={{ color: "#eab308" }} />
            <span>{language === "vi" ? "Phân tích biểu đồ và số liệu" : "Chart Data & Overview Analysis"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>
                {language === "vi" ? "Độ chính xác dữ liệu (Data Accuracy):" : "Data Accuracy Details:"}
              </span>
              <p style={{ fontSize: "13.5px", color: "#334155", margin: "4px 0 0 0", lineHeight: 1.6 }}>
                {evaluation.task1ImageFeedback.data_accuracy}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>
                {language === "vi" ? "Đã có đoạn mô tả chung (Overview present):" : "Overview paragraph present:"}
              </span>
              <span style={{
                background: evaluation.task1ImageFeedback.overview_present ? "#e6f4ea" : "#fce8e6",
                color: evaluation.task1ImageFeedback.overview_present ? "#137333" : "#c5221f",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 700
              }}>
                {evaluation.task1ImageFeedback.overview_present
                  ? (language === "vi" ? "Đầy đủ" : "Yes")
                  : (language === "vi" ? "Thiếu / Chưa rõ ràng" : "No / Weak")}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "4px" }}>
              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#16a34a" }}>
                  {language === "vi" ? "Đặc điểm chính đã mô tả" : "Key Features Described"}
                </span>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                  {(evaluation.task1ImageFeedback.key_features_covered || []).map((feat: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#dc2626" }}>
                  {language === "vi" ? "Đặc điểm chính bị bỏ sót" : "Key Features Missed"}
                </span>
                <ul style={{ margin: "6px 0 0 0", paddingLeft: "16px", fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>
                  {(evaluation.task1ImageFeedback.key_features_missed || []).map((feat: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>{feat}</li>
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
