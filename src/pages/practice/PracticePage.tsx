import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import PracticeSidebar from "@/components/practice/PracticeSidebar"
import PracticeCard from "@/components/practice/PracticeCard"
import ModeSelectModal from "@/components/SelectModal/ModeSelectModal"
import AuthRequiredModal from "@/components/SelectModal/AuthRequiredModal"
import { loginWithGoogle } from "@/services/auth/SignUpWithGoogle"
import { useAuthStore } from "@/services/auth/auth.store"
import { usePracticeStore } from "@/services/practice/practice.store"
import { usePracticeSkills, useSkillPreview } from "@/hooks/usePractice"
import "./style.css"

export default function PracticePage() {
  const { skill: skillParam } = useParams<{ skill: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  // 1. Sử dụng Zustand Store cho Sidebar
  const { sidebar, setSidebar } = usePracticeStore()

  // 2. use TanStack Query for lists Skills
  const { data: rawSkills = [], isLoading: loading } = usePracticeSkills()

  const [openModal, setOpenModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState<any>(null)

  const handleClickTest = (test: any) => {
    setSelectedTest(test)
    setOpenModal(true)
  }

  const handleStart = async (mode: "practice" | "exam") => {
    if (!selectedTest) return

    if (!isAuthenticated) {
      // 1. Lưu path hiện tại để quay lại sau khi login
      const currentPath = location.pathname + location.search
      localStorage.setItem("redirectAfterLogin", currentPath)
      
      // 2. Tắt Modal chọn mode (nếu đang bật) và hiện Modal yêu cầu Login
      setOpenModal(false)
      setShowAuthModal(true)
      return
    }

    try {
      setOpenModal(false)
      navigate(
        `/practice/${sidebar.skill}/test/${selectedTest.id}?unit=${selectedTest.unitId}`,
        { state: { mode } }
      )
    } catch (err) {
      console.error("Start exam failed:", err)
    }
  }

  // Sync URL param → Zustand Store
  useEffect(() => {
    if (skillParam && skillParam !== sidebar.skill) {
      setSidebar({
        skill: skillParam as any,
        subSection: sidebar.mode === "single" ? 1 : null,
      })
    }
  }, [skillParam, sidebar.skill, sidebar.mode, setSidebar])

  const activeSkills = rawSkills.filter(
    (s: any) => s.skillType.toLowerCase() === sidebar.skill
  )

  const pageTitle =
    sidebar.mode === "full"
      ? "Full test"
      : getSubSectionLabel(sidebar.skill, sidebar.subSection)

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
        }}
      >
        <PracticeSidebar />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>
            {sidebar.skill.charAt(0).toUpperCase() + sidebar.skill.slice(1)} — {pageTitle}
          </h2>

          {loading ? (
            <p style={{ color: "#888" }}>Đang tải danh sách bài tập...</p>
          ) : activeSkills.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 14 }}>Chưa có bài tập nào cho kỹ năng này.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
                gap: 20,
              }}
            >
              {activeSkills.map((skill: any) => (
                <SkillCardGroup
                  key={skill.skillContentId}
                  skill={skill}
                  sidebar={sidebar}
                  onClickTest={handleClickTest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ModeSelectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onStart={handleStart}
      />

      <AuthRequiredModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </MainLayout>
  )
}

function SkillCardGroup({ skill, sidebar, onClickTest }: any) {
  const { data: enriched, isLoading } = useSkillPreview(skill.skillContentId)

  if (isLoading) {
    return (
      <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 20, background: "#f9f9f9", height: 160 }} className="animate-pulse">
        <div style={{ height: 20, background: "#eee", borderRadius: 4, width: "70%", marginBottom: 10 }}></div>
        <div style={{ height: 15, background: "#eee", borderRadius: 4, width: "40%" }}></div>
      </div>
    )
  }

  if (!enriched) return null

  const units = enriched.units || []

  const cards = sidebar.mode === "full"
    ? [{
      id: skill.skillContentId,
      title: enriched.source || skill.title,
      questions: units.flatMap((u: any) => u.questionBlocks?.flatMap((b: any) => b.questions || []) || []).length,
      numberOfVisits: skill.numberOfVisits,
      unitId: "full",
    }]
    : units.filter((u: any) => u.id === sidebar.subSection).map((u: any) => ({
      id: skill.skillContentId,
      title: u.title,
      questions: u.questionBlocks?.flatMap((b: any) => b.questions || [])?.length || 0,
      numberOfVisits: skill.numberOfVisits,
      unitId: String(u.id),
    }))

  return (
    <>
      {cards.map((c: any) => (
        <PracticeCard
          key={`${skill.skillContentId}-${c.unitId}`}
          {...c}
          progress={0}
          onClick={() => onClickTest(c)}
        />
      ))}
    </>
  )
}

function getSubSectionLabel(skill: string, sub: number | null): string {
  if (sub == null) return ""
  switch (skill) {
    case "reading": return `Passage ${sub}`
    case "listening": return `Section ${sub}`
    case "writing": return `Task ${sub}`
    case "speaking": return `Part ${sub}`
    default: return String(sub)
  }
}