import Home from "@/pages/home/home"
import { lazy } from "react"
const PracticePage = lazy(() => import("@/pages/practice/PracticePage"))

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/practice",
    element: <PracticePage />,
  },
]