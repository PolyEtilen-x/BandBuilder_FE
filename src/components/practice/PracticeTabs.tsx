import theme from "@/theme"
import { useNavigate } from "react-router-dom"

const tabs = [
  "All Skills",
  "Reading",
  "Listening",
  "Writing",
  "Speaking"
]

export default function PracticeTabs({skill}:any){
  
  const navigate = useNavigate()

  return (
    <div style={{display:"flex",gap:16,marginBottom:20}}>

      {tabs.map(tab=>{

        const value = tab.toLowerCase()
        const active = value === skill

        return(
          <button
            key={tab}
            onClick={()=>navigate(`/practice/${value}`)}
            style={{
              padding:"10px 18px",
              borderRadius:30,
              border:`1px solid ${theme.colors.third}`,
              background:active?theme.colors.third:"#fff",
              color:active?"#fff":theme.colors.third
            }}
          >
            {tab}
          </button>

        )

      })}

    </div>

  )

}