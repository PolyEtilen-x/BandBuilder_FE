import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"

import VocabSidebar, {
  VocabSidebarState,
} from "@/components/vocab/VocabSidebar"

import TopicList from "@/components/vocab/topic/topic_list/TopicList"
import TopicDetail from "@/components/vocab/topic/topic_details/TopicDetail"

import BandList from "@/components/vocab/BandList"
import Flashcard from "@/components/vocab/Flashcard"
import MyNotebook from "@/components/vocab/MyNotebook"

type ViewState =
  | { type: "topic_list" }
  | { type: "topic_detail"; topic: string }
  | { type: "band_list" }
  | { type: "flashcard" }
  | { type: "notebook" }

export default function VocabPage() {
  const [state, setState] = useState<VocabSidebarState>({
    category: "topics",
    mode: "list",
    subItem: 1,
  })

  const [view, setView] = useState<ViewState>({
    type: "topic_list",
  })

  // 🔥 render content
  const renderContent = () => {
    switch (view.type) {
      case "topic_list":
        return (
          <TopicList
            topicIndex={state.subItem}
            onSelectTopic={(name: string) =>
              setView({ type: "topic_detail", topic: name })
            }
          />
        )

      case "topic_detail":
        return (
          <TopicDetail
            topicName={view.topic}
            onBack={() => setView({ type: "topic_list" })}
          />
        )

      case "band_list":
        return <BandList bandIndex={state.subItem} />

      case "flashcard":
        return <Flashcard />

      case "notebook":
        return <MyNotebook />

      default:
        return null
    }
  }

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",   
          gap: 30,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "30px 20px",
          alignItems: "flex-start",
          height: "calc(100vh - 80px)",
          overflow: "hidden", 
        }}
      >
        {/* SIDEBAR */}
        <VocabSidebar
          state={state}
          onChange={(next) => {
            setState(next)

            if (next.category === "topics") {
              setView({ type: "topic_list" })
            }

            if (next.category === "band") {
              setView({ type: "band_list" })
            }

            if (next.category === "flashcard") {
              setView({ type: "flashcard" })
            }

            if (next.category === "notebook") {
              setView({ type: "notebook" })
            }
          }}
        />

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100%", 
          }}
        >
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  )
}