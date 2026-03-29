import { useSearchParams, useParams } from "react-router-dom"
import theme from "@/styles/theme"
import PracticeTabs from "@/components/practice/PracticeTabs"
import PracticeSection from "@/components/practice/PracticeSection"
import SearchBar from "@/components/components/SearchBar"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { practiceApi } from "@/api/practice.api"
import { useEffect, useState } from "react"
import { PracticeSkill } from "@/data/practices/practiceSkill.model"

export default function PracticePage() {

    const [params,setParams] = useSearchParams()
    const { skill = "reading" } = useParams()

    const [skills, setSkills] = useState<PracticeSkill[]>([])
    const [loading, isLoading] = useState(true)

    const search = params.get("search") || ""
    const sort = params.get("sort") || ""
    
    useEffect(() => {
        const fetchSkills = async() => {
            try {
                const res = await practiceApi.getSkills()
                setSkills(res.data.data)
            } catch (err) {
                console.log("API error: ",err)
            } finally {
                isLoading(false)
            }
        }

        fetchSkills()
    }, [])

    //filter skill
    const skillData = skills.filter(
        (s) => s.skillType.toLowerCase() === skill.toLowerCase()
    )
    
    function updateQuery(newParams:any){
        setParams({
        search,
        sort,
        ...newParams
        })
    }

    return (
        <MainLayout>
            <main
                style={{
                    width: "100%",   
                    maxWidth: "75rem",  
                    margin:"0 auto",
                    padding:"40px 20px"
                }}
                >

                <h1
                    style={{
                    fontSize:42,
                    color:theme.colors.third,
                    marginBottom:30
                    }}
                >
                    IELTS PRACTICE
                </h1>

                {/* skill tabs */}
                <PracticeTabs
                    skill={skill}
                />

                {/* search + sort */}
                <SearchBar
                    search={search}
                    sort={sort}
                    updateQuery={updateQuery}
                />

                {/* sections */}
                {skillData.map((item) => (
                    <PracticeSection
                        skillContentId={item.skillContentId}
                        key={item.skillContentId}
                        title={item.practiceTests[0]?.title || item.skillType}
                        count={item.practiceTests.length}
                        exercises={item.practiceTests}
                        numberOfVisits={item.numberOfVisits}
                    />
                ))}
            </main>
        </MainLayout>
    )
}