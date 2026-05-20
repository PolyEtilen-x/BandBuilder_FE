import { create } from "zustand"
import { translations, TranslationKey } from "./translations"
import { getCookie, setCookie } from "@/utils/cookie"

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
  const stored = getCookie("bandbuilder-lang")
  if (stored === "vi" || stored === "en") return stored

  // Default to Vietnamese if browser is in VI, otherwise English
  const navLang = navigator.language.toLowerCase()
  return navLang.startsWith("vi") ? "vi" : "en"
}

const getInitialTheme = (): ThemeType => {
  const stored = getCookie("bandbuilder-theme")
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
    setCookie("bandbuilder-lang", lang, 365)
    set({ language: lang })
  },

  toggleLanguage: () => {
    const nextLang = get().language === "vi" ? "en" : "vi"
    setCookie("bandbuilder-lang", nextLang, 365)
    set({ language: nextLang })
  },

  setTheme: (theme) => {
    setCookie("bandbuilder-theme", theme, 365)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    set({ theme })
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light"
    setCookie("bandbuilder-theme", nextTheme, 365)
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
