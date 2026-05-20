import { setCookie } from "@/utils/cookie"

export function loginWithGoogle() {
  const currentPath = window.location.pathname + window.location.search

  setCookie("redirectAfterLogin", currentPath, 1)

  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
}
