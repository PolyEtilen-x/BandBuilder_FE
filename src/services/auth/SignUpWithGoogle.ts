export function loginWithGoogle() {
  const currentPath = window.location.pathname + window.location.search

  localStorage.setItem("redirectAfterLogin", currentPath)

  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
}
