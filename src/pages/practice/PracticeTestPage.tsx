import PassagePanel from "@/components/test/PassagePanel"
import QuestionPanel from "@/components/test/QuestionPanel"
import QuestionNavigator from "@/components/test/QuestionNavigator"

import mockTest from "@/data/practice_test.data"

import { useState } from "react"
import { useParams } from "react-router-dom"

export default function PracticeTestPage() {

    const { skill, id } = useParams()
    console.log("test id",skill, id)
    const [answers,setAnswers] = useState<Record<number,string>>({})

    function updateAnswer(id:number,value:string){
        setAnswers(prev => ({
        ...prev,
        [id]:value
        }))
    }

    return (
        <main
        style={{
            height:"100vh",
            display:"grid",
            gridTemplateRows:"1fr 110px"
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

            <PassagePanel passage={mockTest.passage}/>

            <QuestionPanel
                questions={mockTest.questions}
                answers={answers}
                updateAnswer={updateAnswer}
            />

        </section>


        {/* QUESTION NAVIGATOR */}
        <QuestionNavigator
            questions={mockTest.questions}
            answers={answers}
            groups={mockTest.questionGroups}
        />

        </main>

    )

}