import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import PracticeSidebar from "@/components/practice/PracticeSidebar"
import PracticeSection from "@/components/practice/PracticeSection"
import ModeSelectModal from "@/components/SelectModal/ModeSelectModal"
import { loginWithGoogle } from "@/services/auth/SignUpWithGoogle"
import { useAuthStore } from "@/services/auth/auth.store"
import { usePracticeStore } from "@/services/practice/practice.store"
import { usePracticeSkills } from "@/hooks/usePractice"
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
  const [selectedTest, setSelectedTest] = useState<any>(null)

  const handleClickTest = (test: any) => {
    setSelectedTest(test)
    setOpenModal(true)
  }

  const handleStart = async (mode: "practice" | "exam") => {
    if (!selectedTest) return

    if (!isAuthenticated) {
      const confirmLogin = confirm("Please login to start")

      if (confirmLogin) {
        const currentPath = location.pathname + location.search
        localStorage.setItem("redirectAfterLogin", currentPath)
        loginWithGoogle()
      }
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
            <div>
              {activeSkills.map((skill: any) => (
                <PracticeSection
                  key={skill.skillContentId}
                  title={skill.title}
                  count={skill.numberOfTests || 0}
                  numberOfVisits={skill.numberOfVisits || 0}
                  skillContentId={skill.skillContentId}
                  mode={sidebar.mode}
                  subSection={sidebar.subSection}
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
    </MainLayout>
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