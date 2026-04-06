import { useState, lazy, Suspense, useEffect } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"
import theme from "@/styles/theme"
import { practiceApi } from "@/api/practice.api"
import { normalizeTestUnits, TestUnit } from "@/utils/normalizeTestUnits.utils"

const PracticeCard = lazy(() => import("./PracticeCard"))

type Props = {
  title: string
  count: number
  numberOfVisits: number
  skillContentId: string
  mode: "full" | "single"
  subSection: number | null
}

export default function PracticeSection({
  title,
  count,
  numberOfVisits,
  skillContentId,
  mode,
  subSection,
}: Props) {
  const [open, setOpen] = useState(false)
  const [allUnits, setAllUnits] = useState<TestUnit[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!open || loaded) return

    const fetchPreview = async () => {
      try {
        const res = await practiceApi.getSkillPreview(skillContentId)
        setAllUnits(normalizeTestUnits(res.data))
        setLoaded(true)
      } catch (err) {
        console.error(err)
      }
    }

    fetchPreview()
  }, [open, skillContentId, loaded])

  // Reset khi mode/subSection thay đổi để re-render đúng filter
  // (data đã loaded, chỉ cần filter lại — không cần re-fetch)
  const visibleUnits: TestUnit[] =
    mode === "full"
      ? allUnits // full test
      : allUnits.filter((u) => u.id === subSection) // single section

  return (
    <section
      style={{
        background: "#f6f6f6",
        padding: 24,
        borderRadius: 20,
        marginBottom: 20,
        border: `1px solid ${theme.colors.third}`,
      }}
    >
      {/* ── Header ── */}
      <div
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div>
          <h2 style={{ color: theme.colors.third, marginBottom: 2 }}>{title}</h2>
          <p style={{ color: theme.colors.third, fontSize: 13 }}>{count} practice</p>
        </div>
        {open ? (
          <ChevronDown color={theme.colors.third} />
        ) : (
          <ChevronLeft color={theme.colors.third} />
        )}
      </div>

      {/* ── Cards ── */}
      {open && (
        <Suspense fallback={<p style={{ marginTop: 12 }}>Đang tải...</p>}>
          {!loaded ? (
            <p style={{ marginTop: 12, color: "#999" }}>Đang tải bài tập...</p>
          ) : visibleUnits.length === 0 ? (
            <p style={{ marginTop: 12, color: "#aaa", fontSize: 13 }}>
              Không có bài nào cho lựa chọn này.
            </p>
          ) : (
            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
                gap: 16,
              }}
            >
              {visibleUnits.map((u) => {
                const totalQuestions = u.questionBlocks
                  ?.flatMap((b: any) => b.questions ?? [])
                  .length

                return (
                  <PracticeCard
                    key={u.id}
                    id={skillContentId}
                    title={u.title}
                    questions={totalQuestions}
                    numberOfVisits={numberOfVisits}
                    progress={0}
                    unitId={String(u.id)}
                  />
                )
              })}
            </div>
          )}
        </Suspense>
      )}
    </section>
  )
}