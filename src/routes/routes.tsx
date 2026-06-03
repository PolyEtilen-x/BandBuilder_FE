import { lazy } from "react"
import { ProtectedRoute } from "@/guard/route.guard"
const Home = lazy(() => import("@/pages/user/home/home"))
const PracticePage = lazy(() => import("@/pages/user/practice-ielts/PracticePage"))
const PracticeTestPage = lazy(() => import("@/pages/user/practice-ielts/PracticeTestPage"))
const CallWithAiPage = lazy(() => import("@/pages/user/call/CallWithAiPage"))
const LoginSuccess = lazy(() => import("@/pages/loginsuccess"))
const VocabPage = lazy(() => import("@/pages/user/materials/VocabPage"))
const GrammarPage = lazy(() => import("@/pages/user/materials/GrammarPage"))
const ProfilePage = lazy(() => import("@/pages/user/profile/ProfilePage"))
const UpgradePage = lazy(() => import("@/pages/user/upgrade/UpgradePage"))
const ResultPage = lazy(() => import("@/pages/user/practice-ielts/result/ResultPage"))
const ResultExplainPage = lazy(() => import("@/pages/user/practice-ielts/result_explain/ResultExplainPage"))
const RoadmapSetupPage = lazy(() => import("@/pages/user/roadmap/RoadmapSetupPage"))
const RoadmapPage = lazy(() => import("@/pages/user/roadmap/RoadmapPage"))
const PronunciationPracticePage = lazy(() => import("@/pages/user/practice-general/PronunciationPracticePage"))
const SampleWritingsPage = lazy(() => import("@/pages/user/practice-general/SampleWritingsPage"))
const AdminPage = lazy(() => import("@/pages/admin/AdminPage"))

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
    path: "/practice-ielts/explain/:attemptId",
    element: <ProtectedRoute><ResultExplainPage /></ProtectedRoute>,
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
  {
    path: "/admin/*",
    element: <ProtectedRoute><AdminPage /></ProtectedRoute>,
  },
]