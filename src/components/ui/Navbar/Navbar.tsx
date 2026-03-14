import {useState} from "react"
import menu from "./menu"
import theme from "@/theme"
import { Link } from "react-router-dom"

export default function Navbar() {
    const [active, setActive] = useState<number | null>(null)

    return (
        <nav
            style={{
                background: theme.colors.background.white,
                padding: "16px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05",
            }}
        >
            <div style={{display:"flex", alignItems:"center", gap: "8px"}}>
                <img src="@/assets/logo_GoIelts.png" style = {{width: "40px"}} />
            </div>
            
            <div
                style={{display: "flex", gap: "32px", position: "relative"}}
            >
                {menu.map((item, index) => (
                    <div 
                        key = {index}
                        onMouseEnter={()=> setActive(index)}
                        onMouseLeave={()=> setActive(null)} 
                        style = {{
                            position: "relative",
                            cursor: "pointer",
                            fontWeight: 500,
                            color: theme.colors.text.primary
                        }}
                    >
                        {item.label} ▾

                        {active === index && item.dropdown.length > 0 &&
                            <div
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    background: theme.colors.background.main, 
                                    color: theme.colors.primary,
                                    padding: "20px",
                                    borderRadius: "8px",
                                    width: "250px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                }}
                            >
                                {item.dropdown.map((d,i) => (
                                    <Link
                                        key={i}
                                        to={d.path}
                                        style={{
                                        display: "block",
                                        fontSize: theme.typography.fontSize.sm,
                                        padding: "6px 0",
                                        textDecoration: "none",
                                        color: theme.colors.text.primary
                                        }}
                                    >
                                        {d.label}
                                    </Link>
                                ))}
                            </div>
                        }
                    </div>
                ))}
            </div>
            <button
                style={{
                    background: theme.colors.danger,
                    color: theme.colors.text.secondary,
                    padding: "8px 20px",
                    borderRadius:"20px",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer"  
                }}
            >
                Register
            </button>
        </nav>
    )
}