import { useState, useRef } from "react"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import GrammarSidebar, {
  GrammarSidebarState,
} from "@/components/grammar/GrammarSidebar"

import GrammarBasics from "@/components/grammar/basic/Basic"
import GrammarTenses from "@/components/grammar/tense/Tense"
import GrammarSentence from "@/components/grammar/sentence/Sentence"
import MistakeList from "@/components/grammar/mistake/MistakeList"
import MistakeDetail from "@/components/grammar/mistake/MistakeDetail"

export default function GrammarPage() {
    const contentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
    const [state, setState] = useState<GrammarSidebarState>({
        category: "basics",
        subItem: "morphology", 
    })
    const [selectedMistake, setSelectedMistake] = useState<any>(null)

    const renderContent = () => {
        switch (state.category) {
        case "basics":
            return <GrammarBasics />

        case "tenses":
            return <GrammarTenses subItem={state.subItem} />
        
        case "sentence":
            return <GrammarSentence subItem={state.subItem} />

        case "mistakes":
            return selectedMistake ? (
                <MistakeDetail
                data={selectedMistake}
                onBack={() => setSelectedMistake(null)}
                />
            ) : (
                <MistakeList onSelect={setSelectedMistake} />
            )
            
        default:
            return null
        }
    }

    return (
        <MainLayout>
            <div className="app-page-layout-wrapper">
                {/* SIDEBAR */}
                <GrammarSidebar
                    state={state}
                    onChange={setState}
                    contentRef={contentRef}
                />

                {/* CONTENT */}
                <div 
                    ref={contentRef}
                    className="app-page-content-wrapper"
                >
                    {renderContent()}
                </div>

            </div>
        </MainLayout>
    )
}