import { useState } from "react"
import menu from "./menu"
import theme from "@/styles/theme"
import { Link } from "react-router-dom"
import logo from "@/assets/logo.png"
import { loginWithGoogle } from "@/services/SignUpWithGoogle"

export default function Navbar() {
    const [active, setActive] = useState<number | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <nav
            style={{
                background: theme.colors.background.white,
                boxShadow: "0 0.125rem 0.5rem rgba(0,0,0,0.05)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "75rem", // ~1200px
                    margin: "0 auto",
                    padding: "0 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "4rem",
                    position: "relative"
                }}
            >
                {/* LOGO */}
                <Link to="/">
                    <img src={logo} style={{ width: "3rem" }} />
                </Link>

                {/* DESKTOP MENU */}
                <div className="desktop-menu"
                    style={{
                        display: "flex",
                        gap: "2rem",
                        position: "relative"
                    }}
                >
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setActive(index)}
                            onMouseLeave={() => setActive(null)}
                            style={{
                                position: "relative",
                                cursor: "pointer",
                                fontWeight: 500,
                                color: theme.colors.text.primary
                            }}
                        >
                            {item.label} ▾

                            {active === index && item.dropdown.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        background: theme.colors.background.main,
                                        padding: "1.25rem",
                                        borderRadius: "0.5rem",
                                        width: "15rem",
                                        boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.1)"
                                    }}
                                >
                                    {item.dropdown.map((d, i) => (
                                        <Link
                                            key={i}
                                            to={d.path}
                                            style={{
                                                display: "block",
                                                fontSize: "0.9rem",
                                                padding: "0.4rem 0",
                                                textDecoration: "none",
                                                color: theme.colors.text.primary
                                            }}
                                        >
                                            {d.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* DESKTOP BUTTON */}
                <button className="desktop-btn"
                    style={{
                        background: theme.colors.danger,
                        color: theme.colors.text.secondary,
                        padding: "0.5rem 1.25rem",
                        borderRadius: "1.25rem",
                        border: "none",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                    onClick={() => loginWithGoogle()}
                >
                    Register
                </button>

                {/* HAMBURGER */}
                <div
                    className="mobile-toggle"
                    onClick={() => setOpen(!open)}
                    style={{
                        display: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer"
                    }}
                >
                    {open ? "✖" : "☰"}
                </div>

                {/* MOBILE MENU (ANIMATE) */}
                <div
                    className="mobile-menu"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        background: theme.colors.background.white,
                        boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.1)",
                        padding: "1.25rem",

                        transform: open ? "translateY(0)" : "translateY(-1rem)",
                        opacity: open ? 1 : 0,
                        pointerEvents: open ? "auto" : "none",

                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    {menu.map((item, index) => (
                        <div key={index}>
                            <div style={{ fontWeight: 600 }}>
                                {item.label}
                            </div>

                            {item.dropdown.map((d, i) => (
                                <Link
                                    key={i}
                                    to={d.path}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        display: "block",
                                        padding: "0.4rem 0",
                                        textDecoration: "none",
                                        color: theme.colors.text.primary
                                    }}
                                >
                                    - {d.label}
                                </Link>
                            ))}
                        </div>
                    ))}

                    <button
                        style={{
                            background: theme.colors.danger,
                            color: theme.colors.text.secondary,
                            padding: "0.6rem",
                            borderRadius: "1.25rem",
                            border: "none",
                            fontWeight: 600
                        }}
                        onClick={() => loginWithGoogle()}
                    >
                        Register
                    </button>
                </div>
            </div>
           
        </nav>
    )
}