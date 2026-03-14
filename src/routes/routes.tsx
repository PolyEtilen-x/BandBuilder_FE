import Home from "@/pages/home/home"
import { lazy } from "react"
const PracticePage = lazy(() => import("@/pages/practice/PracticePage"))
import PracticeTestPage from "@/pages/practice/PracticeTestPage"
import { Route } from "react-router-dom"

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/practice/:skill", 
    element: <PracticePage/>, 
  },
  {
    path: "/practice/:skill/test/:id",
    element: <PracticeTestPage />,
  }
]