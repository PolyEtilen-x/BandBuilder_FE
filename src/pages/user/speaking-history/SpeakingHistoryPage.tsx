import { useState } from "react"
import { Award, Calendar, Phone, RefreshCw, MessageSquare, ShieldAlert, CheckCircle, Clock, ArrowLeft, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import { useSpeakingHistory } from "@/hooks/useSpeakingHistory"
import { useUIStore } from "@/services/ui/ui.store"
import "./SpeakingHistory.css"

const EXAMINER_VOICES = {
  sophia: { name: "Sophia", accent: "American Accent", avatar: "S" },
  alex: { name: "Alex", accent: "British Accent", avatar: "A" },
  david: { name: "David", accent: "Australian Accent", avatar: "D" },
}

export default function SpeakingHistoryPage() {
  const navigate = useNavigate()
  const { language } = useUIStore()
  const { data: history, isLoading, error, refetch } = useSpeakingHistory()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const selectedSession = history?.find(s => s.id === selectedSessionId)

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return isoString
    }
  }

  // Helper to render user text with highlight on mispronounced words
  const renderHighlightedTextForHistory = (text: string, lowConfWords?: string[]) => {
    if (!lowConfWords || !lowConfWords.length) return text
    const words = text.split(" ")
    return words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      const isMispronounced = lowConfWords.includes(cleanWord)
      if (isMispronounced) {
        return (
          <span key={idx} className="mispronounced-word-history" title="Phát âm chưa chuẩn">
            {word}{" "}
          </span>
        )
      }
      return <span key={idx}>{word} </span>
    })
  }

  return (
    <MainLayout>
      <div className="sh-page-wrapper">
        <div className="sh-main-layout">
          {/* Sidebar */}
          <GeneralPracticeSidebar />

          {/* Main workspace */}
          <div className="sh-workspace">
            {/* If a session detail is selected */}
            {selectedSession ? (
              <div className="sh-card detail-view">
                <div className="detail-header">
                  <button onClick={() => setSelectedSessionId(null)} className="sh-back-btn">
                    <ArrowLeft size={16} /> {t("sh_back")}
                  </button>
                  <div className="header-meta">
                    <span className="date-tag">
                      <Calendar size={14} /> {formatDateTime(selectedSession.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="report-header">
                  <div>
                    <span className="report-badge">
                      {t("sh_session_details")}
                    </span>
                    <h1 className="report-title">
                      {t("sh_report_title")}
                    </h1>
                    <p className="report-subtitle">
                      {t("sh_examiner")}: {EXAMINER_VOICES[selectedSession.voiceId as keyof typeof EXAMINER_VOICES]?.name || selectedSession.voiceId} ({EXAMINER_VOICES[selectedSession.voiceId as keyof typeof EXAMINER_VOICES]?.accent || ""})
                    </p>
                  </div>

                  <div className="report-band-group">
                    <div className="report-band-label-box">
                      <span className="report-band-label">
                        {t("sh_overall_band")}
                      </span>
                      <div className="report-band-status">
                        {selectedSession.overallBand >= 7.0 ? t("sh_excellent") : t("sh_keep_improving")}
                      </div>
                    </div>
                    <div className="metric-badge">{selectedSession.overallBand}</div>
                  </div>
                </div>

                {/* Sub metrics */}
                <h2 className="report-section-title">
                  {t("sh_criteria_title")}
                </h2>
                <div className="sub-metric-grid">
                  <div className="sub-metric-card">
                    <span className="metric-label">Fluency & Coherence</span>
                    <div className="sub-metric-score">{selectedSession.fluency}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Lexical Resource</span>
                    <div className="sub-metric-score">{selectedSession.lexical}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Grammatical Range</span>
                    <div className="sub-metric-score">{selectedSession.grammar}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Pronunciation</span>
                    <div className="sub-metric-score">{selectedSession.pronunciation}</div>
                  </div>
                </div>

                {/* Transcript Dialogues */}
                <h2 className="report-section-title" style={{ marginTop: 32 }}>
                  {t("sh_transcript_title")}
                </h2>
                <div className="transcript-box-history">
                  {Array.isArray(selectedSession.dialogue) && (selectedSession.dialogue as any).map((turn: any, index: number) => {
                    const voice = EXAMINER_VOICES[selectedSession.voiceId as keyof typeof EXAMINER_VOICES] || { name: "AI", avatar: "A" }
                    return (
                      <div key={index} className={`chat-bubble-history ${turn.sender}`}>
                        <strong className="bubble-author">
                          {turn.sender === "ai" ? voice.name : t("sh_you")}
                        </strong>
                        {turn.sender === "user"
                          ? renderHighlightedTextForHistory(turn.text, turn.lowConfidenceWords || [])
                          : turn.text
                        }
                      </div>
                    )
                  })}
                </div>

                {/* AI Corrections */}
                <div className="corrections-container" style={{ marginTop: 32 }}>
                  <h3 className="corrections-title">
                    <Award size={18} style={{ color: "#3b82f6" }} />
                    {t("sh_corrections_title")}
                  </h3>
                  <div className="corrections-list">
                    {Array.isArray(selectedSession.corrections) && (selectedSession.corrections as any).length > 0 ? (
                      (selectedSession.corrections as any).map((corr: any, idx: number) => (
                        <div
                          key={idx}
                          className="correction-item"
                          style={{
                            borderLeft: `4px solid ${corr.type === "grammar" ? "#f43f5e" : corr.type === "vocab" ? "#3b82f6" : "#10b981"}`
                          }}
                        >
                          <div className="correction-header">
                            {corr.type === "grammar" && <ShieldAlert size={15} style={{ color: "#ef4444" }} />}
                            {corr.type === "vocab" && <MessageSquare size={15} style={{ color: "#3b82f6" }} />}
                            {corr.type === "positive" && <CheckCircle size={15} style={{ color: "#10b981" }} />}
                            <span style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: corr.type === "grammar" ? "#991b1b" : corr.type === "vocab" ? "#1e40af" : "#065f46"
                            }}>
                              {corr.type === "grammar"
                                ? t("sh_err_grammar")
                                : corr.type === "vocab"
                                  ? t("sh_err_vocab")
                                  : t("sh_err_pronun")
                              }
                            </span>
                          </div>
                          {corr.original && (
                            <p className="correction-original">
                              <strong>{t("sh_you_said")}</strong> <em>"{corr.original}"</em>
                            </p>
                          )}
                          {corr.correction && (
                            <p className="correction-fixed">
                              <strong>{t("sh_correction")}</strong> <em>"{corr.correction}"</em>
                            </p>
                          )}
                          <p className="correction-explanation">
                            {corr.explanation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="no-corrections-text">{t("sh_no_critical_mistakes")}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // List View of Speaking sessions
              <div className="sh-card">
                <div className="sh-header-meta">
                  <div className="sh-tag-group">
                    <span className="sh-badge-new">
                      {t("sh_history_badge")}
                    </span>
                    <span className="sh-subtitle">
                      IELTS Speaking AI Practice History
                    </span>
                  </div>
                  <button onClick={() => refetch()} className="sh-refresh-btn" title="Tải lại">
                    <RefreshCw size={15} />
                  </button>
                </div>

                <h1 className="sh-title">
                  {t("sh_history_title")}
                </h1>
                <p className="sh-desc">
                  {t("sh_history_desc")}
                </p>

                {error && (
                  <div className="sh-error-card">
                    ⚠️ {t("sh_load_error")}
                  </div>
                )}

                {isLoading ? (
                  <div className="sh-skeleton-list">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div key={idx} className="sh-skeleton-card">
                        <div className="sh-skeleton-circle"></div>
                        <div className="sh-skeleton-lines">
                          <div className="sh-skeleton-line short"></div>
                          <div className="sh-skeleton-line long"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : history && history.length === 0 ? (
                  <div className="sh-empty-state">
                    <div className="sh-empty-icon">📭</div>
                    <h3>{t("sh_empty_title")}</h3>
                    <p>
                      {t("sh_empty_desc")}
                    </p>
                    <button
                      onClick={() => navigate("/practice-general/call-with-ai")}
                      className="btn-start-call-sh"
                    >
                      <Phone size={16} /> {t("sh_start_practice")}
                    </button>
                  </div>
                ) : (
                  <div className="history-list">
                    {history?.map((session) => {
                      const voice = EXAMINER_VOICES[session.voiceId as keyof typeof EXAMINER_VOICES] || { name: session.voiceId, accent: "", avatar: "AI" }
                      return (
                        <div key={session.id} className="history-item-card">
                          <div className="item-left">
                            <div className="item-avatar">{voice.avatar}</div>
                            <div>
                              <h3 className="item-examiner-name">
                                {t("sh_examiner")} {voice.name}
                              </h3>
                              <span className="item-date">
                                <Calendar size={12} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                                {formatDateTime(session.createdAt)}
                              </span>
                            </div>
                          </div>

                          <div className="item-right">
                            <div className="score-badge">
                              <span className="score-label">IELTS BAND</span>
                              <span className="score-value">{session.overallBand}</span>
                            </div>
                            <button
                              onClick={() => setSelectedSessionId(session.id)}
                              className="btn-view-details"
                            >
                              {t("sh_view_details")}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
