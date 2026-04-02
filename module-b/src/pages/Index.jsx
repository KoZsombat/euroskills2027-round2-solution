import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Index(){
    const [name, setName] = useState("")
    const [credit, setCredit] = useState(0)
    const [enrolledCourses, setEnrolledCourses] = useState(0)
    const [completedChapters, setCompletedChapters] = useState(0)
    const [totalCreditsEarned, setTotalCreditsEarned] = useState(0)

    useEffect(() => {
        async function GetData() {
            const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })
            
            const data = await res.json()

            if (res.status === 200) {
                setName(data.user.name)
                setCredit(data.user.creditBalance)
                setEnrolledCourses(data.stats.enrolledCourses)
                setCompletedChapters(data.stats.completedChapters)
                setTotalCreditsEarned(data.stats.totalCreditsEarned)
            }
        }

        GetData()
    }, [])

    return (
        <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5">
            <h1 className="text-3xl font-bold">WELCOME BACK, {name} !</h1>
            <p className="font-bold text-lg py-5">CURRENT BALANCE: {credit} CREDITS</p>
            <hr className="border-dashed" />
            <div className="flex flex-col sm:flex-row gap-3 py-5 justify-between">
                <div className="border-1 border-gray-300 rounded-xl bg-white p-5 text-center w-full">
                    <h1 className="text-2xl font-bold pb-3">{enrolledCourses}</h1>
                    <p>ENROLLED COURSES</p>
                </div>
                <div className="border-1 border-gray-300 rounded-xl bg-white p-5 text-center w-full">
                    <h1 className="text-2xl font-bold pb-3">{completedChapters}</h1>
                    <p>COMPLETED CHAPTERS</p>
                </div>
                <div className="border-1 border-gray-300 rounded-xl bg-white p-5 text-center w-full">
                    <h1 className="text-2xl font-bold pb-3">{totalCreditsEarned}</h1>
                    <p>TOTAL CREDITS EARNED</p>
                </div>
            </div>
            <div className="flex gap-3 pb-5 justify-between">
                <div className="border-1 border-gray-300 rounded-xl bg-white w-full h-[40vh]"></div>
                <div className="border-1 border-gray-300 rounded-xl bg-white w-full h-[40vh]"></div>
            </div>
            <div className="flex gap-3 pb-5 justify-between">
                <Link className="border-1 border-gray-300 rounded-xl bg-white w-full p-5 text-center hover:bg-gray-200 transition-all duration-150" to="/courses">BROWSE COURSES</Link>
                <Link className="border-1 border-gray-300 rounded-xl bg-white w-full p-5 text-center hover:bg-gray-200 transition-all duration-150" to="/mentors">BOOK MENTOR SESSION</Link>
            </div>
        </div>
    )
}

export default Index