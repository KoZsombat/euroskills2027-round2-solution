import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

function Courses(){
    const [courses, setCourses] = useState([])
    const [search, setSearch] = useState("")
    const [diff, setDiff] = useState("all")

    async function Enroll(id){
        await fetch(`https://cXX-solution.ssa.skillsit.hu/api/v1/courses/${id}/enroll`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": localStorage.getItem("token")
            }
        })

        async function GetCourses(){
            const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })

            const data = await res.json()

            if (res.status === 200) {
                setCourses(data.courses)
            }
        }

        GetCourses()
    }

    useEffect(() =>{
        async function GetCourses(){
            const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })

            const data = await res.json()

            if (res.status === 200) {
                setCourses(data.courses)
            }
        }

        GetCourses()
    }, [])

    return (
        <>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 mb-5">
                <h1 className="text-2xl font-bold pb-5">COURSE CATALOG</h1>
                <p className="mb-4">Discover and enroll in courses to advance your skills</p>
                <div className="flex flex-row justify-between">
                    <input className="p-3 border-1 border-gray-300 rounded-xl bg-white w-[80%] hover:bg-gray-200 transition-all duration-150" type="text" placeholder="Search courses by title or description..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <select className="border-1 border-gray-300 rounded-xl bg-white w-[18%] text-center hover:bg-gray-200 transition-all duration-150" value={diff} onChange={(e) => setDiff(e.target.value)}>
                        <option value="all">All Difficulties</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {
                courses.filter((course) => course.title.toLowerCase().includes(search.toLowerCase()) || course.description.toLowerCase().includes(search.toLowerCase())).filter((course) => diff != "all" ? course.difficulty == diff : course.difficulty != diff).map(course =>(
                    <div key={course.id} className="border-1 border-gray-300 rounded-xl bg-white mt-5 p-5">
                        <h1 className="font-bold">{course.title}</h1>
                        <hr className="border-dashed mt-2 mb-2" />
                        <p>{course.description}</p>
                        <div className="flex flex-col 2xl:flex-row gap-1 mt-2">
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs pb-2">DIFFICULTY</p>
                                <p className="text-sm p-2 border-1 border-gray-300 rounded-xl bg-white">{course.difficulty}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs pb-2">CHAPTERS</p>
                                <p className="text-sm font-bold flex h-9 justify-center items-center">{course.totalChapters}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs pb-2">TOTAL CREDITS</p>
                                <p className="text-sm font-bold flex h-9 justify-center items-center">{course.totalCredits} CREDITS</p>
                            </div>
                        </div>
                        <div className="mt-3 p-5 w-full flex justify-center items-center">
                            {
                                course.isEnrolled ? (
                                    <Link className="py-3 px-5 bg-green-100 border-1 border-gray-300 rounded-xl border-green-300 hover:bg-green-200 transition-all duration-150" to={`/course/${course.id}`}>CONTINUE LEARNING</Link>
                                ) : (
                                    <button className="py-3 w-full border-1 border-gray-300 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-150" onClick={() => Enroll(course.id)}>ENROLL NOW</button>
                                )
                            }
                        </div>
                    </div>
                ))
            }
            </div>
        </>
    )

}

export default Courses