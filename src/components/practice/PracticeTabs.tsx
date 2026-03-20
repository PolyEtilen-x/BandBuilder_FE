import theme from "@/styles/theme"
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
    <div
      className="tabs-container"
      style={{
        display: "flex",
        gap: "0.75rem",
        marginBottom: "1.25rem",
        overflowX: "auto",
        whiteSpace: "nowrap",
        scrollbarWidth: "none"
      }}
    >

      {tabs.map(tab=>{

        const value = tab.toLowerCase()
        const active = value === skill

        return(
          <button
            key={tab}
            onClick={()=>navigate(`/practice/${value}`)}
            style={{
              flex:"0 0 auto",
              padding:"0.5rem 1rem",
              borderRadius:"2rem",
              border:`1px solid ${theme.colors.third}`,
              background:active?theme.colors.third:"#fff",
              color:active?"#fff":theme.colors.third,
              fontSize:"0.9rem",
              cursor:"pointer",
              transition:"all 0.2s ease"
            }}
          >
            {tab}
          </button>

        )

      })}

    </div>

  )

}