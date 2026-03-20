import theme from "@/styles/theme"
import { Search,Filter } from "lucide-react"

export default function SearchBar({search,sort,updateQuery}:any){

  return (
    <div
      style={{
        display:"flex",
        gap:16,
        marginBottom:30
      }}
    >

      {/* search */}
      <div
        style={{
          flex:1,
          background:"#E8E7E7",
          borderRadius:14,
          padding:"12px 16px",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          color: "#000"
        }}
      >
        <input
          value={search}
          placeholder="Search practice..."
          onChange={(e)=>updateQuery({search:e.target.value})}
          style={{
            border:"none",
            background:"transparent",
            outline:"none",
            width:"100%",
            color:theme.colors.text.primary
          }}
        />

        <Search size={18}/>
      </div>

      {/* sort */}
      <select
        value={sort}
        onChange={(e)=>updateQuery({sort:e.target.value})}
        style={{
          borderRadius:14,
          padding:"12px 16px"
        }}
      >
        <option value="">Sort</option>
        <option value="popular">Popular</option>
        <option value="newest">Newest</option>
      </select>

    </div>
  )
}