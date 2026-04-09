import PassagePanel from "@/components/test/LayoutSkill/ReadingPanel"
import QuestionPanel from "@/components/test/TestComponent/QuestionPanel"
import QuestionNavigator from "@/components/test/TestComponent/QuestionNavigator"
import ListeningPanel from "@/components/test/LayoutSkill/ListeningPanel"
import { practiceApi } from "@/api/practice.api"

import { useEffect, useState } from "react"
import { useSearchParams, useLocation, useParams } from "react-router-dom"
import RealExam from "@/components/test/RealExamModal/RealExam"
import PracticeExam from "@/components/test/PracticeModal/PracticeExam"
export default function PracticeTestPage() {

    const [test, setTest] = useState<any>(null)
    const [loading, setLoading] = useState(true)    

    const { id } = useParams()

    const location = useLocation()
    const mode = location.state?.mode || "practice"

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

    return mode === "exam" ? (
        <RealExam
            test={test}
            unit={currentUnit}
            answers={answers}
            updateAnswer={updateAnswer}
        />
        ) : (
        <PracticeExam
            test={test}
            unit={currentUnit}
            answers={answers}
            updateAnswer={updateAnswer}
        />
    )
}
