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
                <GrammarSidebar
                    state={state}
                    onChange={setState}
                    contentRef={contentRef}
                />

                {/* CONTENT */}
                <div 
                    ref={contentRef}
                    style={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                        height: "100%", 
                    }}
                >
                    {renderContent()}
                </div>

            </div>
        </MainLayout>
    )
}