import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/services/auth/auth.store"
import { setCookie } from "@/utils/cookie"

interface Props {
    children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
    const { isAuthenticated, isLoading } = useAuthStore()
    const location = useLocation()

    if (isLoading) {
        return <div>Loading auth...</div> // Hoặc một Loading Spinner đẹp
    }

    if (!isAuthenticated) {
        // save state before login, after login will redirect to this state
        setCookie("redirectAfterLogin", location.pathname + location.search, 1)

        return <Navigate to="/" state={{ from: location, triggerLogin: true }} replace />
    }

    return <>{children}</>
}
