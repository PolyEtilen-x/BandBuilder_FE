import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Award, ShieldAlert, CheckCircle, RefreshCw, MessageSquare, Server, Cpu } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useUIStore } from "@/services/ui/ui.store"
import { useSpeakingStore } from "@/services/speaking/speaking.store"
import { useAudioCall } from "@/hooks/useAudioCall"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import "./style.css"

type ExaminerVoice = {
  id: string
  name: string
  accent: string
  description: string
  avatar: string
}

const EXAMINER_VOICES: ExaminerVoice[] = [
  { id: "sophia", name: "Sophia", accent: "American Accent", description: "Friendly, speaks clearly, perfect for intermediate level practice.", avatar: "S" },
  { id: "alex", name: "Alex", accent: "British Accent", description: "Academic and formal, simulated after a real IDP examiner.", avatar: "A" },
  { id: "david", name: "David", accent: "Australian Accent", description: "Natural tempo with mild dialect, great for advanced listeners.", avatar: "D" },
]

type DialogueTurn = {
  sender: "ai" | "user"
  text: string
  isPartial?: boolean
  lowConfidenceWords?: string[]
}

const SIMULATED_CONVO: DialogueTurn[] = [
  { sender: "ai", text: "Hello! Welcome to the AI speaking practice room. My name is Sophia. Can you tell me your full name, please?" },
  { sender: "user", text: "Hello. My name is Minh, and I am preparing for my IELTS exam next month." },
  { sender: "ai", text: "Great, Minh. Let's start with Part 1. Do you work or study at the moment?" },
  { sender: "user", text: "Currently, I am a university student majoring in Computer Science. It is quite challenging but very interesting!" },
  { sender: "ai", text: "Excellent. Now, let's talk about technology. How often do you use technology in your daily study?" },
  { sender: "user", text: "Oh, I use technology almost every hour! As a CS student, programming requires a laptop and a high-speed internet connection constantly." },
  { sender: "ai", text: "Thank you. That concludes our Part 1 simulation. I am calculating your grades and feedback right now." },
]

export default function CallWithAiPage() {
  const { language } = useUIStore()

  // 1. Live Socket speaking store hook
  const {
    isConnected,
    callState: liveState,
    selectedVoiceId,
    dialogue: liveDialogue,
    timer: liveTimer,
    isMuted,
    isSpeakerOn,
    overallBand: liveBand,
    metrics: liveMetrics,
    corrections: liveCorrections,
    isEvaluating,
    initSocket,
    startCall: startLiveCall,
    stopRecording: stopLiveRecording,
    hangUp: hangUpLive,
    setMuted,
    setSpeakerOn,
    incrementTimer,
    resetStore
  } = useSpeakingStore()

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

  // Initialize socket on mount
  useEffect(() => {
    initSocket()
    return () => {
      resetStore()
    }
  }, [initSocket, resetStore])

  // 2. Real-time microphone and VAD recorder hook
  const { isRecording, rmsVolume } = useAudioCall()

  // 3. Fallback Offline Simulation states
  const [selectedVoice, setSelectedVoice] = useState<ExaminerVoice>(EXAMINER_VOICES[0])
  const [simState, setSimState] = useState<"idle" | "calling" | "active" | "feedback">("idle")
  const [simDialogue, setSimDialogue] = useState<DialogueTurn[]>([])
  const [simTimer, setSimTimer] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const simDialogueRef = useRef<NodeJS.Timeout | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll chat transcripts
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [liveDialogue, simDialogue])

  // Active call duration runner
  const activeStateForTimer = callStateSelector()
  useEffect(() => {
    if (activeStateForTimer === "active") {
      timerRef.current = setInterval(() => {
        if (isConnected) {
          incrementTimer()
        } else {
          setSimTimer((prev) => prev + 1)
        }
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setTimeout(() => {
        setSimTimer(0)
      }, 0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [activeStateForTimer, isConnected, liveState, simState, incrementTimer])

  // Dialogue simulation (Offline Fallback only)
  useEffect(() => {
    if (!isConnected && simState === "active") {
      // Print first prompt immediately
      setTimeout(() => {
        setSimDialogue([SIMULATED_CONVO[0]])
      }, 0)

      const triggerNextTurn = (idx: number) => {
        if (idx >= SIMULATED_CONVO.length) {
          simDialogueRef.current = setTimeout(() => {
            setSimState("feedback")
          }, 4000)
          return
        }

        simDialogueRef.current = setTimeout(() => {
          setSimDialogue((prev) => [...prev, SIMULATED_CONVO[idx]])
          triggerNextTurn(idx + 1)
        }, 5000) // 5s gap per turn
      }

      triggerNextTurn(1)
    } else {
      if (simDialogueRef.current) clearTimeout(simDialogueRef.current)
      setTimeout(() => {
        setSimDialogue([])
      }, 0)
    }

    return () => {
      if (simDialogueRef.current) clearTimeout(simDialogueRef.current)
    }
  }, [simState, isConnected])

  // --- Dynamic selectors based on connection ---
  function callStateSelector() {
    return isConnected ? liveState : simState
  }

  const activeState = callStateSelector()
  const activeDialogue = isConnected ? liveDialogue : simDialogue
  const activeTimer = isConnected ? liveTimer : simTimer
  const activeVoice = isConnected
    ? (EXAMINER_VOICES.find(v => v.id === selectedVoiceId) || selectedVoice)
    : selectedVoice

  // Start Call Handler
  const handleStartCall = () => {
    if (isConnected) {
      startLiveCall(selectedVoice.id)
    } else {
      setSimState("calling")
      setTimeout(() => {
        setSimState("active")
      }, 2500)
    }
  }

  // End Call / Hang Up
  const handleEndCall = () => {
    if (isConnected) {
      hangUpLive()
    } else {
      setSimState("feedback")
    }
  }

  const handleHangUp = () => {
    if (isConnected) {
      hangUpLive()
    } else {
      setSimState("idle")
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  // Live RMS equalizer scaling (adds reactive animation when user speaks)
  const baseScale = isConnected && isRecording ? Math.min(1 + rmsVolume * 9, 3.5) : 1

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          gap: 30,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "30px 20px",
          alignItems: "flex-start",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <GeneralPracticeSidebar />

        {/* WORKSPACE CONTENT */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            height: "100%",
          }}
        >
          <div className="call-container" style={{ padding: 0 }}>

            {/* IDLE/PRE-CALL DASHBOARD */}
            {activeState === "idle" && (
              <div className="call-card">
                <div className="call-header-meta">
                  <div className="call-tag-group">
                    <span className="call-badge-new">
                      {language === "vi" ? "MỚI" : "NEW FEATURE"}
                    </span>
                    <span className="call-subtitle">
                      IELTS Speaking Realtime Simulator
                    </span>
                  </div>

                  {/* Connection Status Indicators */}
                  <div className="call-status-indicator">
                    {isConnected ? (
                      <span className="call-status-online">
                        <Server size={14} /> Live Gateway Online
                      </span>
                    ) : (
                      <span className="call-status-simulated">
                        <Cpu size={14} /> Simulated Mode Active
                      </span>
                    )}
                  </div>
                </div>

                <h1 className="call-title">
                  {language === "vi" ? "Phòng Luyện Nói Call with AI" : "Call with AI Speaking Coach"}
                </h1>

                <p className="call-desc">
                  {language === "vi"
                    ? "Luyện kỹ năng phản xạ nói IELTS mặt đối mặt trực tuyến với Giám khảo AI. Nhận ngay điểm số Band Score và phân tích chi tiết các lỗi phát âm, từ vựng, ngữ pháp tức thì."
                    : "Practice your IELTS Speaking face-to-face online with our advanced AI Examiner. Get your dynamic Band Score, pronunciation analysis, and detailed grammatical feedback instantly."
                  }
                </p>

                <h2 className="call-section-title">
                  {language === "vi" ? "1. Chọn Giọng Giám Khảo AI" : "1. Select AI Examiner Voice"}
                </h2>

                <div className="voice-grid">
                  {EXAMINER_VOICES.map((voice) => (
                    <div
                      key={voice.id}
                      className={`voice-card ${selectedVoice.id === voice.id ? "selected" : ""}`}
                      onClick={() => setSelectedVoice(voice)}
                    >
                      <div className="voice-card-header">
                        <div className="voice-card-avatar">
                          {voice.avatar}
                        </div>
                        <div>
                          <h3 className="voice-card-name">{voice.name}</h3>
                          <span className="voice-card-accent">{voice.accent}</span>
                        </div>
                      </div>
                      <p className="correction-explanation">{voice.description}</p>
                    </div>
                  ))}
                </div>

                <div className="call-start-wrapper">
                  <button
                    onClick={handleStartCall}
                    style={{
                      background: isConnected
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    }}
                    className="btn-start-call hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Phone size={18} />
                    {isConnected
                      ? (language === "vi" ? "Gọi Giám Khảo (Live WebSocket)" : "Call AI (Live Gateway)")
                      : (language === "vi" ? "Gọi Thử Giả Lập (Simulate)" : "Start Simulated Practice")
                    }
                  </button>
                </div>
              </div>
            )}

            {/* DIALING STATE */}
            {activeState === "calling" && (
              <div className="call-card active-call-theme">
                <div className="pulse-circle">
                  <div className="pulse-ring-1"></div>
                  <div className="pulse-ring-2"></div>
                  <div className="avatar-ring">
                    <div className="avatar-inner">{activeVoice.avatar}</div>
                  </div>
                </div>

                <h2 className="dial-title">
                  {activeVoice.name}
                </h2>
                <p className="dial-status">
                  {language === "vi" ? "ĐANG KẾT NỐI HỆ THỐNG..." : "DIALING SECURE LINK..."}
                </p>

                <div className="controls-panel dial-controls">
                  <button onClick={handleHangUp} className="btn-circle btn-hangup">
                    <PhoneOff size={24} />
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE Voice Call screen */}
            {(activeState === "active" || (activeState === "thinking" && !isEvaluating)) && (
              <div className="call-card active-call-theme">
                <div className="call-active-header">
                  <span className="call-active-status" style={{ color: isRecording ? (rmsVolume > 0.03 ? "#10b981" : "#3b82f6") : activeState === "thinking" ? "#f59e0b" : "#64748b" }}>
                    <span className={`call-active-indicator ${isRecording ? (rmsVolume > 0.03 ? "recording" : "listening") : activeState === "thinking" ? "thinking" : ""}`} style={{ background: isRecording ? (rmsVolume > 0.03 ? "#10b981" : "#3b82f6") : activeState === "thinking" ? "#f59e0b" : "#64748b" }}></span>
                    {isConnected
                      ? (isRecording 
                          ? (rmsVolume > 0.03 
                              ? (language === "vi" ? "BẠN ĐANG NÓI..." : "SPEAK NOW...") 
                              : (language === "vi" ? "ĐANG NGHE (Hãy nói)..." : "LISTENING (Speak now)...")
                            )
                          : activeState === "thinking"
                            ? (language === "vi" ? "AI ĐANG XỬ LÝ..." : "AI IS PROCESSING...")
                            : (language === "vi" ? "AI ĐANG NÓI..." : "AI IS SPEAKING...")
                        )
                      : (language === "vi" ? "MÔ PHỎNG HOẠT ĐỘNG" : "SIMULATED CALL ACTIVE")
                    }
                  </span>
                  <span className="call-active-timer">
                    {formatTime(activeTimer)}
                  </span>
                </div>

                <div className="pulse-circle pulse-circle-mini">
                  <div className="pulse-ring-1"></div>
                  <div className="avatar-ring avatar-ring-mini">
                    <div className="avatar-inner avatar-inner-mini">{activeVoice.avatar}</div>
                  </div>
                </div>

                <h3 className="caller-name">{activeVoice.name}</h3>
                <span className="caller-accent">{activeVoice.accent}</span>

                {/* Audio equalizers reacting to live voice volume */}
                <div className="voice-wave">
                  <div className="wave-bar" style={{ transform: `scaleY(${baseScale * 0.7})`, transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transform: `scaleY(${baseScale * 1.5})`, transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transform: `scaleY(${baseScale * 2.3})`, transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transform: `scaleY(${baseScale * 1.3})`, transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                  <div className="wave-bar" style={{ transform: `scaleY(${baseScale * 0.8})`, transition: isConnected ? "transform 0.08s ease" : "" }}></div>
                </div>

                {/* Scrolling transcript dialogues */}
                <div className="transcript-box">
                  {activeDialogue.map((turn, index) => (
                    <div key={index} className={`chat-bubble ${turn.sender}`}>
                      <strong className="bubble-author">
                        {turn.sender === "ai" ? activeVoice.name : (language === "vi" ? "BẠN" : "YOU")}
                      </strong>
                      {turn.sender === "user"
                        ? renderHighlightedText(turn.text, turn.lowConfidenceWords)
                        : turn.text
                      }
                    </div>
                  ))}
                  {activeState === "thinking" && !isEvaluating && (
                    <div className="chat-bubble ai thinking">
                      <strong className="bubble-author">{activeVoice.name}</strong>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Call Controls */}
                <div className="controls-panel">
                  <button
                    onClick={() => setMuted(!isMuted)}
                    className={`btn-circle btn-mute ${isMuted ? "active" : ""}`}
                    title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button onClick={handleEndCall} className="btn-circle btn-hangup" title="End Call">
                    <PhoneOff size={22} />
                  </button>

                  {isRecording && (
                    <button
                      onClick={stopLiveRecording}
                      className="btn-circle btn-submit-speech"
                      title={language === "vi" ? "Gửi câu trả lời ngay" : "Submit answer now"}
                    >
                      <CheckCircle size={22} />
                    </button>
                  )}

                  <button
                    onClick={() => setSpeakerOn(!isSpeakerOn)}
                    className={`btn-circle btn-mute ${!isSpeakerOn ? "active" : ""}`}
                    title={isSpeakerOn ? "Turn off Speaker" : "Turn on Speaker"}
                  >
                    {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* THINKING STATE (WAITING FOR AI EVALUATION) */}
            {activeState === "thinking" && isEvaluating && (
              <div className="call-card active-call-theme">
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
                    ? "Giám khảo đang phân tích cách phát âm, ngữ pháp và lập biểu đồ phản hồi chi tiết cho bạn."
                    : "The examiner is analyzing your pronunciation, grammar, and building your speech report."
                  }
                </p>
              </div>
            )}

            {/* FEEDBACK PERFORMANCE REPORT */}
            {activeState === "feedback" && (
              <div className="call-card call-card-report">
                <div className="report-header">
                  <div>
                    <span className="report-badge">
                      {language === "vi" ? "ĐÃ HOÀN THÀNH" : "EVALUATION COMPLETE"}
                    </span>
                    <h1 className="report-title">
                      {language === "vi" ? "Báo Cáo Đánh Giá IELTS Speaking" : "IELTS Speaking Report Card"}
                    </h1>
                    <p className="report-subtitle">
                      {language === "vi" ? `Giám khảo luyện nói: ${activeVoice.name}` : `AI Speaking Examiner: ${activeVoice.name}`}
                    </p>
                  </div>

                  {/* Glowing Overall Score Badges */}
                  <div className="report-band-group">
                    <div className="report-band-label-box">
                      <span className="report-band-label">
                        {language === "vi" ? "ĐIỂM SỐ CHUNG" : "OVERALL BAND"}
                      </span>
                      <div className="report-band-status">
                        {isConnected ? (liveBand >= 7.0 ? (language === "vi" ? "Xuất Sắc" : "Excellent") : (language === "vi" ? "Khá Tốt" : "Keep Improving")) : (language === "vi" ? "Khá Tốt" : "Good Progress")}
                      </div>
                    </div>
                    <div className="metric-badge">{isConnected ? liveBand : 7.5}</div>
                  </div>
                </div>

                {/* Sub criteria ratings out of 9 */}
                <h2 className="report-section-title">
                  {language === "vi" ? "Tiêu Chỉ Chấm Điểm Chi Tiết" : "Core Grading Criteria breakdown"}
                </h2>
                <div className="sub-metric-grid">
                  <div className="sub-metric-card">
                    <span className="metric-label">Fluency & Coherence</span>
                    <div className="sub-metric-score">{isConnected ? liveMetrics.fluency : 7.5}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Lexical Resource</span>
                    <div className="sub-metric-score">{isConnected ? liveMetrics.lexical : 7.0}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Grammatical Range</span>
                    <div className="sub-metric-score">{isConnected ? liveMetrics.grammar : 7.5}</div>
                  </div>
                  <div className="sub-metric-card">
                    <span className="metric-label">Pronunciation</span>
                    <div className="sub-metric-score">{isConnected ? liveMetrics.pronunciation : 8.0}</div>
                  </div>
                </div>

                {/* Detailed Grammatical and Lexical corrections */}
                <div className="corrections-container">
                  <h3 className="corrections-title">
                    <Award size={18} style={{ color: "#3b82f6" }} />
                    {language === "vi" ? "Đánh Giá & Nhận Xét Lỗi Sai Từ AI" : "AI Corrections & Vocabulary Polish"}
                  </h3>

                  <div className="corrections-list">
                    {isConnected && liveCorrections.length > 0 ? (
                      liveCorrections.map((corr, idx) => (
                        <div
                          key={idx}
                          className="correction-item"
                          style={{
                            borderLeft: `4px solid ${corr.type === "grammar" ? "#f43f5e" : corr.type === "vocab" ? "#3b82f6" : "#10b981"
                              }`
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
                                ? (language === "vi" ? "Lỗi Ngữ Pháp / Cách dùng từ" : "Grammar Correction")
                                : corr.type === "vocab"
                                  ? (language === "vi" ? "Nâng Cấp Từ Vựng" : "Lexical Upgrade")
                                  : (language === "vi" ? "Ưu Điểm Phát Âm" : "Speech Highlight")
                              }
                            </span>
                          </div>
                          {corr.original && (
                            <p className="correction-original">
                              <strong>{language === "vi" ? "Bạn nói:" : "You said:"}</strong> <em>"{corr.original}"</em>
                            </p>
                          )}
                          {corr.correction && (
                            <p className="correction-fixed">
                              <strong>{language === "vi" ? "Đề xuất sửa:" : "Correction:"}</strong> <em>"{corr.correction}"</em>
                            </p>
                          )}
                          <p className="correction-explanation">
                            {corr.explanation}
                          </p>
                        </div>
                      ))
                    ) : (
                      // Static Fallback analysis when offline
                      <>
                        <div className="correction-item" style={{ borderLeft: "4px solid #f43f5e" }}>
                          <div className="correction-header">
                            <ShieldAlert size={15} style={{ color: "#ef4444" }} />
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#991b1b" }}>
                              {language === "vi" ? "Lỗi Ngữ Pháp / Cách dùng từ" : "Grammar / Word Choice Correction"}
                            </span>
                          </div>
                          <p className="correction-original">
                            <strong>{language === "vi" ? "Bạn nói:" : "You said:"}</strong> <em>"I use technology almost every hour."</em>
                          </p>
                          <p className="correction-fixed">
                            <strong>{language === "vi" ? "Gợi ý sửa đổi:" : "Correction:"}</strong> <em>"I use technology on an hourly basis."</em>
                          </p>
                          <span className="correction-explanation">
                            {language === "vi" ? "-> Tránh lặp cấu trúc đơn giản, giúp câu nói tự nhiên và trang trọng hơn." : "-> More native and formal phrasing."}
                          </span>
                        </div>

                        <div className="correction-item" style={{ borderLeft: "4px solid #3b82f6" }}>
                          <div className="correction-header">
                            <MessageSquare size={15} style={{ color: "#3b82f6" }} />
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e40af" }}>
                              {language === "vi" ? "Nâng Cấp Từ Vựng (Lexical Polish)" : "Advanced Vocabulary Suggestion"}
                            </span>
                          </div>
                          <p className="correction-original">
                            <strong>{language === "vi" ? "Bạn nói:" : "You said:"}</strong> <em>"programming requires a laptop..."</em>
                          </p>
                          <p className="correction-fixed">
                            <strong>{language === "vi" ? "Nâng cấp lên:" : "Upgrade to:"}</strong> <em>"programming demands constant access to a laptop and robust high-speed internet connectivity."</em>
                          </p>
                        </div>

                        <div className="correction-item" style={{ borderLeft: "4px solid #10b981" }}>
                          <div className="correction-header">
                            <CheckCircle size={15} style={{ color: "#10b981" }} />
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#065f46" }}>
                              {language === "vi" ? "Điểm Tốt Tích Cực" : "Positive Highlights"}
                            </span>
                          </div>
                          <p className="correction-original">
                            {language === "vi"
                              ? "Phát âm rất lưu loát các âm ghép. Sử dụng tốt cụm từ 'challenging but very interesting' giúp mạch văn tự nhiên."
                              : "Great pronunciation of consonant clusters. Using transitional structures like 'challenging but very interesting' keeps the coherence level high."
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Restart tools */}
                <div className="report-actions">
                  <button
                    onClick={handleHangUp}
                    className="btn-restart-call"
                  >
                    <RefreshCw size={16} />
                    {language === "vi" ? "Quay Lại Trang Chủ" : "Start Over"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  )
}
