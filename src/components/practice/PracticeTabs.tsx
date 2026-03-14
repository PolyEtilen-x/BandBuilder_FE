import theme from "@/theme"

const tabs = [
  "All Skills",
  "Reading",
  "Listening",
  "Writing",
  "Speaking"
]

export default function PracticeTabs({skill,setSkill}:any){

  return (

    <div style={{display:"flex",gap:16,marginBottom:20}}>

      {tabs.map(tab=>{

        const active = tab===skill

        return(

          <button
            key={tab}
            onClick={()=>setSkill(tab)}
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