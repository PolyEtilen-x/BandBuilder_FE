export function loginWithGoogle(onSuccess?: () => void) {
    const popup = window.open(
        "https://aidsense.online/auth/google",
        "Google Login",
        "width=500,height=600"
    )

    if (!popup) {
        alert("Popup bị chặn!")
        return
    }

    function handleMessage(event: MessageEvent) {
        if (event.data === "LOGIN_SUCCESS") {
            
        onSuccess && onSuccess()

        window.removeEventListener("message", handleMessage)
        }
    }

    window.addEventListener("message", handleMessage)
}

async function fetchUser() {
    const res = await fetch("https://aidsense.online/auth/me", {
        method: "GET",
        credentials: "include"
    });

    const user = await res.json();

    console.log(user);
}