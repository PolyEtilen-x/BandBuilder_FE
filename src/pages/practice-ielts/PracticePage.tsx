import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import PracticeSidebar from "@/components/practice/PracticeSidebar"
import PracticeCard from "@/components/practice/PracticeCard"
import ModeSelectModal from "@/components/SelectModal/ModeSelectModal"
import AuthRequiredModal from "@/components/SelectModal/AuthRequiredModal"
import { useAuthStore } from "@/services/auth/auth.store"
import { usePracticeStore } from "@/services/practice/practice.store"
import { usePracticeSkills, useSkillPreview } from "@/hooks/usePractice"
import { practiceApi } from "@/api/practice.api"
import { useUIStore } from "@/services/ui/ui.store"
import { setCookie } from "@/utils/cookie"
import "./style.css"

export default function PracticePage() {
  const { skill: skillParam } = useParams<{ skill: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  // 1. Use Zustand Store for Sidebar
  const { sidebar, setSidebar, setStartTime } = usePracticeStore()

  // 2. use TanStack Query for lists Skills
  const { data: rawSkills = [], isLoading: loading } = usePracticeSkills()

  const [openModal, setOpenModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState<any>(null)

  // UI state hooks
  const { t, language } = useUIStore()

  const handleClickTest = (test: any) => {
    setSelectedTest(test)
    setOpenModal(true)
  }

  const handleStart = async (mode: "practice" | "exam") => {
    if (!selectedTest) return

    if (!isAuthenticated) {
      // 1. Save current path to return after login
      const currentPath = location.pathname + location.search
      setCookie("redirectAfterLogin", currentPath, 1)

      // 2. Hide mode select and show login required modal
      setOpenModal(false)
      setShowAuthModal(true)
      return
    }

    const practiceTestId = selectedTest.practiceTestId
    if (!practiceTestId || practiceTestId === "undefined") {
      alert(language === "vi" ? "Lỗi: ID đề thi không hợp lệ. Vui lòng thử đề thi khác." : "Error: Test ID is invalid. Please try another test.")
      return
    }

    try {
      setOpenModal(false)

      let testId: string;
      try {
        // 1. Start overall Test session (POST /practice/tests/:practiceTestId/start)
        const startRes = await practiceApi.startTestSession(practiceTestId)
        testId = startRes.data.testId
      } catch (err: any) {
        // Handle case where a test is already in progress (Conflict 409)
        const errorMessage = err?.response?.data?.message || "";
        const match = errorMessage.match(/testId:\s*([a-fA-F0-9-]+)/) || errorMessage.match(/testId:\s*([^)]+)/);
        if (err?.response?.status === 409 && match && match[1]) {
          testId = match[1];
        } else {
          throw err;
        }
      }

      // 2. Fetch session details (GET /practice/:testId)
      await practiceApi.getTestSessionContent(testId)

      // 3. Start skill attempt within the session (POST /practice/tests/:testId/skills/:skillType/start)
      try {
        await practiceApi.startSkillAttempt(testId, sidebar.skill)
      } catch (err: any) {
        // If it's 409 Conflict (e.g. attempt already exists or was already submitted),
        // we can safely proceed to the test screen to let them view or review it.
        if (err?.response?.status === 409) {
          console.log("Skill attempt already started or submitted, proceeding to test screen.");
        } else {
          throw err;
        }
      }

      setStartTime(Date.now())

      navigate(
        `/practice-ielts/${sidebar.skill}/test/${testId}?unit=${selectedTest.unitId}`,
        { state: { mode } }
      )
    } catch (err) {
      console.error("Start exam failed:", err)
      alert(language === "vi" ? "Lỗi khi bắt đầu bài thi. Vui lòng thử lại." : "Failed to start the exam. Please try again.")
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
      ? (language === "vi" ? "Đề Luyện Thi Đầy Đủ" : "Full Practice Test")
      : getSubSectionLabel(sidebar.skill, sidebar.subSection, t)

  return (
    <MainLayout>
      <div className="practice-page-container">
        <PracticeSidebar />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="practice-title">
            {sidebar.skill.charAt(0).toUpperCase() + sidebar.skill.slice(1)} — {pageTitle}
          </h2>

          {loading ? (
            <p style={{ color: "#888" }}>{t("practice_loading")}</p>
          ) : activeSkills.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 14 }}>{t("practice_empty")}</p>
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
                  key={skill.skillContentId || skill.id || skill._id}
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
  const skillSlug = skill.skillContentId || skill.id || skill._id
  const practiceTestId = skill.practiceTests?.[0]?.practiceTestId || skill.testId || skill.id || skill._id

  const { theme } = useUIStore()
  const { data: enriched, isLoading } = useSkillPreview(skillSlug)

  if (isLoading) {
    return (
      <div
        style={{
          padding: 20,
          border: theme === "dark" ? "1px solid #334155" : "1px solid #eee",
          borderRadius: 20,
          background: theme === "dark" ? "rgba(15, 23, 42, 0.4)" : "#f9f9f9",
          height: 160
        }}
        className="animate-pulse"
      >
        <div style={{ height: 20, background: theme === "dark" ? "#334155" : "#eee", borderRadius: 4, width: "70%", marginBottom: 10 }}></div>
        <div style={{ height: 15, background: theme === "dark" ? "#334155" : "#eee", borderRadius: 4, width: "40%" }}></div>
      </div>
    )
  }

  if (!enriched) return null

  const units = enriched.units || []

  const cards = sidebar.mode === "full"
    ? [{
      id: skillSlug,
      practiceTestId: practiceTestId,
      title: enriched.source || skill.title,
      questions: units.flatMap((u: any) => u.questionBlocks?.flatMap((b: any) => b.questions || []) || []).length,
      numberOfVisits: skill.numberOfVisits,
      unitId: "full",
    }]
    : units.filter((u: any) => u.id === sidebar.subSection).map((u: any) => ({
      id: skillSlug,
      practiceTestId: practiceTestId,
      title: u.title,
      questions: u.questionBlocks?.flatMap((b: any) => b.questions || [])?.length || 0,
      numberOfVisits: skill.numberOfVisits,
      unitId: String(u.id),
    }))

  return (
    <>
      {cards.map((c: any) => (
        <PracticeCard
          key={`${skillSlug}-${c.unitId}`}
          {...c}
          progress={0}
          onClick={() => onClickTest(c)}
        />
      ))}
    </>
  )
}

function getSubSectionLabel(skill: string, sub: number | null, t: any): string {
  if (sub == null) return ""
  switch (skill) {
    case "reading": return `${t("practice_passage")} ${sub}`
    case "listening": return `${t("practice_section")} ${sub}`
    case "writing": return `${t("practice_task")} ${sub}`
    case "speaking": return `${t("practice_part")} ${sub}`
    default: return String(sub)
  }
}