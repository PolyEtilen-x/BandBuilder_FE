import VocabSidebar, { VocabSidebarState } from "@/components/vocab/VocabSidebar"
import TopicList from "@/components/vocab/TopicList"
import BandList from "@/components/vocab/BandList"
import Flashcard from "@/components/vocab/Flashcard"
import MyNotebook from "@/components/vocab/MyNotebook"

import { useState } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"

type TabType = "topics" | "band" | "flashcard" | "notebook"

export default function VocabPage() {
  const [state, setState] = useState<VocabSidebarState>({
    category: "topics",
    mode: "list",
    subItem: 1,
  })

  const renderContent = () => {
    const { category, subItem } = state

    if (category === "topics") {
      return <TopicList topicIndex={subItem} />
    }

    if (category === "band") {
      return <BandList bandIndex={subItem} />
    }

    if (category === "flashcard") {
      return <Flashcard />
    }

    if (category === "notebook") {
      return <MyNotebook />
    }

    return null
  }

  return (
    <MainLayout>
        <div className="flex">
            <VocabSidebar state={state} onChange={setState} />

            <div className="flex-1 p-6">
                {renderContent()}
            </div>
        </div>
    </MainLayout>
  )
}