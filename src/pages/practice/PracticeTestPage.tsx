import PassagePanel from "@/components/test/PassagePanel"
import QuestionPanel from "@/components/test/QuestionPanel"
import QuestionNavigator from "@/components/test/QuestionNavigator"

import { useEffect } from "react"
import { practiceApi } from "@/api/practice.api"

import { useState } from "react"
import { useParams } from "react-router-dom"

export default function PracticeTestPage() {

    const [test, setTest] = useState<any>(null)
    const [loading, setLoading] = useState(true)    

    const { skill, id } = useParams()
    console.log("test id",skill, id)
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

    const passage = test?.content?.passages?.[0]

    function updateAnswer(id:string,value:string){
        setAnswers(prev => ({
            ...prev,
            [id]:value
        }))
    }
    console.log("passage", passage)

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
                display:"grid",
                gridTemplateColumns:"2fr 1fr",
                overflow:"hidden"
                }}
            >

                <PassagePanel passage={passage} />

                <QuestionPanel
                    questionBlocks={passage?.question_blocks || []}
                    answers={answers}
                    updateAnswer={updateAnswer}
                />

            </section>


            {/* QUESTION NAVIGATOR */}
            <QuestionNavigator
                questionBlocks={passage?.question_blocks || []}
                answers={answers}
            />
        </main>

    )

}