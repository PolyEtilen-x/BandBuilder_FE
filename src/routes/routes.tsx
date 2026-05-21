import { lazy } from "react"
const Home = lazy(() => import("@/pages/home/home"))
const PracticePage = lazy(() => import("@/pages/practice-ielts/PracticePage"))
const PracticeTestPage = lazy(() => import("@/pages/practice-ielts/PracticeTestPage"))
const CallWithAiPage = lazy(() => import("@/pages/call/CallWithAiPage"))
const LoginSuccess = lazy(() => import("@/pages/loginsuccess"))
const VocabPage = lazy(() => import("@/pages/materials/VocabPage"))
const GrammarPage = lazy(() => import("@/pages/materials/GrammarPage"))
import { ProtectedRoute } from "@/guard/route.guard"
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"))
const UpgradePage = lazy(() => import("@/pages/upgrade/UpgradePage"))
const ResultPage = lazy(() => import("@/pages/practice-ielts/ResultPage"))
const RoadmapSetupPage = lazy(() => import("@/pages/roadmap/RoadmapSetupPage"))
const RoadmapPage = lazy(() => import("@/pages/roadmap/RoadmapPage"))
const PronunciationPracticePage = lazy(
  () => import("@/pages/practice-general/PronunciationPracticePage")
)
const SampleWritingsPage = lazy(
  () => import("@/pages/practice-general/SampleWritingsPage")
)

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/roadmap",
    element: <RoadmapSetupPage />,
  },
  {
    path: "/roadmap/:id",
    element: <RoadmapPage />,
  },
  {
    path: "/practice-ielts",
    element: <PracticePage />,
  },
  {
    path: "/practice-ielts/:skill",
    element: <PracticePage />,
  },
  {
    path: "/practice-ielts/:skill/test/:id",
    element: <ProtectedRoute><PracticeTestPage /></ProtectedRoute>,
  },
  {
    path: "/practice-ielts/result/:id",
    element: <ProtectedRoute><ResultPage /></ProtectedRoute>,
  },
  {
    path: "/practice-ielts/review/:id",
    element: <ProtectedRoute><PracticeTestPage mode="review" /></ProtectedRoute>,
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
  {
    path: "/practice-general/pronunciation-practice",
    element: <PronunciationPracticePage />,
  },
  {
    path: "/practice-general/sample-writings",
    element: <SampleWritingsPage />,
  },
  {
    path: "/practice-general/call-with-ai",
    element: <ProtectedRoute><CallWithAiPage /></ProtectedRoute>,
  },
]