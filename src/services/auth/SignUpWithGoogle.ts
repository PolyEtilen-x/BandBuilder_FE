import { setCookie } from "@/utils/cookie"

export function loginWithGoogle() {
  const currentPath = window.location.pathname + window.location.search

  setCookie("redirectAfterLogin", currentPath, 1)

  const isMobileBrowser = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  if (isMobileBrowser) {
    const redirectUrl = `${window.location.origin}/loginsuccess`
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google?mobileRedirect=${encodeURIComponent(redirectUrl)}`
  } else {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  }
}
