import { useState, lazy, Suspense, useEffect } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"
import theme from "@/styles/theme"
import { PracticeTest } from "@/data/practices/practiceTest.model"
import { practiceApi } from "@/api/practice.api"
import { normalizeTestUnits } from "@/utils/normalizeTestUnits.utils"

const PracticeCard = lazy(() => import("./PracticeCard"))

export default function PracticeSection({
  title,
  count,
  numberOfVisits,
  skillContentId
}: any) {

  const [open,setOpen] = useState(false)
  const [units,setUnits] = useState<any[]>([])
  const [loaded,setLoaded] = useState(false)

  useEffect(()=>{
    if(!open || loaded) return

    const fetchPreview = async()=>{
      try{
        const res = await practiceApi.getSkillPreview(skillContentId)
        const normalized = normalizeTestUnits(res.data)

        setUnits(normalized)
        setLoaded(true)
      }catch(err){
        console.error(err)
      }
    }

    fetchPreview()
  },[open, skillContentId, loaded])
  
  return (
    <section
      style={{
        background:"#f6f6f6",
        padding:30,
        borderRadius:20,
        marginBottom:30,
        border:`1px solid ${theme.colors.third}`,
      }}
    >

      <div
        onClick={()=>setOpen(!open)}
        style={{
          display:"flex",
          justifyContent:"space-between",
          cursor:"pointer"
        }}
      >

        <div>

          <h2 style={{color:theme.colors.third}}>
            {title}
          </h2>

          <p style={{color:theme.colors.third}}>{count} practice</p>

        </div>

        <div>

          {open
            ? <ChevronDown color={theme.colors.third}/>
            : <ChevronLeft color={theme.colors.third}/>
          }

        </div>

      </div>

      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <div
            style={{
              marginTop: "1.25rem",
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(16rem, 1fr))",
              gap:20
            }}
          >            
            {units.map((u:any) => {
              const totalQuestions = u.questionBlocks
                ?.flatMap((b:any)=>b.questions || [])
                .length
                return (
                  <PracticeCard
                    key={u.id}
                    id={skillContentId}
                    title={u.title}
                    questions={totalQuestions}
                    numberOfVisits={numberOfVisits}
                    progress={0}
                    unitId={u.id}
                  />
                )})
            }
          </div>

        </Suspense>

      )}

    </section>

  )
}