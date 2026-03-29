import { useState, lazy, Suspense } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"
import theme from "@/styles/theme"
import { PracticeTest } from "@/data/practices/practiceTest.model"

const PracticeCard = lazy(() => import("./PracticeCard"))

type Props = {
  title: string
  skill?: string
  count: number
  numberOfVisits: number
  exercises: PracticeTest[]
  skillContentId: string
}
export default function PracticeSection({
  title,
  skill,
  count,
  numberOfVisits,
  exercises,
  skillContentId
}: Props){

  const [open,setOpen] = useState(false)
  
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
            {exercises.map((ex) => (
              <PracticeCard
                key={ex.practiceTestId}
                id={skillContentId}
                title={ex.title}
                questions={0}
                numberOfVisits={numberOfVisits}
                progress={0}
              />
            ))}

          </div>

        </Suspense>

      )}

    </section>

  )
}