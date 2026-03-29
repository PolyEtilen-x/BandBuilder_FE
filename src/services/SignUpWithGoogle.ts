export function loginWithGoogle() {
  const currentPath = window.location.pathname + window.location.search

  localStorage.setItem("redirectAfterLogin", currentPath)

  window.location.href = "https://aidsense.online/auth/google"
}

export async function fetchUser() {
  try {
    const res = await fetch("https://aidsense.online/auth/me", {
      method: "GET",
      credentials: "include"
    })

    if (!res.ok) return null

    const user = await res.json()
    return user
  } catch (err) {
    console.error("Fetch user error:", err)
    return null
  }
}