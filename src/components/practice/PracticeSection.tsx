import { useState, lazy, Suspense } from "react"
import { ChevronLeft, ChevronDown } from "lucide-react"
import theme from "@/theme"

const PracticeCard = lazy(() => import("./PracticeCard"))

export default function PracticeSection({
  title,
  count,
  exercises
}: any){

  const [open,setOpen] = useState(false)

  return (

    <section
      style={{
        background:"#f6f6f6",
        padding:30,
        borderRadius:20,
        marginBottom:30
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
              marginTop:20,
              display:"grid",
              gridTemplateColumns:"repeat(3,1fr)",
              gap:20
            }}
          >

            {exercises.map((ex:any)=>(

              <PracticeCard
                key={ex.name}
                title={ex.name}
                questions={ex.questions}
                participants={ex.participants}
                progress={ex.progress}
              />

            ))}

          </div>

        </Suspense>

      )}

    </section>

  )
}