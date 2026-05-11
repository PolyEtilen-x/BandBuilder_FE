import { useState } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"
import theme from "@/styles/theme"
import { useSkillPreview } from "@/hooks/usePractice"
import PracticeCard from "./PracticeCard"

type Props = {
  title: string
  count: number
  numberOfVisits: number
  skillContentId: string
  mode: "full" | "single"
  subSection: number | null
  onClickTest?: (test: any) => void
}

export default function PracticeSection({
  title,
  count,
  numberOfVisits,
  skillContentId,
  mode,
  subSection,
  onClickTest,
}: Props) {
  const [open, setOpen] = useState(false)

  // Chỉ gọi API preview khi người dùng mở Section để tối ưu hiệu năng
  const { data: enriched, isLoading } = useSkillPreview(skillContentId)

  const units = enriched?.units || []
  
  // Logic chuẩn bị danh sách card tương tự như SkillCardGroup
  const cards = mode === "full" 
    ? [{
        id: skillContentId,
        title: enriched?.preview?.source || title,
        questions: units.flatMap((u: any) => u.questionBlocks?.flatMap((b: any) => b.questions || []) || []).length,
        numberOfVisits,
        unitId: "full",
      }]
    : units.filter((u: any) => u.id === subSection).map((u: any) => ({
        id: skillContentId,
        title: u.title,
        questions: u.questionBlocks?.flatMap((b: any) => b.questions || [])?.length || 0,
        numberOfVisits,
        unitId: String(u.id),
      }))

  return (
    <section
      style={{
        background: "#fff",
        padding: "20px 24px",
        borderRadius: 20,
        marginBottom: 20,
        border: open ? `2px solid ${theme.colors.third}` : "1px solid #eee",
        transition: "all 0.2s ease",
        boxShadow: open ? "0 10px 25px -5px rgba(0,0,0,0.05)" : "none"
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
          <h2 style={{ color: "#333", fontSize: 18, marginBottom: 4, fontWeight: 700 }}>{title}</h2>
          <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#888" }}>
            <span>{count} practice tests</span>
            <span>{numberOfVisits} visits</span>
          </div>
        </div>
        {open ? (
          <ChevronDown color={theme.colors.third} size={24} />
        ) : (
          <ChevronLeft color="#888" size={24} />
        )}
      </div>

      {/* ── Content (Cards) ── */}
      {open && (
        <div style={{ marginTop: 24 }}>
          {isLoading ? (
            <p style={{ color: "#999", fontSize: 14 }}>Đang tải bài tập...</p>
          ) : cards.length === 0 ? (
            <p style={{ color: "#aaa", fontSize: 14 }}>Không có bài tập phù hợp cho lựa chọn này.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(15rem, 1fr))",
                gap: 20,
              }}
            >
              {cards.map((c: any) => (
                <PracticeCard
                  key={`${skillContentId}-${c.unitId}`}
                  {...c}
                  progress={0}
                  onClick={() => onClickTest?.(c)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}