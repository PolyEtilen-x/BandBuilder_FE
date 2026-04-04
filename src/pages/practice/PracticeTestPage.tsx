import PassagePanel from "@/components/test/ReadingPanel"
import QuestionPanel from "@/components/test/QuestionPanel"
import QuestionNavigator from "@/components/test/QuestionNavigator"
import ListeningPanel from "@/components/test/ListeningPanel"

import { useEffect } from "react"
import { practiceApi } from "@/api/practice.api"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { useSearchParams } from "react-router-dom"

export default function PracticeTestPage() {

    const [test, setTest] = useState<any>(null)
    const [loading, setLoading] = useState(true)    

    const { skill, id } = useParams()
    console.log("test id",skill, id)

    const [searchParams] = useSearchParams()
    const passageNumber = Number(searchParams.get("unit") || 1)    

    const [answers,setAnswers] = useState<Record<string,string>>({})
    
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await practiceApi.getSkillPreview(id!)
                setTest(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchTest()
    }, [id])

    console.log("test data:", test)

    if (loading) return <div>Loading...</div>
    if (!test) return <div>No data</div>
    
    console.log("id =", id)

    const isReading = !!test?.content?.passages
    const isListening = !!test?.content?.sections

    const unitNumber = Number(searchParams.get("unit") || 1)

    let currentUnit = null

    if (isReading) {
    const passages = test.content.passages
    currentUnit =
        passages.find((p:any)=>p.passage_number === unitNumber)
        || passages[0]
    }

    if (isListening) {
    const sections = test.content.sections
    currentUnit =
        sections.find((s:any)=>s.section === unitNumber)
        || sections[0]
    }

    if (!currentUnit) return <div>No passage found</div>

    function updateAnswer(id:string,value:string){
        setAnswers(prev => ({
            ...prev,
            [id]:value
        }))
    }
    console.log("passage", currentUnit)

    return (
        <main
            style={{
                height:"100vh",
                display:"grid",
                gridTemplateRows:"1fr 110px",
                background: "#fff"
            }}
        >

            {/* PASSAGE + QUESTIONS */}
            <section
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    overflow: "hidden"
                }}
                className="test-layout"
            >

                {isReading && <PassagePanel passage={currentUnit} />}
                {isListening && <ListeningPanel section={currentUnit} />}

                <QuestionPanel
                    questionBlocks={currentUnit?.question_blocks || []}
                    answers={answers}
                    updateAnswer={updateAnswer}
                />

            </section>


            {/* QUESTION NAVIGATOR */}
            <QuestionNavigator
                questionBlocks={currentUnit?.question_blocks || []}
                answers={answers}
            />
        </main>

    )

}