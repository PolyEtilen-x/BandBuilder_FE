import { useState, useRef, useEffect, ReactElement } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GeneralPracticeSidebar from "@/components/general_practice/GeneralPracticeSidebar"
import DictionaryPanel from "@/components/dictionary/DictionaryPanel"
import { useVocabStore } from "@/services/dictionary/vocab.store"
import { useDictionary } from "@/services/dictionary/useDictionary"
import { usePronunciationTopics, usePronunciationTopicDetail } from "@/hooks/usePronunciation"
import { useYoutubeShadowing } from "@/hooks/useYoutubeShadowing"
import type {
  PronunciationVocabDto,
  PronunciationSentenceDto,
  PronunciationTopicDetailDto,
} from "@/api/practiceGeneral.api"
import "./Pronunciation.css"

// ─── Helpers ────────────────────────────────────────────────────────────────

async function translateToVietnamese(text: string): Promise<string> {
  if (!text.trim()) return ""
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`
    const res = await fetch(url)
    if (!res.ok) return ""
    const data = (await res.json()) as Array<Array<[string, ...unknown[]]>>
    return data[0]?.map((s) => s[0]).filter(Boolean).join("") || ""
  } catch {
    return ""
  }
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

// ─── VocabCard ───────────────────────────────────────────────────────────────

function VocabCard({ vocab }: { vocab: PronunciationVocabDto }): ReactElement {
  const { savedWords, addWord, removeWord } = useVocabStore()
  const isSaved = savedWords.some((w) => w.word.toLowerCase() === vocab.word.toLowerCase())

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl)
      audio.play().catch(() => {
        if ("speechSynthesis" in window) {
          const u = new SpeechSynthesisUtterance(vocab.word)
          u.lang = "en-US"
          window.speechSynthesis.speak(u)
        }
      })
    } else if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(vocab.word)
      u.lang = "en-US"
      window.speechSynthesis.speak(u)
    }
  }

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSaved) {
      removeWord(vocab.word)
    } else {
      addWord({
        word: vocab.word,
        phonetic: vocab.ipa,
        audio: vocab.audioUrl || "",
        meaning: vocab.meaning,
        related: "",
        explainVN: vocab.meaning,
        example: vocab.example || "",
        translation: vocab.exampleTranslation || "",
        isSaved: true,
        dateSaved: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="pp-vocab-card">
      <div className="pp-vocab-card-header">
        <div className="pp-vocab-word-section">
          <span className="pp-vocab-word">{vocab.word}</span>
          <span className="pp-vocab-ipa">{vocab.ipa}</span>
        </div>
        <div className="pp-vocab-actions">
          <button onClick={playAudio} className="pp-vocab-audio-btn" aria-label={`Play ${vocab.word}`}>
            🔊 Listen
          </button>
          <button onClick={toggleSave} className={`pp-vocab-save-btn ${isSaved ? "saved" : ""}`}>
            {isSaved ? "✓ Saved" : "+ Save"}
          </button>
        </div>
      </div>
      <div className="pp-vocab-card-body">
        <div>
          <div className="pp-vocab-field-label">Meaning</div>
          <p className="pp-vocab-meaning">{vocab.meaning}</p>
        </div>
        {vocab.example && (
          <div>
            <div className="pp-vocab-field-label">Example</div>
            <p className="pp-vocab-example">{vocab.example}</p>
            {vocab.exampleTranslation && (
              <p className="pp-vocab-translation">{vocab.exampleTranslation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TopicDetail ─────────────────────────────────────────────────────────────

function TopicDetail({
  detail,
  onBack,
}: {
  detail: PronunciationTopicDetailDto
  onBack: () => void
}): ReactElement {
  const [activeTab, setActiveTab] = useState<"shadowing" | "vocab">("shadowing")
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({})

  const { dict, loading: dictLoading, lookup, close: closeDict, save: saveDict } = useDictionary()

  const {
    isPlaying, playbackSpeed, isLooping, currentTime, duration,
    isPlayerReady, selectedSentence, activeSentence,
    playSentence, clearSelectedSentence, togglePlay, setSpeed, toggleLoop,
  } = useYoutubeShadowing(detail.videoUrl, detail.sentences || [])

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeSentence && activeTab === "shadowing") {
      const activeEl = listRef.current?.querySelector(`.pp-sentence-row[data-sentence-id="${activeSentence.id}"]`)
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [activeSentence, activeTab])

  // Legacy audio player (fallback)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [legacyPlaying, setLegacyPlaying] = useState(false)
  const [legacyTime, setLegacyTime] = useState(0)
  const [legacyDuration, setLegacyDuration] = useState(0)

  const toggleLegacyPlay = () => {
    if (!audioRef.current) return
    if (legacyPlaying) { audioRef.current.pause(); setLegacyPlaying(false) }
    else { audioRef.current.play(); setLegacyPlaying(true) }
  }

  const handleWordClick = (word: string, context: string) => {
    const clean = word.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'"]/g, "").trim()
    if (clean) lookup(clean, context)
  }

  const handleTranslate = async (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation()
    if (translations[id]) {
      setTranslations((p) => { const n = { ...p }; delete n[id]; return n })
      return
    }
    setTranslatingIds((p) => ({ ...p, [id]: true }))
    const t = await translateToVietnamese(text)
    setTranslations((p) => ({ ...p, [id]: t }))
    setTranslatingIds((p) => ({ ...p, [id]: false }))
  }

  const renderClickable = (text: string): ReactElement[] =>
    text.split(/\s+/).map((word, i) => (
      <span
        key={i}
        className="pp-word-token"
        onClick={(e) => { e.stopPropagation(); handleWordClick(word, text) }}
      >
        {word}{" "}
      </span>
    ))

  const hasVideo = !!detail.videoUrl?.trim()

  return (
    <>
      {/* Back nav */}
      <div className="pp-detail-nav">
        <button id="pronunciation-back-btn" onClick={onBack} className="pp-back-btn">
          ← Back
        </button>
        <h2 className="pp-detail-topic-title">{detail.title}</h2>
      </div>

      <div className="pp-detail-layout">
        {/* LEFT — Player */}
        <div>
          {hasVideo ? (
            <div className="pp-card pp-player-card">
              <div className="pp-video-container">
                <div id="shadowing-youtube-player" style={{ width: "100%", height: "100%" }} />
              </div>
              {/* Controls */}
              <div className="pp-yt-controls">
                <div className="pp-yt-controls-left">
                  <button
                    onClick={togglePlay}
                    disabled={!isPlayerReady}
                    className={`pp-yt-btn ${isPlaying ? "active" : ""}`}
                  >
                    {isPlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                  <button
                    onClick={toggleLoop}
                    disabled={!isPlayerReady}
                    className={`pp-yt-btn ${isLooping ? "active" : ""}`}
                  >
                    🔁 Loop
                  </button>
                  {selectedSentence && (
                    <button onClick={clearSelectedSentence} className="pp-yt-btn">
                      ✕ Clear
                    </button>
                  )}
                </div>

                <div className="pp-speed-group">
                  <span className="pp-speed-label">Speed:</span>
                  {[0.75, 1, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      disabled={!isPlayerReady}
                      className={`pp-yt-btn ${playbackSpeed === s ? "active" : ""}`}
                      style={{ padding: "4px 8px", fontSize: "11px" }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <span className="pp-yt-status">
                  {selectedSentence
                    ? `Shadowing · Sentence ${selectedSentence.orderIndex + 1}`
                    : "Continuous"}{" "}
                  · {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          ) : (
            <div className="pp-card">
              {detail.audioUrl && (
                <div className="pp-audio-player">
                  <audio
                    ref={audioRef}
                    src={detail.audioUrl}
                    onTimeUpdate={() => audioRef.current && setLegacyTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setLegacyDuration(audioRef.current.duration || 0)}
                    onEnded={() => { setLegacyPlaying(false); setLegacyTime(0) }}
                  />
                  <button onClick={toggleLegacyPlay} className="pp-audio-play-btn">
                    {legacyPlaying ? "⏸" : "▶"}
                  </button>
                  <div className="pp-audio-progress">
                    <input
                      type="range"
                      min={0}
                      max={legacyDuration || 100}
                      value={legacyTime}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value)
                        if (audioRef.current) audioRef.current.currentTime = v
                        setLegacyTime(v)
                      }}
                      className="pp-audio-slider"
                    />
                    <div className="pp-audio-timers">
                      <span>{formatTime(legacyTime)}</span>
                      <span>{formatTime(legacyDuration)}</span>
                    </div>
                  </div>
                </div>
              )}
              {detail.paragraph && (
                <div className="pp-passage-block">
                  <span className="pp-passage-label">Reading Passage</span>
                  <p className="pp-passage-text">{detail.paragraph}</p>
                </div>
              )}
            </div>
          )}

          {/* Transcript overview (below video) */}
          {hasVideo && detail.paragraph && (
            <div className="pp-card" style={{ marginTop: 16 }}>
              <div className="pp-passage-block">
                <span className="pp-passage-label">Full Transcript Overview</span>
                <p className="pp-passage-text">{detail.paragraph}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Workspace tabs */}
        <div className="pp-card pp-workspace-card">
          <div className="pp-tabs">
            <button
              className={`pp-tab-btn ${activeTab === "shadowing" ? "active" : ""}`}
              onClick={() => setActiveTab("shadowing")}
            >
              🎙️ Shadowing
            </button>
            <button
              className={`pp-tab-btn ${activeTab === "vocab" ? "active" : ""}`}
              onClick={() => setActiveTab("vocab")}
            >
              📚 Vocabulary ({detail.vocabs.length})
            </button>
          </div>

          {activeTab === "shadowing" ? (
            detail.sentences?.length > 0 ? (
              <div ref={listRef} className="pp-shadowing-list">
                {detail.sentences.map((sentence: PronunciationSentenceDto) => {
                  const isActive = activeSentence?.id === sentence.id
                  const isTranslating = translatingIds[sentence.id]
                  const hasTranslation = !!translations[sentence.id]

                  return (
                    <div
                      key={sentence.id}
                      data-sentence-id={sentence.id}
                      onClick={() => playSentence(sentence)}
                      className={`pp-sentence-row ${isActive ? "active" : ""}`}
                    >
                      <div className="pp-sentence-meta">
                        <span className="pp-sentence-time">
                          ⏱ {formatTime(sentence.startTime)} – {formatTime(sentence.endTime)}
                        </span>
                        <button
                          onClick={(e) => handleTranslate(e, sentence.id, sentence.text)}
                          className="pp-translate-btn"
                        >
                          {isTranslating ? "..." : hasTranslation ? "✕ Hide" : "🌐 Translate"}
                        </button>
                      </div>
                      <div className="pp-sentence-text">
                        {renderClickable(sentence.text)}
                      </div>
                      {hasTranslation && (
                        <div className="pp-sentence-translation">{translations[sentence.id]}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="pp-tab-empty">
                No sentences synced yet. Use the transcript overview below the video.
              </div>
            )
          ) : (
            detail.vocabs.length > 0 ? (
              <div className="pp-vocab-list">
                {detail.vocabs.map((v) => <VocabCard key={v.id} vocab={v} />)}
              </div>
            ) : (
              <div className="pp-tab-empty">No vocabulary added for this topic yet.</div>
            )
          )}
        </div>
      </div>

      {dict && (
        <DictionaryPanel
          dict={dict}
          loading={dictLoading}
          onClose={closeDict}
          onSave={saveDict}
        />
      )}
    </>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TopicListSkeleton(): ReactElement {
  return (
    <div className="pp-skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="pp-skeleton-card">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="pp-skeleton-line" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
            <div className="pp-skeleton-line" style={{ height: 18, flex: 1 }} />
          </div>
          <div className="pp-skeleton-line" style={{ height: 13, width: "50%" }} />
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PronunciationPracticePage(): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: topics, isLoading: topicsLoading, error: topicsError } = usePronunciationTopics()
  const { data: detail, isLoading: detailLoading, error: detailError } = usePronunciationTopicDetail(selectedId)

  const handleBack = () => setSelectedId(null)

  return (
    <MainLayout>
      <div className="pp-page-wrapper">
        <div style={{ display: "flex", gap: 30, maxWidth: 1200, margin: "0 auto", alignItems: "flex-start" }}>
          {/* Sidebar */}
          <GeneralPracticeSidebar />

          {/* Main content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pp-page-container" style={{ maxWidth: "100%", padding: 0 }}>

              {/* Page header — only on list view */}
              {!selectedId && (
                <div className="pp-page-header">
                  <div className="pp-page-header-icon">🎙️</div>
                  <div className="pp-page-header-text">
                    <h1>Pronunciation Practice</h1>
                    <p>Choose a topic to practise with YouTube shadowing, IPA guide and key vocabulary.</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {(topicsError || detailError) && (
                <div className="pp-error-card">
                  ⚠️ {(topicsError || detailError) instanceof Error
                    ? (topicsError || detailError)!.message
                    : "Unable to load data. Please try again."}
                </div>
              )}

              {/* List view */}
              {!selectedId && (
                <>
                  {topicsLoading ? (
                    <TopicListSkeleton />
                  ) : topics && topics.length === 0 ? (
                    <div className="pp-empty-state">
                      <div className="pp-empty-state-icon">📭</div>
                      <h3>No topics yet</h3>
                      <p>Pronunciation topics will appear here once they're added.</p>
                    </div>
                  ) : (
                    <div className="pp-topic-grid">
                      {(topics ?? []).map((topic) => (
                        <button
                          key={topic.id}
                          id={`pronunciation-topic-${topic.id}`}
                          onClick={() => setSelectedId(topic.id)}
                          className="pp-topic-card"
                        >
                          <div className="pp-topic-card-header">
                            <div className="pp-topic-card-icon-wrap">🎙️</div>
                            <span className="pp-topic-card-title">{topic.title}</span>
                          </div>
                          <div className="pp-topic-card-meta">
                            <span className="pp-topic-card-badge">
                              📚 {topic.vocabCount} vocabularies
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Detail view */}
              {selectedId && (
                detailLoading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, color: "#64748b", fontSize: 15 }}>
                    <span style={{ marginRight: 8, display: "inline-block", animation: "pp-shimmer 1.4s infinite" }}>⟳</span>
                    Loading topic…
                  </div>
                ) : detail ? (
                  <TopicDetail detail={detail} onBack={handleBack} />
                ) : null
              )}

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}