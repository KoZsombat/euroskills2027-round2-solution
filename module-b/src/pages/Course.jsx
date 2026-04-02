import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

function Course(){
    const { id } = useParams()
    const [course, setCourse] = useState(null)

    async function Complete(cId){
        await fetch(`https://cXX-solution.ssa.skillsit.hu/api/v1/courses/${id}/chapters/${cId}/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": localStorage.getItem("token")
            }
        })

        async function GetCourse(){
            const res = await fetch(`https://cXX-solution.ssa.skillsit.hu/api/v1/courses/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })

            const data = await res.json()

            if (res.status === 200) {
                setCourse(data)
            }
        }

        GetCourse()
    }

    useEffect(() =>{
        async function GetCourse(){
            const res = await fetch(`https://cXX-solution.ssa.skillsit.hu/api/v1/courses/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })

            const data = await res.json()

            if (res.status === 200) {
                setCourse(data)
            }
        }

        GetCourse()
    }, [])

    if (!course || !course.course) return <p>Loading</p>

    const completedChapters = course.course.chapters.filter((chapter) => chapter.isCompleted).length
    const completedCredits = course.course.chapters
        .filter((chapter) => chapter.isCompleted)
        .reduce((sum, chapter) => sum + chapter.credits, 0)
    const chapterPercent = Number((completedChapters / Number(course.course.totalChapters || 1)) * 100).toFixed(0)
    const creditPercent = Number((completedCredits / Number(course.course.totalCredits || 1)) * 100).toFixed(0)

    return (
        <>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 mb-5">
                <Link className="py-3 px-5 w-full border-1 border-gray-300 rounded-xl bg-white" to="/courses">BACK TO COURSES</Link>
                <h1 className="text-2xl font-bold mt-10">{course.course.title}</h1>
                <p className="py-5">{course.course.description}</p>
                <div className="flex flex-between gap-10">
                    <div className="border-1 border-gray-300 rounded-xl bg-white border-dashed text-center w-full p-5">
                        <p>CHAPTER PROGRESS</p>
                        <div className="w-full h-3 border-1 border-gray-300 rounded-xl bg-white mt-3 mb-3">
                            <div
                                className="h-full bg-black"
                                style={{ width: `${chapterPercent}%` }}
                            ></div>
                        </div>
                        <p className="font-bold text-xs">{completedChapters} OF {course.course.totalChapters} CHAPTERS COMPLETED ({chapterPercent}) %</p>
                    </div>
                    <div className="border-1 border-gray-300 rounded-xl bg-white border-dashed text-center w-full p-5">
                        <p>CREDIT PROGRESS</p>
                        <div className="w-full h-3 border-1 border-gray-300 rounded-xl bg-white mt-3 mb-3">
                            <div
                                className="h-full bg-black"
                                style={{ width: `${creditPercent}%` }}
                            ></div>
                        </div>
                        <p className="font-bold text-xs">{completedCredits} OF {course.course.totalCredits} CREDITS COMPLETED</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                {
                    course.course.chapters.map(chapter => (
                        <div className="border-1 p-5">
                            <h1 className="font-bold text-lg ">CHAPTER {course.course.chapters.indexOf(chapter)+1}: {chapter.title}</h1>
                            <hr className="border-dashed mt-3 pb-2" />
                            <p>{chapter.description}</p>
                            <p className="p-3 border-1 w-max my-3">{chapter.credits} CREDITS</p>
                            <div className="flex mt-6 mb-3 gap-2">
                                <p className="p-3 border-1 opacity-50 cursor-not-allowed">VIEW CHAPTER</p>
                                {
                                    chapter.isCompleted ? 
                                    (<p className="p-3 border-1 bg-green-100 border-green-300 text-green-600">CHAPTER COMPLETED</p>) 
                                    : 
                                    (<button className="p-3 border-1 bg-green-100 border-green-300" onClick={() => Complete(chapter.id)}>MARK AS COMPLETED</button>)
                                }
                            </div>
                            { chapter.isCompleted ? (<button className="p-3 w-full border-1 font-bold">SHARE ACHIEVEMENT</button>) : null }
                        </div>
                    ))
                }
            </div>
        </>
    )

}

export default Course