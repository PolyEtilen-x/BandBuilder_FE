// src/pages/call/CallWithAiPage.tsx

import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Award, ShieldAlert, CheckCircle, RefreshCw, MessageSquare } from "lucide-react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { useUIStore } from "@/services/ui/ui.store"
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
}

const SIMULATED_CONVO: DialogueTurn[] = [
  { sender: "ai", text: "Hello! Welcome to the AI speaking practice room. My name is your examiner. Can you tell me your full name, please?" },
  { sender: "user", text: "Hello. My name is Minh, and I am preparing for my IELTS exam next month." },
  { sender: "ai", text: "Great, Minh. Let's start with Part 1. Do you work or study at the moment?" },
  { sender: "user", text: "Currently, I am a university student majoring in Computer Science. It is quite challenging but very interesting!" },
  { sender: "ai", text: "Excellent. Now, let's talk about technology. How often do you use technology in your daily study?" },
  { sender: "user", text: "Oh, I use technology almost every hour! As a CS student, programming requires a laptop and a high-speed internet connection constantly." },
  { sender: "ai", text: "Thank you. That concludes our Part 1 simulation. I am calculating your grades and feedback right now." },
]

export default function CallWithAiPage() {
  const { theme: themeState, language } = useUIStore()

  // State controls
  const [selectedVoice, setSelectedVoice] = useState<ExaminerVoice>(EXAMINER_VOICES[0])
  const [callState, setCallState] = useState<"idle" | "calling" | "active" | "feedback">("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [timer, setTimer] = useState(0)

  // Dialogue simulation
  const [dialogue, setDialogue] = useState<DialogueTurn[]>([])
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const dialogueRef = useRef<NodeJS.Timeout | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll chat transcripts
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [dialogue])

  // Timer runner
  useEffect(() => {
    if (callState === "active") {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setTimer(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState])

  // Dialogue progression simulator
  useEffect(() => {
    if (callState === "active") {
      // Print first prompt immediately
      setDialogue([SIMULATED_CONVO[0]])
      setCurrentTurnIdx(1)

      const triggerNextTurn = (idx: number) => {
        if (idx >= SIMULATED_CONVO.length) {
          // Finish convo after a slight delay
          dialogueRef.current = setTimeout(() => {
            handleEndCall()
          }, 4000)
          return
        }

        dialogueRef.current = setTimeout(() => {
          setDialogue((prev) => [...prev, SIMULATED_CONVO[idx]])
          setCurrentTurnIdx(idx + 1)
          triggerNextTurn(idx + 1)
        }, 5000) // 5s gap per turn
      }

      triggerNextTurn(1)
    } else {
      if (dialogueRef.current) clearTimeout(dialogueRef.current)
      setDialogue([])
      setCurrentTurnIdx(0)
    }

    return () => {
      if (dialogueRef.current) clearTimeout(dialogueRef.current)
    }
  }, [callState])

  const handleStartCall = () => {
    setCallState("calling")
    setTimeout(() => {
      setCallState("active")
    }, 2500) // 2.5 seconds dialing phase
  }

  const handleEndCall = () => {
    setCallState("feedback")
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0")
    const s = (secs % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <MainLayout>
      <div className="call-container">
        
        {/* IDLE/PRE-CALL DASHBOARD */}
        {callState === "idle" && (
          <div className="call-card">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700 }}>
                {language === "vi" ? "MỚI" : "NEW FEATURE"}
              </span>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
                IELTS Speaking Realtime Simulator
              </span>
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
              {language === "vi" ? "Phòng Luyện Nói Call with AI" : "Call with AI Speaking Coach"}
            </h1>
            
            <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.6", marginBottom: "30px" }}>
              {language === "vi" 
                ? "Luyện kỹ năng phản xạ nói IELTS mặt đối mặt trực tuyến với Giám khảo AI. Nhận ngay điểm số Band Score và phân tích chi tiết các lỗi phát âm, từ vựng, ngữ pháp tức thì."
                : "Practice your IELTS Speaking face-to-face online with our advanced AI Examiner. Get your dynamic Band Score, pronunciation analysis, and detailed grammatical feedback instantly."
              }
            </p>

            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>
              {language === "vi" ? "1. Chọn Giọng Giám Khảo AI" : "1. Select AI Examiner Voice"}
            </h2>

            <div className="voice-grid">
              {EXAMINER_VOICES.map((voice) => (
                <div 
                  key={voice.id}
                  className={`voice-card ${selectedVoice.id === voice.id ? "selected" : ""}`}
                  onClick={() => setSelectedVoice(voice)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "16px"
                    }}>
                      {voice.avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b" }}>{voice.name}</h3>
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>{voice.accent}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{voice.description}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "40px", display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleStartCall}
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "#fff",
                  padding: "16px 36px",
                  borderRadius: "16px",
                  fontSize: "16px",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
                  transition: "all 0.2s"
                }}
                className="hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone size={18} />
                {language === "vi" ? "Bắt Đầu Gọi Giám Khảo" : "Start Speaking Call"}
              </button>
            </div>
          </div>
        )}

        {/* DIALING STATE */}
        {callState === "calling" && (
          <div className="call-card active-call-theme">
            <div className="pulse-circle">
              <div className="pulse-ring-1"></div>
              <div className="pulse-ring-2"></div>
              <div className="avatar-ring">
                <div className="avatar-inner">{selectedVoice.avatar}</div>
              </div>
            </div>
            
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
              {selectedVoice.name}
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 500, letterSpacing: "0.05em", animation: "pulse 1.5s infinite" }}>
              {language === "vi" ? "ĐANG KẾT NỐI..." : "DIALING SECURE LINK..."}
            </p>

            <div className="controls-panel" style={{ marginTop: "60px" }}>
              <button onClick={() => setCallState("idle")} className="btn-circle btn-hangup">
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE simulated call */}
        {callState === "active" && (
          <div className="call-card active-call-theme">
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "14px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
                {language === "vi" ? "CUỘC GỌI HOẠT ĐỘNG" : "CALL ACTIVE"}
              </span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#fff", background: "rgba(255,255,255,0.08)", padding: "4px 12px", borderRadius: "8px" }}>
                {formatTime(timer)}
              </span>
            </div>

            <div className="pulse-circle" style={{ width: "110px", height: "110px", marginBottom: "16px" }}>
              <div className="pulse-ring-1"></div>
              <div className="avatar-ring" style={{ width: "80px", height: "80px" }}>
                <div className="avatar-inner" style={{ fontSize: "24px" }}>{selectedVoice.avatar}</div>
              </div>
            </div>

            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff" }}>{selectedVoice.name}</h3>
            <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 500 }}>{selectedVoice.accent}</span>

            {/* Audio pulse bars */}
            <div className="voice-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>

            {/* Live Transcript Dialogues */}
            <div className="transcript-box">
              {dialogue.map((turn, index) => (
                <div key={index} className={`chat-bubble ${turn.sender}`}>
                  <strong style={{ fontSize: "11px", display: "block", marginBottom: "2px", opacity: 0.8 }}>
                    {turn.sender === "ai" ? selectedVoice.name : (language === "vi" ? "BẠN" : "YOU")}
                  </strong>
                  {turn.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Controls */}
            <div className="controls-panel">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`btn-circle btn-mute ${isMuted ? "active" : ""}`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button onClick={handleEndCall} className="btn-circle btn-hangup" title="End Call">
                <PhoneOff size={22} />
              </button>

              <button 
                onClick={() => setIsSpeakerOn(!isSpeakerOn)} 
                className={`btn-circle btn-mute ${!isSpeakerOn ? "active" : ""}`}
                title={isSpeakerOn ? "Turn off Speaker" : "Turn on Speaker"}
              >
                {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* FEEDBACK PERFORMANCE REPORT */}
        {callState === "feedback" && (
          <div className="call-card" style={{ maxWidth: "850px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "24px", marginBottom: "24px" }}>
              <div>
                <span style={{ background: "#ecfdf5", color: "#059669", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, display: "inline-block", marginBottom: "10px" }}>
                  {language === "vi" ? "ĐÃ HOÀN THÀNH" : "EVALUATION COMPLETE"}
                </span>
                <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1e293b" }}>
                  {language === "vi" ? "Báo Cáo Đánh Giá IELTS Speaking" : "IELTS Speaking Report Card"}
                </h1>
                <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                  {language === "vi" ? `Giám khảo luyện nói: ${selectedVoice.name}` : `AI Speaking Examiner: ${selectedVoice.name}`}
                </p>
              </div>

              {/* Glowing Overall Score Badges */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {language === "vi" ? "ĐIỂM SỐ CHUNG" : "OVERALL BAND"}
                  </span>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#059669" }}>
                    {language === "vi" ? "Khá Tốt" : "Good Progress"}
                  </div>
                </div>
                <div className="metric-badge">7.5</div>
              </div>
            </div>

            {/* Sub criteria ratings out of 9 */}
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>
              {language === "vi" ? "Tiêu Chí Chấm Điểm Chi Tiết" : "Core Grading Criteria breakdown"}
            </h2>
            <div className="sub-metric-grid">
              <div className="sub-metric-card">
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block" }}>Fluency & Coherence</span>
                <div className="sub-metric-score">7.5</div>
              </div>
              <div className="sub-metric-card">
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block" }}>Lexical Resource</span>
                <div className="sub-metric-score">7.0</div>
              </div>
              <div className="sub-metric-card">
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block" }}>Grammatical Range</span>
                <div className="sub-metric-score">7.5</div>
              </div>
              <div className="sub-metric-card">
                <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, display: "block" }}>Pronunciation</span>
                <div className="sub-metric-score">8.0</div>
              </div>
            </div>

            {/* Detailed Grammatical and Lexical corrections */}
            <div style={{ marginTop: "40px", background: "#f8fafc", borderRadius: "20px", padding: "24px", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={18} style={{ color: "#3b82f6" }} />
                {language === "vi" ? "Đánh Giá & Nhận Xét Lỗi Sai Từ AI" : "AI Corrections & Vocabulary Polish"}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ borderLeft: "4px solid #f43f5e", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <ShieldAlert size={15} style={{ color: "#ef4444" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#991b1b" }}>
                      {language === "vi" ? "Lỗi Ngữ Pháp/Cách dùng từ" : "Grammar / Word Choice Correction"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#475569", margin: "4px 0" }}>
                    <strong>{language === "vi" ? "Bạn nói:" : "You said:"}</strong> <em>"I use technology almost every hour."</em>
                  </p>
                  <p style={{ fontSize: "13.5px", color: "#059669" }}>
                    <strong>{language === "vi" ? "Gợi ý sửa đổi:" : "Correction:"}</strong> <em>"I use technology on an hourly basis."</em>
                  </p>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    {language === "vi" ? "-> Tránh lặp cấu trúc đơn giản, giúp câu nói tự nhiên và trang trọng hơn." : "-> More native and formal phrasing."}
                  </span>
                </div>

                <div style={{ borderLeft: "4px solid #3b82f6", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <MessageSquare size={15} style={{ color: "#3b82f6" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e40af" }}>
                      {language === "vi" ? "Nâng Cấp Từ Vựng (Lexical Polish)" : "Advanced Vocabulary Suggestion"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#475569", margin: "4px 0" }}>
                    <strong>{language === "vi" ? "Bạn nói:" : "You said:"}</strong> <em>"programming requires a laptop..."</em>
                  </p>
                  <p style={{ fontSize: "13.5px", color: "#059669" }}>
                    <strong>{language === "vi" ? "Nâng cấp lên:" : "Upgrade to:"}</strong> <em>"programming demands constant access to a laptop and robust high-speed internet connectivity."</em>
                  </p>
                </div>

                <div style={{ borderLeft: "4px solid #10b981", paddingLeft: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <CheckCircle size={15} style={{ color: "#10b981" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#065f46" }}>
                      {language === "vi" ? "Điểm Tốt Tích Cực" : "Positive Highlights"}
                    </span>
                  </div>
                  <p style={{ fontSize: "13.5px", color: "#475569", margin: "4px 0" }}>
                    {language === "vi" 
                      ? "Phát âm rất lưu loát các âm ghép. Sử dụng tốt cụm từ 'challenging but very interesting' giúp mạch văn tự nhiên."
                      : "Great pronunciation of consonant clusters. Using transitional structures like 'challenging but very interesting' keeps the coherence level high."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Restart tools */}
            <div style={{ display: "flex", gap: "16px", marginTop: "32px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setCallState("idle")}
                style={{
                  background: "#f1f5f9",
                  color: "#1e293b",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <RefreshCw size={16} />
                {language === "vi" ? "Luyện Tập Lại" : "Practice Again"}
              </button>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  )
}
