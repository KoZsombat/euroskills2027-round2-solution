import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Layout({ children, page }){

    const [credit, setCredit] = useState(0)
    const [name, setName] = useState("")
    const navigation = useNavigate()

    async function Logout(){
        await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": localStorage.getItem("token")
            }
        })
        localStorage.removeItem("token")
        navigation("/login")
    }

    useEffect(() => {
        async function GetUser() {
            const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/users/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-TOKEN": localStorage.getItem("token")
                }
            })
            const data = await res.json()

            if (res.status === 200) {
                setCredit(data.user.creditBalance)
                setName(data.user.name)
            }
        }

        GetUser()
    }, [])

    return (
    <div>
        <header className="flex justify-center p-5 border-b-1 border-gray-300 bg-gray-100">
            <div className="w-[80vw] sm:w-[65vw] flex flex-col sm:flex-row gap-5 sm:gap-30 ">
                <h1 className="border-1 border-gray-300 rounded-xl p-3 bg-white hover:bg-gray-200 transition-all duration-150 text-center">SKILLSHARE ACADEMY</h1>
                <nav className="flex sm:gap-10">
                    <Link className={ page == "INDEX" ? "border-1 border-gray-300 rounded-xl p-3 w-full bg-white hover:bg-gray-200 transition-all duration-150" : "p-3 w-full rounded-xl hover:bg-gray-200 transition-all duration-150" } to="/">DASHBOARD</Link>
                    <Link className={ page == "COURSES" ? "border-1 border-gray-300 rounded-xl p-3 w-full bg-white hover:bg-gray-200 transition-all duration-150" : "p-3 w-full rounded-xl hover:bg-gray-200 transition-all duration-150" } to="/courses">COURSES</Link>
                    <Link className={ page == "MENTORS" ? "border-1 border-gray-300 rounded-xl p-3 w-full bg-white hover:bg-gray-200 transition-all duration-150" : "p-3 w-full rounded-xl hover:bg-gray-200 transition-all duration-150" } to="/mentors">MENTORS</Link>
                </nav>
                <div className="flex gap-5">
                    <p className="border-1 border-gray-300 rounded-xl p-3 bg-white hover:bg-gray-200 transition-all duration-150 text-center">{credit} CREDITS</p>
                    <p className="p-3 text-center">Welcome, {name}</p>
                    <button className="border-1 border-gray-300 rounded-xl p-3 bg-white hover:bg-gray-200 transition-all duration-150 text-center" onClick={Logout}>LOGOUT</button>
                </div>
            </div>
        </header>
        <main className="flex justify-center">
            <div className="w-[80vw] sm:w-[65vw] py-10">
                {children}
            </div>
        </main>
    </div>
    )
}

export default Layout