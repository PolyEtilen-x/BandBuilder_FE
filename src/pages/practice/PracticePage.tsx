import { useSearchParams, useParams } from "react-router-dom"
import theme from "@/theme"
import PracticeTabs from "@/components/practice/PracticeTabs"
import PracticeSection from "@/components/practice/PracticeSection"
import SearchBar from "@/components/components/SearchBar"
import MainLayout from "@/components/layout/MainLayout/MainLayout"
import { practiceData } from "@/data/practice.data"

export default function PracticePage() {

    const [params,setParams] = useSearchParams()

    const { skill = "reading" } = useParams()
    const search = params.get("search") || ""
    const sort = params.get("sort") || ""
    
    const skillData = practiceData.find(
        (s) => s.skill === skill
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
                    maxWidth:1200,
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
                {skillData?.sections.map(section => (
                    <PracticeSection
                        key={section.name_practice}
                        title={section.name_practice}
                        count={section.total}
                        exercises={section.exercises}
                    />
                ))}
            </main>
        </MainLayout>
    )
}