import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation  } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import PracticeSidebar, { SidebarState } from "@/components/practice/PracticeSidebar"
import PracticeCard from "@/components/practice/PracticeCard"
import { practiceApi } from "@/api/practice.api"
import { normalizeTestUnits, TestUnit } from "@/utils/normalizeTestUnits.utils"
import { PracticeSkill } from "@/data/practices/practiceSkill.model"
import { SkillContentPreview } from "@/data/practices/skillContent.model"
import ModeSelectModal from "@/components/SelectModal/ModeSelectModal"
import { loadSkillsWithPreview } from "@/services/practice/practiceLoader.service"
import { loginWithGoogle } from "@/services/auth/SignUpWithGoogle"
import { useAuthStore } from "@/services/auth/auth.store"
import "./style.css"

type EnrichedSkill = PracticeSkill & {
  preview?: SkillContentPreview
  units: TestUnit[]
}

export default function PracticePage() {
  const { skill: skillParam } = useParams<{ skill: string }>()
  const navigate = useNavigate()
  const location = useLocation()  

  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [skills, setSkills] = useState<EnrichedSkill[]>([])
  const [loading, setLoading] = useState(true)

  const [sidebar, setSidebar] = useState<SidebarState>({
    skill: (skillParam as SidebarState["skill"]) ?? "listening",
    mode: "single",
    subSection: 1,
  })

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

  // Sync URL param → sidebar skill
  useEffect(() => {
    if (skillParam && skillParam !== sidebar.skill) {
      setSidebar((prev) => ({
        ...prev,
        skill: skillParam as SidebarState["skill"],
        subSection: prev.mode === "single" ? 1 : null,
      }))
    }
  }, [skillParam])

  // Fetch all skills + preview on page load, then cache preview for later use when user switch between skills
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await practiceApi.getSkills()
        const list: PracticeSkill[] = res.data.data

        const enriched = await loadSkillsWithPreview(list)

        setSkills(enriched)
        console.log("Loaded skills with preview:", enriched)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function handleSidebarChange(next: SidebarState) {
    setSidebar(next)
    if (next.skill !== skillParam) {
      navigate(`/practice/${next.skill}`)
    }
  }

  const activeSkills = skills.filter(
    (s) => s.skillType.toLowerCase() === sidebar.skill
  )

  const cards = activeSkills.flatMap((skillItem) => {
    if (sidebar.mode === "full") {
      // Full test
      const totalQ = skillItem.units
        .flatMap((u) => u.questionBlocks?.flatMap((b: any) => b.questions ?? []) ?? [])
        .length

      return [{
        key: skillItem.skillContentId,
        id: skillItem.skillContentId,
        title: skillItem.preview?.source ?? skillItem.title,
        questions: totalQ,
        numberOfVisits: skillItem.numberOfVisits,
        unitId: "full",
      }]
    }

    // Bài lẻ → filter đúng passage / section / task / part
    return skillItem.units
      .filter((u) => u.id === sidebar.subSection)
      .map((u) => ({
        key: `${skillItem.skillContentId}-${u.id}`,
        id: skillItem.skillContentId,
        title: u.title,
        questions: u.questionBlocks
          ?.flatMap((b: any) => b.questions ?? [])
          .length ?? 0,
        numberOfVisits: skillItem.numberOfVisits,
        unitId: String(u.id),
      }))
  })

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
        <PracticeSidebar state={sidebar} onChange={handleSidebarChange} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>
            {sidebar.skill.charAt(0).toUpperCase() + sidebar.skill.slice(1)} — {pageTitle}
          </h2>

          {loading ? (
            <p style={{ color: "#888" }}>Đang tải...</p>
          ) : cards.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 14 }}>Chưa có bài tập nào.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
                gap: 20,
              }}
            >
              {cards.map((c) => (
                <div key={c.key}>
                  <PracticeCard
                    id={c.id}
                    title={c.title}
                    questions={c.questions}
                    numberOfVisits={c.numberOfVisits}
                    progress={0}
                    unitId={c.unitId}
                    onClick={() => handleClickTest(c)}
                  />
                </div>
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
    case "reading":   return `Passage ${sub}`
    case "listening": return `Section ${sub}`
    case "writing":   return `Task ${sub}`
    case "speaking":  return `Part ${sub}`
    default:          return String(sub)
  }
}