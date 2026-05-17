import { create } from "zustand"
import { translations, TranslationKey } from "./translations"

type LanguageType = "vi" | "en"
type ThemeType = "light" | "dark"

interface UIState {
  language: LanguageType
  theme: ThemeType
  
  setLanguage: (lang: LanguageType) => void
  toggleLanguage: () => void
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
  t: (key: TranslationKey) => string
}

// Read initial values from localStorage or default settings
const getInitialLanguage = (): LanguageType => {
  const stored = localStorage.getItem("bandbuilder-lang")
  if (stored === "vi" || stored === "en") return stored
  
  // Default to Vietnamese if browser is in VI, otherwise English
  const navLang = navigator.language.toLowerCase()
  return navLang.startsWith("vi") ? "vi" : "en"
}

const getInitialTheme = (): ThemeType => {
  const stored = localStorage.getItem("bandbuilder-theme")
  if (stored === "light" || stored === "dark") {
    // Initial DOM side-effect trigger
    if (stored === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    return stored
  }
  
  // Check system setting preferences
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const theme = preferDark ? "dark" : "light"
  if (theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
  return theme
}

export const useUIStore = create<UIState>((set, get) => ({
  language: getInitialLanguage(),
  theme: getInitialTheme(),

  setLanguage: (lang) => {
    localStorage.setItem("bandbuilder-lang", lang)
    set({ language: lang })
  },

  toggleLanguage: () => {
    const nextLang = get().language === "vi" ? "en" : "vi"
    localStorage.setItem("bandbuilder-lang", nextLang)
    set({ language: nextLang })
  },

  setTheme: (theme) => {
    localStorage.setItem("bandbuilder-theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    set({ theme })
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light"
    localStorage.setItem("bandbuilder-theme", nextTheme)
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    set({ theme: nextTheme })
  },

  t: (key) => {
    const lang = get().language
    const dict = translations[lang]
    return dict[key] || translations["en"][key] || key
  }
}))
