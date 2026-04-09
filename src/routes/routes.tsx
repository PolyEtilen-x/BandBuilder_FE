import Home from "@/pages/home/home"
import { lazy } from "react"
const PracticePage = lazy(() => import("@/pages/practice/PracticePage"))
import PracticeTestPage from "@/pages/practice/PracticeTestPage"
import { Route } from "react-router-dom"
import path from "path"
import LoginSuccess from "@/pages/loginsuccess"
import VocabPage from "@/pages/materials/vocabulary/VocabPage"
import TopicDetail from "@/components/vocab/topic/topic_details/TopicDetail"

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
  },
  {
    path: "/materials/vocabulary",
    element: <VocabPage />, 
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
    path: "/vocab/topic/:topicName",
    element: <TopicDetail />
  }    
]