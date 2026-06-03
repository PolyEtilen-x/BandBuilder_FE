// src/pages/admin/components/MaterialsTab.tsx

import { useState, useEffect } from "react"
import "./MaterialsTab.css"
import { vocabApi } from "@/api/materials/vocab.api"
import { grammarApi } from "@/api/materials/grammar.api"
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  X,
  Layers,
  AlertCircle,
  FileText,
  HelpCircle
} from "lucide-react"

// Types
interface VocabTopicAdmin {
  id: string
  topic: string
  numberSaved: number
  wordCount?: number
  type?: string
  bandLevel?: number
  vocab_list?: any[]
}

export default function MaterialsTab() {
  const [activeSubTab, setActiveSubTab] = useState<"vocab" | "grammar">("vocab")

  // ─── Vocab States ────────────────────────────────────────────────────────────
  const [topics, setTopics] = useState<VocabTopicAdmin[]>([])
  const [selectedTopic, setSelectedTopic] = useState<VocabTopicAdmin | null>(null)
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<any>(null)
  const [vocabLoading, setVocabLoading] = useState(false)

  // Vocab Modals
  const [topicModalOpen, setTopicModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<VocabTopicAdmin | null>(null)
  const [wordModalOpen, setWordModalOpen] = useState(false)
  const [editingWord, setEditingWord] = useState<any | null>(null)

  // Vocab Form Fields
  const [topicName, setTopicName] = useState("")
  const [topicType, setTopicType] = useState<"TOPIC" | "BAND_LR" | "BAND_SW">("TOPIC")
  const [bandLevel, setBandLevel] = useState<number | "">("")

  const [wordText, setWordText] = useState("")
  const [wordMeaning, setWordMeaning] = useState("")
  const [wordPronunciation, setWordPronunciation] = useState("")
  const [wordExample, setWordExample] = useState("")
  const [wordSynonyms, setWordSynonyms] = useState("")

  // ─── Grammar States ──────────────────────────────────────────────────────────
  const [activeGrammarType, setActiveGrammarType] = useState<"sections" | "mistakes">("sections")
  const [sections, setSections] = useState<any[]>([])
  const [mistakes, setMistakes] = useState<any[]>([])
  const [grammarLoading, setGrammarLoading] = useState(false)

  // Grammar Modals
  const [sectionModalOpen, setSectionModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<any | null>(null)
  const [mistakeModalOpen, setMistakeModalOpen] = useState(false)
  const [editingMistake, setEditingMistake] = useState<any | null>(null)

  // Grammar Form Fields
  const [secCategory, setSecCategory] = useState("basics")
  const [secSubCategory, setSecSubCategory] = useState("morphology")
  const [secTitle, setSecTitle] = useState("")
  const [secRuleSummary, setSecRuleSummary] = useState("")
  const [secIeltsStrategy, setSecIeltsStrategy] = useState("")
  const [secRawContentJson, setSecRawContentJson] = useState("") // raw examples/practiceCases JSON for advanced edit
  const [secOrderIndex, setSecOrderIndex] = useState(0)

  const [misCategory, setMisCategory] = useState("Subject-Verb Agreement")
  const [misIncorrect, setMisIncorrect] = useState("")
  const [misCorrect, setMisCorrect] = useState("")
  const [misNote, setMisNote] = useState("")
  const [misOrderIndex, setMisOrderIndex] = useState(0)

  // ─── Initial Load ────────────────────────────────────────────────────────────
  useEffect(() => {
    loadVocabTopics()
  }, [])

  useEffect(() => {
    if (activeSubTab === "grammar") {
      loadGrammarData()
    }
  }, [activeSubTab, activeGrammarType])

  const loadVocabTopics = async () => {
    try {
      setVocabLoading(true)
      const res = await vocabApi.getTopics()
      // Note: Backend returns t.wordCount in list API, let's map it
      // Let's call the detailed getTopic for each to get details or use backend values
      setTopics(res as any)
    } catch (err) {
      console.error("Failed to load vocab topics:", err)
    } finally {
      setVocabLoading(false)
    }
  }

  const loadTopicDetail = async (topic: VocabTopicAdmin) => {
    try {
      setVocabLoading(true)
      setSelectedTopic(topic)
      const res = await vocabApi.getTopic(topic.topic)
      setSelectedTopicDetail(res)
    } catch (err) {
      console.error("Failed to load topic detail:", err)
    } finally {
      setVocabLoading(false)
    }
  }

  const loadGrammarData = async () => {
    try {
      setGrammarLoading(true)
      if (activeGrammarType === "sections") {
        const basicsRes = await grammarApi.getBasics()
        const tensesRes = await grammarApi.getTenses()
        const sentencesRes = await grammarApi.getSentences()

        // Map them back to local state sections
        const allSections = [
          ...basicsRes.map(item => ({ ...item, category: "basics", subCategory: item.category.toLowerCase(), rawContent: item })),
          ...tensesRes.map(item => ({ ...item, category: "tenses", subCategory: "tenses", rawContent: item })),
          ...sentencesRes.map(item => ({ ...item, category: "sentence", subCategory: "sentence", rawContent: item }))
        ]
        setSections(allSections)
      } else {
        // Grouped mistakes from API
        const groupedMistakes = await grammarApi.getMistakes()
        // Flat mapping to display easily in list
        const flatMistakes: any[] = []
        groupedMistakes.forEach(cat => {
          cat.mistakes.forEach(m => {
            flatMistakes.push({
              id: m.id,
              category: cat.category,
              incorrect: m.incorrect,
              correct: m.correct,
              note: m.note
            })
          })
        })
        setMistakes(flatMistakes)
      }
    } catch (err) {
      console.error("Failed to load grammar data:", err)
    } finally {
      setGrammarLoading(false)
    }
  }

  // ─── Vocab Handlers ──────────────────────────────────────────────────────────
  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dto = {
        name: topicName,
        type: topicType,
        bandLevel: topicType !== "TOPIC" && bandLevel !== "" ? Number(bandLevel) : undefined
      }

      if (editingTopic) {
        await vocabApi.updateTopic(editingTopic.id, dto)
      } else {
        await vocabApi.createTopic(dto)
      }

      setTopicModalOpen(false)
      setEditingTopic(null)
      loadVocabTopics()
    } catch (err: any) {
      alert("Lỗi khi lưu Topic: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteTopic = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chủ đề này cùng tất cả từ vựng của nó không?")) return
    try {
      await vocabApi.deleteTopic(id)
      loadVocabTopics()
    } catch (err: any) {
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message))
    }
  }

  const handleWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTopicDetail || !selectedTopic) return
    try {
      const synArr = wordSynonyms
        ? wordSynonyms.split(",").map(s => s.trim()).filter(Boolean)
        : []

      const dto = {
        word: wordText,
        meaning: wordMeaning,
        pronunciation: wordPronunciation || undefined,
        example: wordExample || undefined,
        synonyms: synArr
      }

      // Backend expects topicId for createWord, which is inside selectedTopic.id
      if (editingWord) {
        await vocabApi.updateWord(editingWord.id, dto)
      } else {
        // Find topic ID from topics list corresponding to selectedTopicDetail
        const match = topics.find(t => t.topic === selectedTopicDetail.topic)
        if (!match) throw new Error("Không tìm thấy ID của Topic")
        await vocabApi.createWord(match.id, dto)
      }

      setWordModalOpen(false)
      setEditingWord(null)
      loadTopicDetail(selectedTopic)
    } catch (err: any) {
      alert("Lỗi khi lưu từ: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteWord = async (wordId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa từ vựng này không?")) return
    if (!selectedTopic) return
    try {
      await vocabApi.deleteWord(wordId)
      loadTopicDetail(selectedTopic)
    } catch (err: any) {
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message))
    }
  }

  const openEditTopic = (topic: VocabTopicAdmin) => {
    setEditingTopic(topic)
    setTopicName(topic.topic)
    setTopicType((topic.type as any) || "TOPIC")
    setBandLevel(topic.bandLevel !== undefined && topic.bandLevel !== null ? topic.bandLevel : "")
    setTopicModalOpen(true)
  }

  const openAddTopic = () => {
    setEditingTopic(null)
    setTopicName("")
    setTopicType("TOPIC")
    setBandLevel("")
    setTopicModalOpen(true)
  }

  const openEditWord = (word: any) => {
    setEditingWord(word)
    setWordText(word.word)
    setWordMeaning(word.meaning)
    setWordPronunciation(word.pronunciation || "")
    setWordExample(word.example || "")
    setWordSynonyms(word.synonyms ? word.synonyms.join(", ") : "")
    setWordModalOpen(true)
  }

  const openAddWord = () => {
    setEditingWord(null)
    setWordText("")
    setWordMeaning("")
    setWordPronunciation("")
    setWordExample("")
    setWordSynonyms("")
    setWordModalOpen(true)
  }

  // ─── Grammar Handlers ────────────────────────────────────────────────────────
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Parse content JSON block
      let contentBlock: any = { ieltsStrategy: secIeltsStrategy }
      if (secRawContentJson) {
        try {
          const parsed = JSON.parse(secRawContentJson)
          if (secCategory === "basics") {
            contentBlock.practiceCases = parsed.practiceCases || parsed
          } else {
            contentBlock.examples = parsed.examples || parsed
          }
        } catch {
          alert("Lỗi cú pháp JSON trong mục nâng cao (Content JSON). Vui lòng nhập đúng JSON format.")
          return
        }
      } else {
        // default empty structures
        if (secCategory === "basics") {
          contentBlock.practiceCases = []
        } else {
          contentBlock.examples = []
        }
      }

      const dto = {
        category: secCategory,
        subCategory: secSubCategory,
        title: secTitle,
        ruleSummary: secRuleSummary,
        content: contentBlock,
        orderIndex: Number(secOrderIndex)
      }

      if (editingSection) {
        await grammarApi.updateSection(editingSection.id, dto)
      } else {
        await grammarApi.createSection(dto)
      }

      setSectionModalOpen(false)
      setEditingSection(null)
      loadGrammarData()
    } catch (err: any) {
      alert("Lỗi khi lưu Section: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài học ngữ pháp này không?")) return
    try {
      await grammarApi.deleteSection(id)
      loadGrammarData()
    } catch (err: any) {
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message))
    }
  }

  const handleMistakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const dto = {
        category: misCategory,
        incorrect: misIncorrect,
        correct: misCorrect,
        note: misNote,
        orderIndex: Number(misOrderIndex)
      }

      if (editingMistake) {
        await grammarApi.updateMistake(editingMistake.id, dto)
      } else {
        await grammarApi.createMistake(dto)
      }

      setMistakeModalOpen(false)
      setEditingMistake(null)
      loadGrammarData()
    } catch (err: any) {
      alert("Lỗi khi lưu Mistake: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDeleteMistake = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lỗi thường gặp này không?")) return
    try {
      await grammarApi.deleteMistake(id)
      loadGrammarData()
    } catch (err: any) {
      alert("Lỗi khi xóa: " + (err.response?.data?.message || err.message))
    }
  }

  const openAddSection = () => {
    setEditingSection(null)
    setSecCategory("basics")
    setSecSubCategory("morphology")
    setSecTitle("")
    setSecRuleSummary("")
    setSecIeltsStrategy("")
    setSecRawContentJson("")
    setSecOrderIndex(0)
    setSectionModalOpen(true)
  }

  const openEditSection = (section: any) => {
    setEditingSection(section)
    setSecCategory(section.category)
    setSecSubCategory(section.subCategory)
    // Tense and sentence list items mapped values
    setSecTitle(section.title || section.tense_name || "")
    setSecRuleSummary(section.ruleSummary || section.structure || "")
    setSecIeltsStrategy(section.ieltsStrategy || section.ielts_application || "")

    // Format raw examples/practiceCases JSON for advanced edit
    const content = section.rawContent?.content || {}
    const subObj = section.category === "basics"
      ? { practiceCases: content.practiceCases || [] }
      : { examples: content.examples || [] }
    setSecRawContentJson(JSON.stringify(subObj, null, 2))

    setSecOrderIndex(section.orderIndex || 0)
    setSectionModalOpen(true)
  }

  const openAddMistake = () => {
    setEditingMistake(null)
    setMisCategory("Subject-Verb Agreement")
    setMisIncorrect("")
    setMisCorrect("")
    setMisNote("")
    setMisOrderIndex(0)
    setMistakeModalOpen(true)
  }

  const openEditMistake = (mistake: any) => {
    setEditingMistake(mistake)
    setMisCategory(mistake.category)
    setMisIncorrect(mistake.incorrect)
    setMisCorrect(mistake.correct)
    setMisNote(mistake.note)
    setMisOrderIndex(mistake.orderIndex || 0)
    setMistakeModalOpen(true)
  }

  return (
    <div className="materials-container">

      {/* HEADER */}
      <div className="materials-header">
        <div>
          <h2 className="materials-title">Quản trị Học liệu & Tài liệu</h2>
          <p className="materials-sub-title">Quản lý cơ sở dữ liệu ôn tập từ vựng chủ đề, từ vựng theo band và lý thuyết ngữ pháp.</p>
        </div>

        {activeSubTab === "vocab" && !selectedTopicDetail && (
          <button className="materials-btn-blue" onClick={openAddTopic}>
            <Plus size={16} /> Thêm Topic mới
          </button>
        )}

        {activeSubTab === "grammar" && activeGrammarType === "sections" && (
          <button className="materials-btn-blue" onClick={openAddSection}>
            <Plus size={16} /> Thêm Section mới
          </button>
        )}

        {activeSubTab === "grammar" && activeGrammarType === "mistakes" && (
          <button className="materials-btn-blue" onClick={openAddMistake}>
            <Plus size={16} /> Thêm Lỗi mới
          </button>
        )}
      </div>

      {/* TABS SELECTOR */}
      <div className="materials-tab-bar">
        <button
          className={`materials-tab-button ${activeSubTab === "vocab" ? "active" : ""}`}
          onClick={() => { setActiveSubTab("vocab"); setSelectedTopic(null); setSelectedTopicDetail(null) }}
        >
          Từ vựng (Vocabulary)
        </button>
        <button
          className={`materials-tab-button ${activeSubTab === "grammar" ? "active" : ""}`}
          onClick={() => setActiveSubTab("grammar")}
        >
          Ngữ pháp (Grammar)
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          VOCABULARY TAB CONTENT
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "vocab" && (
        <>
          {vocabLoading && <p>Đang tải dữ liệu từ vựng...</p>}

          {/* 1. TOPIC DETAILS VIEW */}
          {selectedTopicDetail ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  className="materials-btn-outline"
                  onClick={() => { setSelectedTopic(null); setSelectedTopicDetail(null) }}
                >
                  <ArrowLeft size={14} /> Quay lại danh sách
                </button>
                <button className="materials-btn-blue" onClick={openAddWord}>
                  <Plus size={14} /> Thêm Từ vựng mới
                </button>
              </div>

              {/* Title Card */}
              <div className="materials-white-card" style={{ minHeight: "auto", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Chủ đề: {selectedTopicDetail.topic}</h3>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Có {selectedTopicDetail.vocab_list?.length || 0} từ vựng trong hệ thống</span>
                </div>
                <span className={`materials-badge ${(selectedTopic?.type || "TOPIC").toLowerCase().replace(/_/g, "-")}`}>
                  {selectedTopic?.type === "TOPIC" ? "Topic chung" : `Band ${selectedTopic?.bandLevel}`}
                </span>
              </div>

              {/* Words Table */}
              <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                <table className="materials-table">
                  <thead>
                    <tr>
                      <th className="materials-th">Từ vựng</th>
                      <th className="materials-th">Phiên âm</th>
                      <th className="materials-th">Định nghĩa (Tiếng Việt)</th>
                      <th className="materials-th">Ví dụ đặt câu</th>
                      <th className="materials-th">Từ đồng nghĩa</th>
                      <th className="materials-th" style={{ textAlign: "right" }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTopicDetail.vocab_list?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="materials-td" style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>Chưa có từ vựng nào trong chủ đề này. Nhấn "Thêm Từ vựng mới" để bổ sung.</td>
                      </tr>
                    ) : (
                      selectedTopicDetail.vocab_list.map((w: any) => (
                        <tr key={w.id}>
                          <td className="materials-td" style={{ fontWeight: 700, color: "#2563eb" }}>{w.word}</td>
                          <td className="materials-td" style={{ fontFamily: "monospace", color: "#64748b" }}>{w.pronunciation}</td>
                          <td className="materials-td">{w.meaning}</td>
                          <td className="materials-td" style={{ fontStyle: "italic", maxWidth: "250px" }}>{w.example}</td>
                          <td className="materials-td">
                            {w.synonyms && w.synonyms.map((s: string) => (
                              <span key={s} style={{ display: "inline-block", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", marginRight: "4px", marginBottom: "4px" }}>
                                {s}
                              </span>
                            ))}
                          </td>
                          <td className="materials-td" style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "8px", justifyContent: "flex-end" }}>
                              <button className="materials-btn-outline" onClick={() => openEditWord(w)}>
                                <Edit3 size={13} />
                              </button>
                              <button className="materials-btn-danger" onClick={() => handleDeleteWord(w.id)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 2. TOPICS LIST VIEW */
            <div className="materials-card-grid">
              {topics.map((t) => (
                <div key={t.id} className="materials-white-card">
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span className={`materials-badge ${(t.type || "TOPIC").toLowerCase().replace(/_/g, "-")}`}>
                      {t.type === "TOPIC" ? "Topic chung" : `Band ${t.bandLevel}`}
                    </span>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", margin: "4px 0 0 0" }}>{t.topic}</h3>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Từ vựng: <strong>{t.wordCount ?? t.vocab_list?.length ?? 0}</strong> từ</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "12px", gap: "8px" }}>
                    <button className="materials-btn-outline" onClick={() => loadTopicDetail(t)}>
                      Chi tiết
                    </button>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="materials-btn-outline" style={{ padding: "6px 8px" }} onClick={() => openEditTopic(t)}>
                        <Edit3 size={13} />
                      </button>
                      <button className="materials-btn-danger" style={{ padding: "6px 8px" }} onClick={() => handleDeleteTopic(t.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          GRAMMAR TAB CONTENT
          ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "grammar" && (
        <>
          {/* Sub menu */}
          <div className="materials-sub-tab-bar">
            <button
              className={`materials-sub-tab-button ${activeGrammarType === "sections" ? "active" : ""}`}
              onClick={() => setActiveGrammarType("sections")}
            >
              Lý thuyết (Sections)
            </button>
            <button
              className={`materials-sub-tab-button ${activeGrammarType === "mistakes" ? "active" : ""}`}
              onClick={() => setActiveGrammarType("mistakes")}
            >
              Lỗi thường gặp (Mistakes)
            </button>
          </div>

          {grammarLoading && <p>Đang tải dữ liệu ngữ pháp...</p>}

          {/* 1. GRAMMAR SECTIONS VIEW */}
          {activeGrammarType === "sections" && (
            <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <table className="materials-table">
                <thead>
                  <tr>
                    <th className="materials-th">Phân mục</th>
                    <th className="materials-th">Phân mục nhỏ</th>
                    <th className="materials-th">Tên bài học</th>
                    <th className="materials-th">Tóm tắt quy tắc</th>
                    <th className="materials-th">Order</th>
                    <th className="materials-th" style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="materials-td" style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>Chưa có bài học ngữ pháp nào trong hệ thống. Nhấn "Thêm Section mới" để bổ sung.</td>
                    </tr>
                  ) : (
                    sections.map((s: any) => (
                      <tr key={s.id}>
                        <td className="materials-td" style={{ fontWeight: 700, textTransform: "capitalize" }}>{s.category}</td>
                        <td className="materials-td" style={{ textTransform: "capitalize" }}>{s.subCategory}</td>
                        <td className="materials-td" style={{ color: "#2563eb", fontWeight: 600 }}>{s.title || s.tense_name}</td>
                        <td className="materials-td" style={{ color: "#64748b", maxWidth: "300px" }}>{s.ruleSummary || s.structure}</td>
                        <td className="materials-td">{s.orderIndex}</td>
                        <td className="materials-td" style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button className="materials-btn-outline" onClick={() => openEditSection(s)}>
                              <Edit3 size={13} />
                            </button>
                            <button className="materials-btn-danger" onClick={() => handleDeleteSection(s.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. GRAMMAR MISTAKES VIEW */}
          {activeGrammarType === "mistakes" && (
            <div style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
              <table className="materials-table">
                <thead>
                  <tr>
                    <th className="materials-th">Nhóm lỗi</th>
                    <th className="materials-th">Câu sai (Incorrect)</th>
                    <th className="materials-th">Câu đúng (Correct)</th>
                    <th className="materials-th">Phân tích / Ghi chú</th>
                    <th className="materials-th" style={{ textAlign: "right" }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {mistakes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="materials-td" style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>Chưa có lỗi mẫu nào trong hệ thống. Nhấn "Thêm Lỗi mới" để bổ sung.</td>
                    </tr>
                  ) : (
                    mistakes.map((m: any) => (
                      <tr key={m.id}>
                        <td className="materials-td" style={{ fontWeight: 700 }}>{m.category}</td>
                        <td className="materials-td" style={{ color: "#ef4444", textDecoration: "line-through" }}>{m.incorrect}</td>
                        <td className="materials-td" style={{ color: "#15803d", fontWeight: 600 }}>{m.correct}</td>
                        <td className="materials-td" style={{ color: "#64748b", maxWidth: "350px" }}>{m.note}</td>
                        <td className="materials-td" style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button className="materials-btn-outline" onClick={() => openEditMistake(m)}>
                              <Edit3 size={13} />
                            </button>
                            <button className="materials-btn-danger" onClick={() => handleDeleteMistake(m.id)}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          MODALS & DIALOGS
          ──────────────────────────────────────────────────────────────────────── */}

      {/* 1. VOCAB TOPIC MODAL */}
      {topicModalOpen && (
        <div className="materials-modal-overlay">
          <div className="materials-modal-card">
            <div className="materials-modal-header">
              <h3 className="materials-modal-title">{editingTopic ? "Sửa chủ đề từ vựng" : "Thêm chủ đề từ vựng mới"}</h3>
              <button onClick={() => setTopicModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleTopicSubmit}>
              <div className="materials-modal-body">
                <div className="materials-form-group">
                  <label className="materials-label">Tên Chủ đề (Topic Name)</label>
                  <input
                    type="text"
                    required
                    value={topicName}
                    onChange={e => setTopicName(e.target.value)}
                    placeholder="ví dụ: Technology, Environment..."
                    className="materials-input"
                  />
                </div>

                <div className="materials-form-group">
                  <label className="materials-label">Phân loại</label>
                  <select
                    value={topicType}
                    onChange={e => setTopicType(e.target.value as any)}
                    className="materials-input"
                    style={{ height: "38px" }}
                  >
                    <option value="TOPIC">Topic ôn tập chung (Không phân Band)</option>
                    <option value="BAND_LR">Từ vựng theo Band (Listening & Reading)</option>
                    <option value="BAND_SW">Từ vựng theo Band (Speaking & Writing)</option>
                  </select>
                </div>

                {topicType !== "TOPIC" && (
                  <div className="materials-form-group">
                    <label className="materials-label">Cấp độ Band (5/6/7/8)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      max={9}
                      value={bandLevel}
                      onChange={e => setBandLevel(e.target.value !== "" ? Number(e.target.value) : "")}
                      placeholder="Nhập 5, 6, 7 hoặc 8"
                      className="materials-input"
                    />
                  </div>
                )}
              </div>
              <div className="materials-modal-footer">
                <button type="button" className="materials-btn-outline" onClick={() => setTopicModalOpen(false)}>Hủy</button>
                <button type="submit" className="materials-btn-blue">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VOCAB WORD MODAL */}
      {wordModalOpen && (
        <div className="materials-modal-overlay">
          <div className="materials-modal-card">
            <div className="materials-modal-header">
              <h3 className="materials-modal-title">{editingWord ? "Sửa từ vựng" : "Thêm từ vựng mới"}</h3>
              <button onClick={() => setWordModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleWordSubmit}>
              <div className="materials-modal-body">
                <div className="materials-form-group">
                  <label className="materials-label">Từ vựng</label>
                  <input type="text" required value={wordText} onChange={e => setWordText(e.target.value)} className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Định nghĩa (Tiếng Việt)</label>
                  <input type="text" required value={wordMeaning} onChange={e => setWordMeaning(e.target.value)} className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Phiên âm (IPA)</label>
                  <input type="text" value={wordPronunciation} onChange={e => setWordPronunciation(e.target.value)} placeholder="ví dụ: /ˌɪn.əˈveɪ.ʃən/" className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Ví dụ đặt câu</label>
                  <textarea value={wordExample} onChange={e => setWordExample(e.target.value)} className="materials-textarea"></textarea>
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Từ đồng nghĩa (Cách nhau bằng dấu phẩy)</label>
                  <input type="text" value={wordSynonyms} onChange={e => setWordSynonyms(e.target.value)} placeholder="ví dụ: creation, novelty" className="materials-input" />
                </div>
              </div>
              <div className="materials-modal-footer">
                <button type="button" className="materials-btn-outline" onClick={() => setWordModalOpen(false)}>Hủy</button>
                <button type="submit" className="materials-btn-blue">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. GRAMMAR SECTION MODAL */}
      {sectionModalOpen && (
        <div className="materials-modal-overlay">
          <div className="materials-modal-card" style={{ maxWidth: "600px" }}>
            <div className="materials-modal-header">
              <h3 className="materials-modal-title">{editingSection ? "Sửa bài học ngữ pháp" : "Thêm bài học ngữ pháp mới"}</h3>
              <button onClick={() => setSectionModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSectionSubmit}>
              <div className="materials-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="materials-form-group">
                    <label className="materials-label">Phân mục (Category)</label>
                    <select
                      value={secCategory}
                      onChange={e => setSecCategory(e.target.value)}
                      className="materials-input"
                      style={{ height: "38px" }}
                    >
                      <option value="basics">Basics (Cơ bản)</option>
                      <option value="tenses">Tenses (Thì)</option>
                      <option value="sentence">Sentence (Câu ghép/phức)</option>
                    </select>
                  </div>
                  <div className="materials-form-group">
                    <label className="materials-label">Mục phụ (Sub Category)</label>
                    {secCategory === "basics" ? (
                      <select value={secSubCategory} onChange={e => setSecSubCategory(e.target.value)} className="materials-input" style={{ height: "38px" }}>
                        <option value="morphology">Morphology (Từ vựng học)</option>
                        <option value="syntax">Syntax (Cú pháp học)</option>
                        <option value="mechanics">Mechanics (Quy tắc viết)</option>
                        <option value="phonetics">Phonetics (Ngữ âm)</option>
                      </select>
                    ) : (
                      <input type="text" value={secSubCategory} onChange={e => setSecSubCategory(e.target.value)} placeholder="ví dụ: tenses, compound..." className="materials-input" />
                    )}
                  </div>
                </div>

                <div className="materials-form-group">
                  <label className="materials-label">Tiêu đề bài học</label>
                  <input type="text" required value={secTitle} onChange={e => setSecTitle(e.target.value)} placeholder="ví dụ: Nouns, Present Simple..." className="materials-input" />
                </div>

                <div className="materials-form-group">
                  <label className="materials-label">Quy tắc cấu trúc tóm tắt</label>
                  <textarea required value={secRuleSummary} onChange={e => setSecRuleSummary(e.target.value)} placeholder="ví dụ: S + V-s/es + O..." className="materials-textarea"></textarea>
                </div>

                <div className="materials-form-group">
                  <label className="materials-label">Chiến lược IELTS (IELTS Strategy)</label>
                  <textarea value={secIeltsStrategy} onChange={e => setSecIeltsStrategy(e.target.value)} placeholder="Mẹo áp dụng trong bài viết/nói..." className="materials-textarea"></textarea>
                </div>

                <div className="materials-form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="materials-label">Mục nâng cao: Dữ liệu mẫu (Content JSON)</label>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>(Xem định dạng trong materials-api-tests.md)</span>
                  </div>
                  <textarea
                    value={secRawContentJson}
                    onChange={e => setSecRawContentJson(e.target.value)}
                    placeholder={secCategory === "basics" ? '{\n  "practiceCases": [\n    {"type": "Noun Plural", "input": "child", "transformed": "children"}\n  ]\n}' : '{\n  "examples": [\n    {"sentence": "I study everyday.", "context": "Daily routine", "note": "Present state"}\n  ]\n}'}
                    className="materials-textarea"
                    style={{ minHeight: "120px", fontFamily: "monospace", fontSize: "12px" }}
                  ></textarea>
                </div>

                <div className="materials-form-group">
                  <label className="materials-label">Thứ tự hiển thị (Order Index)</label>
                  <input type="number" value={secOrderIndex} onChange={e => setSecOrderIndex(Number(e.target.value) || 0)} className="materials-input" />
                </div>
              </div>
              <div className="materials-modal-footer">
                <button type="button" className="materials-btn-outline" onClick={() => setSectionModalOpen(false)}>Hủy</button>
                <button type="submit" className="materials-btn-blue">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. GRAMMAR MISTAKE MODAL */}
      {mistakeModalOpen && (
        <div className="materials-modal-overlay">
          <div className="materials-modal-card">
            <div className="materials-modal-header">
              <h3 className="materials-modal-title">{editingMistake ? "Sửa lỗi ngữ pháp mẫu" : "Thêm lỗi mẫu mới"}</h3>
              <button onClick={() => setMistakeModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleMistakeSubmit}>
              <div className="materials-modal-body">
                <div className="materials-form-group">
                  <label className="materials-label">Nhóm lỗi (Category)</label>
                  <input type="text" required value={misCategory} onChange={e => setMisCategory(e.target.value)} placeholder="ví dụ: Articles, Subject-Verb Agreement..." className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Câu sai (Incorrect)</label>
                  <input type="text" required value={misIncorrect} onChange={e => setMisIncorrect(e.target.value)} className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Câu đúng (Correct)</label>
                  <input type="text" required value={misCorrect} onChange={e => setMisCorrect(e.target.value)} className="materials-input" />
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Phân tích ghi chú</label>
                  <textarea required value={misNote} onChange={e => setMisNote(e.target.value)} placeholder="Giải thích vì sao sai và sửa thế nào..." className="materials-textarea"></textarea>
                </div>
                <div className="materials-form-group">
                  <label className="materials-label">Thứ tự hiển thị (Order Index)</label>
                  <input type="number" value={misOrderIndex} onChange={e => setMisOrderIndex(Number(e.target.value) || 0)} className="materials-input" />
                </div>
              </div>
              <div className="materials-modal-footer">
                <button type="button" className="materials-btn-outline" onClick={() => setMistakeModalOpen(false)}>Hủy</button>
                <button type="submit" className="materials-btn-blue">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
