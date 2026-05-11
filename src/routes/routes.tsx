import Home from "@/pages/home/home"
import { lazy } from "react"
const PracticePage = lazy(() => import("@/pages/practice/PracticePage"))
import PracticeTestPage from "@/pages/practice/PracticeTestPage"
import LoginSuccess from "@/pages/loginsuccess"
import VocabPage from "@/pages/materials/VocabPage"
import GrammarPage from "@/pages/materials/GrammarPage"
import { ProtectedRoute } from "@/guard/route.guard"
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"))
const UpgradePage = lazy(() => import("@/pages/upgrade/UpgradePage"))

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/practice",
    element: <PracticePage />,
  },
  {
    path: "/practice/:skill",
    element: <PracticePage />,
  },
  {
    path: "/practice/:skill/test/:id",
    element: <ProtectedRoute><PracticeTestPage /></ProtectedRoute>,
  },
  {
    path: "/materials/vocabulary",
    element: <VocabPage />,
  },
  {
    path: "/materials/grammar",
    element: <GrammarPage />,
  },
  {
    path: "/login/success",
    element: <LoginSuccess />
  },
  {
    path: "/oauth-success",
    element: <LoginSuccess />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/upgrade",
    element: (
      <ProtectedRoute>
        <UpgradePage />
      </ProtectedRoute>
    )
  },
]