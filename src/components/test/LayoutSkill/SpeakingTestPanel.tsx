import { useState, useEffect, useRef } from "react"
import { useSpeakingStore } from "@/services/speaking/speaking.store"
import { useAudioCall } from "@/hooks/useAudioCall"
import { useUIStore } from "@/services/ui/ui.store"
import { practiceApi } from "@/api/practice/practice.api"
import { useNavigate } from "react-router-dom"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Award, CheckCircle, RefreshCw, Sparkles, HelpCircle, BookOpen, Clock, Loader2, Server, Cpu } from "lucide-react"
import "./SpeakingTestPanel.css"

type Props = {
  test: any
  content: any
  mode?: "exam" | "practice"
  isReview?: boolean
}

export default function SpeakingTestPanel({
  test,
  content,
  mode = "practice",
  isReview = false,
}: Props) {
  const navigate = useNavigate()
  const { language } = useUIStore()

  // 1. Live Socket speaking store hook
  const {
    isConnected,
    callState,
    selectedVoiceId,
    dialogue,
    timer,
    isMuted,
    isSpeakerOn,
    overallBand,
    metrics,
    corrections,
    isEvaluating,
    initSocket,
    startCall,
    stopRecording,
    hangUp,
    setMuted,
    setSpeakerOn,
    incrementTimer,
    resetStore
  } = useSpeakingStore()

  // Initialize socket on mount
  useEffect(() => {
    initSocket()
    return () => {
      resetStore()
    }
  }, [initSocket, resetStore])

  // 2. Real-time microphone and VAD recorder hook
  const waveRef = useRef<HTMLDivElement | null>(null)
  const { isRecording, isSpeaking } = useAudioCall({
    onVolumeChange: (volume) => {
      if (waveRef.current) {
        const bars = waveRef.current.querySelectorAll(".wave-bar")
        const baseScale = isRecording ? Math.min(1 + volume * 9, 3.5) : 1
        const scales = [0.7, 1.5, 2.3, 1.3, 0.8]
        bars.forEach((bar, idx) => {
          const scaleY = baseScale * (scales[idx] || 1)
            ; (bar as HTMLElement).style.transform = `scaleY(${scaleY})`
        })
      }
    }
  })

  // Active call duration runner
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => {
        incrementTimer()
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState, incrementTimer])

  // UI Tabs (Left side: Prompt vs Hint & Samples)
  const [leftTab, setLeftTab] = useState<"prompt" | "support">("prompt")
  const [hintData, setHintData] = useState<any>(null)
  const [loadingHint, setLoadingHint] = useState(false)
  const [sampleAnswer, setSampleAnswer] = useState<any>(null)
  const [loadingSample, setLoadingSample] = useState(false)
  const [sampleBand, setSampleBand] = useState<number | null>(null)
  const [supportError, setSupportError] = useState<string | null>(null)

  // Fetch Speaking Hints when clicking on support tab
  useEffect(() => {
    if (leftTab === "support" && !hintData && test?.skillContentId) {
      setLoadingHint(true)
      setSupportError(null)
      // Use the prompt ID or default fallback "speaking_prompt"
      const questionId = content?.questionId || "speaking_prompt"
      practiceApi.getSpeakingHint(test.skillContentId, questionId)
        .then((res) => {
          setHintData(res.data)
        })
        .catch((err) => {
          console.warn("No hints available for this speaking question:", err)
        })
        .finally(() => {
          setLoadingHint(false)
        })
    }
  }, [leftTab, hintData, test?.skillContentId, content?.questionId])

  // Fetch Sample Answer for a specific Band
  const handleFetchSample = (band: number) => {
    if (!test?.skillContentId) return
    setLoadingSample(true)
    setSampleBand(band)
    setSupportError(null)
    const questionId = content?.questionId || "speaking_prompt"

    // Warn user about credit deduction in Vietnamese
    const confirmView = window.confirm(
      language === "vi"
        ? `Xem bài mẫu Band ${band} sẽ tốn 1 credit (nếu là lần đầu tiên). Bạn có chắc chắn muốn xem?`
        : `Viewing Band ${band} sample answer costs 1 credit (on first view). Do you want to proceed?`
    )
    if (!confirmView) {
      setLoadingSample(false)
      return
    }

    practiceApi.getSpeakingSample(test.skillContentId, questionId, band)
      .then((res) => {
        setSampleAnswer(res.data)
      })
      .catch((err) => {
        const errorMsg = err?.response?.data?.message || err.message
        setSupportError(
          language === "vi"
            ? `Không thể tải bài mẫu: ${errorMsg}`
            : `Failed to load sample answer: ${errorMsg}`
        )
      })
      .finally(() => {
        setLoadingSample(false)
      })
  }

  // Submit Skill Attempt to NestJS database
  const [submittingExam, setSubmittingExam] = useState(false)
  const handleSubmitExam = async () => {
    if (!test?.id) return
    setSubmittingExam(true)
    try {
      await practiceApi.submitSkillAnswers(test.id, "speaking", {
        answers: [],
        timeSpentSec: timer,
      })
      alert(language === "vi" ? "Nộp bài thi nói thành công!" : "Speaking test submitted successfully!")
      navigate(`/practice-ielts/result/${test.id}`)
    } catch (err) {
      console.error("Failed to submit speaking exam:", err)
      alert(language === "vi" ? "Lỗi khi nộp bài thi. Vui lòng thử lại." : "Failed to submit exam. Please try again.")
    } finally {
      setSubmittingExam(false)
    }
  }

  // Start Call Handler
  const handleStartCall = () => {
    // Pass topic and scenario as session context for the AI Examiner
    const context = {
      topic: content?.topic || "IELTS Speaking Practice",
      scenario: content?.scenario || "",
      prompts: content?.candidate_prompts || [],
    }
    startCall("sophia", context)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // Helper to render user's text with highlight on mispronounced words
  const renderHighlightedText = (text: string, lowConfWords?: string[]) => {
    if (!lowConfWords || !lowConfWords.length) return text
    const words = text.split(" ")
    return words.map((word, idx) => {
      const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      const isMispronounced = lowConfWords.includes(cleanWord)
      if (isMispronounced) {
        return (
          <span key={idx} className="mispronounced-word" title="Phát âm chưa chuẩn">
            {word}{" "}
          </span>
        )
      }
      return <span key={idx}>{word} </span>
    })
  }

  return (
    <div className="practice-container speaking-exam-layout">
      {/* HEADER */}
      <div className="practice-header">
        <div>{test?.source || "IELTS Speaking Simulator"} {isReview && "(Reviewing)"}</div>
        <div className="practice-badge" style={{ background: "#2563eb" }}>Speaking Part {content?.part || 3}</div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="practice-main speaking-split-panel">

        {/* LEFT SIDEBAR: Prompt Details or Practice Aids */}
        <div className="practice-left speaking-left-prompt">

          {/* TAB HEADERS */}
          <div className="exam-tabs" style={{ marginBottom: 20 }}>
            <button
              className={leftTab === "prompt" ? "active" : ""}
              onClick={() => setLeftTab("prompt")}
            >
              <BookOpen size={16} />
              {language === "vi" ? "Đề bài Speaking" : "Speaking Prompt"}
            </button>
            {mode === "practice" && (
              <button
                className={leftTab === "support" ? "active" : ""}
                onClick={() => setLeftTab("support")}
              >
                <Sparkles size={16} style={{ color: "#eab308" }} />
                {language === "vi" ? "Gợi ý & Bài mẫu" : "Aids & Samples"}
              </button>
            )}
          </div>

          <div className="speaking-left-content" style={{ padding: "0 10px", overflowY: "auto", height: "calc(100% - 60px)" }}>
            {leftTab === "prompt" ? (
              <div className="speaking-prompt-card">
                <span className="section-meta-tag">TOPIC</span>
                <h3 className="speaking-topic-title" style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", margin: "6px 0 16px 0" }}>
                  {content?.topic || "General Discussion"}
                </h3>

                {content?.scenario && (
                  <div className="speaking-scenario-box" style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", padding: 16, borderRadius: 16, marginBottom: 20 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Scenario (Tình huống)</h4>
                    <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", margin: 0 }}>{content.scenario}</p>
                  </div>
                )}

                {content?.candidate_prompts && content.candidate_prompts.length > 0 && (
                  <div className="speaking-prompts-list" style={{ marginBottom: 24 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>
                      {language === "vi" ? "Các gợi ý bạn cần nói (Candidate Prompts):" : "Prompts to cover in your speech:"}
                    </h4>
                    <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      {content.candidate_prompts.map((prompt: string, idx: number) => (
                        <li key={idx} style={{ fontSize: "14px", color: "#334155", lineHeight: "1.5" }}>
                          <strong>{prompt}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {content?.examiner_notes?.clubs && (
                  <div className="speaking-notes-box" style={{ marginTop: 24 }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>Examiner Notes (Thông tin tham khảo):</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {content.examiner_notes.clubs.map((club: any, idx: number) => (
                        <div key={idx} style={{ background: "#eff6ff", borderLeft: "4px solid #3b82f6", padding: 12, borderRadius: "0 12px 12px 0" }}>
                          <span style={{ fontSize: "13px", fontWeight: 800, color: "#1e40af" }}>{club.name}</span>
                          <p style={{ fontSize: "12px", color: "#475569", margin: "4px 0 0 0", lineHeight: "1.5" }}>{club.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // PRACTICE AIDS TAB (Hints & Samples)
              <div className="speaking-support-card">
                {/* 1. Hints Section */}
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>💡 Từ vựng & Ngữ pháp gợi ý:</h4>
                {loadingHint ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: "13px", padding: 10 }}>
                    <Loader2 size={16} className="animate-spin" /> {language === "vi" ? "Đang tải gợi ý..." : "Loading hints..."}
                  </div>
                ) : hintData ? (
                  <div className="hints-display" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: 16, borderRadius: 16, marginBottom: 24 }}>
                    {hintData.hints && hintData.hints.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#15803d", display: "block", marginBottom: 4 }}>TỪ VỰNG GỢI Ý</span>
                        <ul style={{ paddingLeft: 16, margin: 0, fontSize: "13px", color: "#166534" }}>
                          {hintData.hints.map((h: string, idx: number) => <li key={idx}>{h}</li>)}
                        </ul>
                      </div>
                    )}
                    {hintData.grammar_features && (
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: 800, color: "#15803d", display: "block", marginBottom: 4 }}>CẤU TRÚC NGỮ PHÁP</span>
                        <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>{hintData.grammar_features}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize: "13px", color: "#94a3b8", fontStyle: "italic", padding: "0 10px 20px 10px" }}>
                    {language === "vi" ? "Không có gợi ý cụ thể cho đề này." : "No hints found for this prompt."}
                  </p>
                )}

                {/* 2. Sample Answer Section */}
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>🎓 Câu trả lời mẫu (Sample Answers):</h4>
                <div className="band-selector-row" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[6, 7, 8, 9].map((band) => (
                    <button
                      key={band}
                      onClick={() => handleFetchSample(band)}
                      disabled={loadingSample && sampleBand === band}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: sampleBand === band ? "2px solid #2563eb" : "1px solid #cbd5e1",
                        background: sampleBand === band ? "#eff6ff" : "#fff",
                        color: sampleBand === band ? "#2563eb" : "#475569",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 4
                      }}
                    >
                      {loadingSample && sampleBand === band && <Loader2 size={12} className="animate-spin" />}
                      Band {band}
                    </button>
                  ))}
                </div>

                {supportError && (
                  <div style={{ color: "#ef4444", fontSize: "13px", padding: 10, background: "#fef2f2", borderRadius: 8, marginBottom: 16 }}>
                    ⚠️ {supportError}
                  </div>
                )}

                {sampleAnswer && (
                  <div className="sample-answer-display" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: 16, borderRadius: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#2563eb" }}>BÀI NÓI MẪU (BAND {sampleAnswer.band})</span>
                      {sampleAnswer.charged && <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 700 }}>-1 Credit</span>}
                    </div>
                    <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#334155", marginBottom: 12, fontStyle: "italic" }}>
                      "{sampleAnswer.answerText}"
                    </p>
                    {sampleAnswer.tip && (
                      <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10 }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#475569" }}>LỜI KHUYÊN EXAMINER TIP</span>
                        <p style={{ fontSize: "12.5px", color: "#475569", margin: "2px 0 0 0" }}>{sampleAnswer.tip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: AI Examiner Call Screen */}
        <div className="practice-right speaking-right-call">

          {/* IDLE / START SCREEN */}
          {callState === "idle" && (
            <div className="call-card speaking-exam-card-wrapper" style={{ border: "none", boxShadow: "none", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 20 }}>
              <div className="pulse-circle">
                <div className="pulse-ring-1"></div>
                <div className="avatar-ring">
                  <div className="avatar-inner">S</div>
                </div>
              </div>
              <h3 className="speaking-panel-title" style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b", margin: "20px 0 8px 0" }}>
                {language === "vi" ? "Giám Khảo AI Sophia" : "AI Examiner Sophia"}
              </h3>
              <p style={{ fontSize: "14px", color: "#64748b", textAlign: "center", maxWidth: "80%", marginBottom: 30, lineHeight: 1.5 }}>
                {language === "vi"
                  ? "Bấm nút bắt đầu để kết nối cuộc gọi. Giám khảo AI sẽ hỏi các câu hỏi xoay quanh chủ đề của bài thi IELTS."
                  : "Click start to connect your call. The AI Examiner will ask questions based on this IELTS Speaking prompt."}
              </p>

              <button
                onClick={handleStartCall}
                className="btn-start-call hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
              >
                <Phone size={18} />
                {language === "vi" ? "Bắt Đầu Thi Nói" : "Start Speaking Test"}
              </button>
            </div>
          )}

          {/* CONNECTING / DIALING SCREEN */}
          {callState === "calling" && (
            <div className="call-card active-call-theme" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="pulse-circle">
                <div className="pulse-ring-1"></div>
                <div className="pulse-ring-2"></div>
                <div className="avatar-ring">
                  <div className="avatar-inner">S</div>
                </div>
              </div>
              <h2 className="dial-title">Sophia</h2>
              <p className="dial-status">
                {language === "vi" ? "ĐANG KẾT NỐI GIÁM KHẢO..." : "CONNECTING TO EXAMINER..."}
              </p>
              <div className="controls-panel dial-controls">
                <button onClick={hangUp} className="btn-circle btn-hangup" disabled={isEvaluating}>
                  <PhoneOff size={24} />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE SPEAKING SCREEN */}
          {(callState === "active" || (callState === "thinking" && !isEvaluating)) && (
            <div className="call-card active-call-theme" style={{ height: "100%", justifyContent: "space-between", padding: "30px 20px" }}>

              <div className="call-active-header">
                <span className="call-active-status" style={{ color: isRecording ? (isSpeaking ? "#10b981" : "#3b82f6") : callState === "thinking" ? "#f59e0b" : "#64748b" }}>
                  <span className={`call-active-indicator ${isRecording ? (isSpeaking ? "recording" : "listening") : callState === "thinking" ? "thinking" : ""}`} style={{ background: isRecording ? (isSpeaking ? "#10b981" : "#3b82f6") : callState === "thinking" ? "#f59e0b" : "#64748b" }}></span>
                  {isConnected
                    ? (isRecording
                      ? (isSpeaking
                        ? (language === "vi" ? "BẠN ĐANG NÓI..." : "SPEAK NOW...")
                        : (language === "vi" ? "ĐANG NGHE (Hãy nói)..." : "LISTENING (Speak now)...")
                      )
                      : callState === "thinking"
                        ? (language === "vi" ? "AI ĐANG XỬ LÝ..." : "AI IS PROCESSING...")
                        : (language === "vi" ? "AI ĐANG NÓI..." : "AI IS SPEAKING...")
                    )
                    : (language === "vi" ? "MÔ PHỎNG" : "SIMULATING")
                  }
                </span>
                <span className="call-active-timer">
                  {formatTime(timer)}
                </span>
              </div>

              <div className="speaking-active-middle" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <div className="pulse-circle pulse-circle-mini">
                  <div className="pulse-ring-1"></div>
                  <div className="avatar-ring avatar-ring-mini">
                    <div className="avatar-inner avatar-inner-mini">S</div>
                  </div>
                </div>
                <h3 className="caller-name" style={{ margin: 0 }}>Sophia</h3>
                <span className="caller-accent">IELTS Examiner</span>

                {/* React-free Equalizer via Ref */}
                <div className="voice-wave" ref={waveRef}>
                  <div className="wave-bar" style={{ transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                </div>
              </div>

              {/* Chat timeline dialogs */}
              <div className="transcript-box" style={{ height: 140, marginTop: 10 }}>
                {dialogue.map((turn, index) => (
                  <div key={index} className={`chat-bubble ${turn.sender}`}>
                    <strong className="bubble-author">
                      {turn.sender === "ai" ? "Sophia" : (language === "vi" ? "BẠN" : "YOU")}
                    </strong>
                    {turn.sender === "user"
                      ? renderHighlightedText(turn.text, turn.lowConfidenceWords)
                      : turn.text
                    }
                  </div>
                ))}
                {callState === "thinking" && !isEvaluating && (
                  <div className="chat-bubble ai thinking">
                    <strong className="bubble-author">Sophia</strong>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls */}
              <div className="controls-panel" style={{ marginTop: 20 }}>
                <button
                  onClick={() => setMuted(!isMuted)}
                  className={`btn-circle btn-mute ${isMuted ? "active" : ""}`}
                  disabled={callState === "thinking" || isEvaluating}
                  style={{ opacity: (callState === "thinking" || isEvaluating) ? 0.5 : 1, cursor: (callState === "thinking" || isEvaluating) ? "not-allowed" : "pointer" }}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                <button
                  onClick={hangUp}
                  className="btn-circle btn-hangup"
                  disabled={callState === "thinking" || isEvaluating}
                  style={{ opacity: (callState === "thinking" || isEvaluating) ? 0.5 : 1, cursor: (callState === "thinking" || isEvaluating) ? "not-allowed" : "pointer" }}
                >
                  <PhoneOff size={22} />
                </button>

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="btn-circle btn-submit-speech"
                    disabled={callState === "thinking" || isEvaluating}
                    style={{ opacity: (callState === "thinking" || isEvaluating) ? 0.5 : 1, cursor: (callState === "thinking" || isEvaluating) ? "not-allowed" : "pointer" }}
                  >
                    <CheckCircle size={22} />
                  </button>
                )}

                <button
                  onClick={() => setSpeakerOn(!isSpeakerOn)}
                  className={`btn-circle btn-mute ${!isSpeakerOn ? "active" : ""}`}
                  disabled={callState === "thinking" || isEvaluating}
                  style={{ opacity: (callState === "thinking" || isEvaluating) ? 0.5 : 1, cursor: (callState === "thinking" || isEvaluating) ? "not-allowed" : "pointer" }}
                >
                  {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>

            </div>
          )}

          {/* AI EVALUATING SPINNER SCREEN */}
          {callState === "thinking" && isEvaluating && (
            <div className="call-card active-call-theme" style={{ height: "100%", justifyContent: "center" }}>
              <div className="pulse-circle pulse-circle-thinking">
                <div className="avatar-ring avatar-ring-thinking">
                  <div className="avatar-inner avatar-inner-thinking">
                    <RefreshCw size={36} className="animate-spin spinner-thinking" />
                  </div>
                </div>
              </div>
              <h2 className="thinking-title">
                {language === "vi" ? "AI Đang Chấm Điểm..." : "AI Grading Speech..."}
              </h2>
              <p className="thinking-desc">
                {language === "vi"
                  ? "Giám khảo đang phân tích kỹ năng phát âm, từ vựng và ngữ pháp IELTS của bạn."
                  : "The examiner is analyzing your pronunciation, vocabulary, and grammar rubrics."
                }
              </p>
            </div>
          )}

          {/* REPORT & FEEDBACK SCREEN */}
          {callState === "feedback" && (
            <div className="call-card call-card-report" style={{ height: "100%", overflowY: "auto", padding: "30px 20px" }}>
              <div className="report-header">
                <div>
                  <span className="report-badge">EVALUATION COMPLETE</span>
                  <h2 className="report-title" style={{ fontSize: "22px" }}>
                    {language === "vi" ? "Báo Cáo IELTS Speaking" : "IELTS Speaking Report"}
                  </h2>
                </div>

                <div className="report-band-group">
                  <div className="report-band-label-box">
                    <span className="report-band-label">OVERALL BAND</span>
                    <div className="report-band-status">
                      {overallBand >= 7.0 ? (language === "vi" ? "Xuất Sắc" : "Excellent") : (language === "vi" ? "Khá Tốt" : "Good Progress")}
                    </div>
                  </div>
                  <div className="metric-badge" style={{ width: 56, height: 56, fontSize: "24px", borderRadius: 14 }}>{overallBand}</div>
                </div>
              </div>

              {/* Sub criteria ratings */}
              <div className="sub-metric-grid" style={{ marginTop: 16, gap: 10 }}>
                <div className="sub-metric-card" style={{ padding: 10 }}>
                  <span className="metric-label" style={{ fontSize: "10px" }}>Fluency</span>
                  <div className="sub-metric-score" style={{ fontSize: "18px", marginTop: 2 }}>{metrics.fluency}</div>
                </div>
                <div className="sub-metric-card" style={{ padding: 10 }}>
                  <span className="metric-label" style={{ fontSize: "10px" }}>Lexical</span>
                  <div className="sub-metric-score" style={{ fontSize: "18px", marginTop: 2 }}>{metrics.lexical}</div>
                </div>
                <div className="sub-metric-card" style={{ padding: 10 }}>
                  <span className="metric-label" style={{ fontSize: "10px" }}>Grammar</span>
                  <div className="sub-metric-score" style={{ fontSize: "18px", marginTop: 2 }}>{metrics.grammar}</div>
                </div>
                <div className="sub-metric-card" style={{ padding: 10 }}>
                  <span className="metric-label" style={{ fontSize: "10px" }}>Pronunciation</span>
                  <div className="sub-metric-score" style={{ fontSize: "18px", marginTop: 2 }}>{metrics.pronunciation}</div>
                </div>
              </div>

              {/* Core corrections */}
              <div className="corrections-container" style={{ marginTop: 20, padding: 16 }}>
                <h4 style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 10px 0" }}>AI Corrections & Tips:</h4>
                <div className="corrections-list" style={{ gap: 10 }}>
                  {corrections.map((corr: any, idx: number) => (
                    <div key={idx} className="correction-item" style={{ borderLeft: `3px solid ${corr.type === "grammar" ? "#f43f5e" : corr.type === "vocab" ? "#3b82f6" : "#10b981"}`, paddingLeft: 10 }}>
                      {corr.original && <p style={{ fontSize: "12px", margin: "2px 0", color: "#475569" }}><strong>You:</strong> "{corr.original}"</p>}
                      {corr.correction && <p style={{ fontSize: "12px", margin: "2px 0", color: "#10b981" }}><strong>Suggest:</strong> "{corr.correction}"</p>}
                      <p style={{ fontSize: "11px", color: "#64748b", margin: "2px 0" }}>{corr.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit & Close actions */}
              <div className="report-actions" style={{ marginTop: 24 }}>
                <button
                  onClick={handleSubmitExam}
                  disabled={submittingExam}
                  className="btn-restart-call"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 24px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)"
                  }}
                >
                  {submittingExam ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                  {language === "vi" ? "Nộp bài thi IELTS" : "Submit Speaking Attempt"}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}
