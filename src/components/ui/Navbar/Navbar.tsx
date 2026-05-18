import { useState } from "react"
import menu from "./menu"
import theme from "@/styles/theme"
import { Link } from "react-router-dom"
import logo from "@/assets/logo.png"
import { loginWithGoogle } from "@/services/auth/SignUpWithGoogle"
import { useAuthStore } from "@/services/auth/auth.store"
import { useUIStore } from "@/services/ui/ui.store"
import { Sun, Moon, Globe, LogOut } from "lucide-react"
import { useUserProfile } from "@/hooks/useUser"

export default function Navbar() {
    const [active, setActive] = useState<number | null>(null)
    const [open, setOpen] = useState(false)

    const user = useAuthStore((s) => s.user)
    const logout = useAuthStore((s) => s.logout)
    const { data: profile } = useUserProfile(!!user)
    const displayUser = profile?.user || user
    
    // i18n and Dark Mode hooks
    const { language, theme: themeState, toggleLanguage, toggleTheme, t } = useUIStore()

    // Dynamic translate menu categories
    const getTranslatedMenuLabel = (label: string) => {
        switch (label) {
            case "IELTS Practice":
                return t("nav_practice")
            case "IELTS Materials":
                return t("nav_materials")
            case "Study Plan":
                return t("nav_roadmap")
            default:
                return label
        }
    }

    // Dynamic translate submenu items
    const getTranslatedSubmenuLabel = (label: string) => {
        switch (label) {
            case "Practice IELTS Reading":
                return `Practice Reading`
            case "Practice IELTS Listening":
                return `Practice Listening`
            case "Practice IELTS Writing":
                return `Practice Writing`
            case "Practice IELTS Speaking":
                return `Practice Speaking`
            case "Vocabulary":
                return t("nav_vocab")
            case "Grammar":
                return t("nav_grammar")
            case "Learning Roadmap":
                return t("nav_roadmap")
            default:
                return label
        }
    }

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 9999,
                background: themeState === "dark" ? "#0f172a" : theme.colors.background.white,
                boxShadow: themeState === "dark" ? "0 2px 10px rgba(0,0,0,0.3)" : "0 0.125rem 0.5rem rgba(0,0,0,0.05)",
                borderBottom: themeState === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
                transition: "all 0.3s ease"
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
                <Link to="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <img src={logo} style={{ width: "2.8rem" }} alt="Logo" />
                </Link>

                {/* DESKTOP MENU */}
                <div className="desktop-menu"
                    style={{
                        display: "flex",
                        gap: "1.25rem",
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
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                padding: "0.5rem 0",
                                color: themeState === "dark" ? "#cbd5e1" : theme.colors.text.primary,
                                transition: "color 0.2s"
                            }}
                        >
                            {getTranslatedMenuLabel(item.label)} ▾

                            {active === index && item.dropdown.length > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        background: themeState === "dark" ? "#1e293b" : theme.colors.background.main,
                                        border: themeState === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
                                        padding: "1rem",
                                        borderRadius: "1rem",
                                        width: "16rem",
                                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)"
                                    }}
                                >
                                    {item.dropdown.map((d, i) => (
                                        <Link
                                            key={i}
                                            to={d.path}
                                            style={{
                                                display: "block",
                                                fontSize: "0.85rem",
                                                fontWeight: 500,
                                                padding: "0.5rem 0.75rem",
                                                borderRadius: "0.5rem",
                                                textDecoration: "none",
                                                color: themeState === "dark" ? "#e2e8f0" : theme.colors.text.primary,
                                                transition: "background 0.2s"
                                            }}
                                            className="hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            {getTranslatedSubmenuLabel(d.label)}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CONTROLS AREA (DESKTOP SETTINGS + ACCOUNT) */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                    
                    {/* Dark/Light Toggler */}
                    <button 
                        onClick={() => toggleTheme()}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: themeState === "dark" ? "#facc15" : "#475569",
                            borderRadius: "50%",
                            transition: "background 0.2s"
                        }}
                        className="hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={themeState === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {themeState === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Language Switcher Widget */}
                    <button 
                        onClick={() => toggleLanguage()}
                        style={{
                            background: themeState === "dark" ? "#1e293b" : "#f1f5f9",
                            border: themeState === "dark" ? "1px solid #334155" : "1px solid #cbd5e1",
                            cursor: "pointer",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: themeState === "dark" ? "#e2e8f0" : "#475569",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                        }}
                    >
                        <Globe size={12} className="opacity-75" />
                        <span>{language === "vi" ? "VI" : "EN"}</span>
                    </button>

                    {/* DESKTOP BUTTON */}
                    {user ? (
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                            <Link
                                to="/profile"
                                style={{
                                    textDecoration: "none",
                                    color: themeState === "dark" ? "#f8fafc" : theme.colors.text.primary,
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: themeState === "dark" ? "#38bdf8" : "#174593",
                                    color: "#fff",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: 14,
                                    fontWeight: 800,
                                    overflow: "hidden"
                                }}>
                                    {displayUser?.avatarUrl ? (
                                        <img 
                                            src={displayUser.avatarUrl} 
                                            alt={displayUser.fullName || "User Avatar"} 
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                        />
                                    ) : (
                                        (displayUser?.fullName || displayUser?.email || "U").charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="hidden md:inline">{t("nav_account")}</span>
                            </Link>

                            <button
                                onClick={() => logout()}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "#ef4444",
                                    cursor: "pointer",
                                    padding: "0.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "50%"
                                }}
                                className="hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                title={t("nav_logout")}
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <button className="desktop-btn"
                            style={{
                                background: theme.colors.danger,
                                color: theme.colors.text.secondary,
                                padding: "0.5rem 1.25rem",
                                borderRadius: "1.25rem",
                                border: "none",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)"
                            }}
                            onClick={() => loginWithGoogle()}
                        >
                            {t("nav_register")}
                        </button>
                    )}
                </div>

                {/* HAMBURGER */}
                <div
                    className="mobile-toggle"
                    onClick={() => setOpen(!open)}
                    style={{
                        display: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: themeState === "dark" ? "#f8fafc" : "#000"
                    }}
                >
                    {open ? "✖" : "☰"}
                </div>

                {/* MOBILE MENU */}
                <div
                    className="mobile-menu"
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        background: themeState === "dark" ? "#0f172a" : theme.colors.background.white,
                        borderBottom: themeState === "dark" ? "1px solid #1e293b" : "1px solid #cbd5e1",
                        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                        padding: "1.5rem",

                        transform: open ? "translateY(0)" : "translateY(-1rem)",
                        opacity: open ? 1 : 0,
                        pointerEvents: open ? "auto" : "none",

                        transition: "all 0.3s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem"
                    }}
                >
                    {menu.map((item, index) => (
                        <div key={index} style={{ borderBottom: themeState === "dark" ? "1px solid #1e293b" : "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                            <div style={{ fontWeight: 700, color: themeState === "dark" ? "#f8fafc" : "#000", marginBottom: "0.25rem" }}>
                                {getTranslatedMenuLabel(item.label)}
                            </div>

                            <div style={{ paddingLeft: "0.5rem" }}>
                                {item.dropdown.map((d, i) => (
                                    <Link
                                        key={i}
                                        to={d.path}
                                        onClick={() => setOpen(false)}
                                        style={{
                                            display: "block",
                                            padding: "0.35rem 0",
                                            textDecoration: "none",
                                            fontSize: "0.85rem",
                                            color: themeState === "dark" ? "#cbd5e1" : theme.colors.text.primary
                                        }}
                                    >
                                        - {getTranslatedSubmenuLabel(d.label)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {!user && (
                        <button
                            style={{
                                background: theme.colors.danger,
                                color: theme.colors.text.secondary,
                                padding: "0.75rem",
                                borderRadius: "1.25rem",
                                border: "none",
                                fontWeight: 700,
                                fontSize: "0.9rem"
                            }}
                            onClick={() => {
                                setOpen(false)
                                loginWithGoogle()
                            }}
                        >
                            {t("nav_register")}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}