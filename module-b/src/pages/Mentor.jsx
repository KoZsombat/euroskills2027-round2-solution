import { useState, useEffect } from "react"

function Mentor() {
    const [sessions, setSessions] = useState([])
    const [credit, setCredit] = useState(0)
    const [userSessions, setUserSessions] = useState([])
    const [error, setError] = useState(null)

    function formatShortDate(isoString) {
        if (!isoString) return ""
        const datePart = isoString.split("T")[0]
        const [year, month, day] = datePart.split("-")
        if (!year || !month || !day) return datePart
        return `${month}/${day}/${year}`
    }

    function formatLongDate(isoString) {
        if (!isoString) return ""
        const date = new Date(isoString)
        if (Number.isNaN(date.getTime())) return ""

        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        return `${dayNames[date.getDay()]} ${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
    }

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
            setCredit(data.user.creditBalance)
            setUserSessions(data.sessions || [])
        }
    }

    async function GetSessions(){
        const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/mentors/sessions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": localStorage.getItem("token")
            }
        })

        const data = await res.json()

        if (res.status === 200) {
            setSessions(data.sessions)
        }
    }

    useEffect(() => {
        async function Refresh() {
            await Promise.all([GetData(), GetSessions()])
        }

        Refresh()
        const intervalId = setInterval(Refresh, 30000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])

    async function BookSession(id) {
        const res = await fetch(`https://cXX-solution.ssa.skillsit.hu/api/v1/mentors/sessions/${id}/book`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": localStorage.getItem("token")
            }
        })

        const data = await res.json()
        if (res.status === 403) setError(data.message)
        if (res.status === 409) setError(data.message)

        GetSessions()
    }

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, 3000)
    }, [error])

    if (!sessions || sessions.session) return <p>Loading</p>

    return (
        <>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 mb-5">
                <h1 className="text-2xl font-bold pb-5">MENTOR SESSION BOOKING</h1>
                <p>Book one-on-one sessions with expert mentors to accelerate your learning</p>
                <div className="border-1 border-blue-300 rounded-xl mt-5 p-5 bg-blue-100">
                    <p className="text-lg font-bold">Your Current Balance: {credit} Credits</p>
                    <p>Sessions arte automatically checked for confirmations every 30 secounds</p>
                </div>
            </div>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5">
                <h1 className="text-2xl font-bold">YOUR BOOKED SESSIONS</h1>
                {userSessions.map(session => (
                    <div key={session.session.id} className="border-1 border-gray-300 rounded-xl bg-white mt-5 p-5">
                        <h1 className="text-lg font-bold pb-2">{session.session.mentorName}</h1>
                        <hr className="border-dashed pb-2" />
                        <p className={session.status == "confirmed" || session.status == "completed" ? "bg-green-100 border-1 border-gray-300 rounded-xl border-green-300 p-3 w-max" : session.status == "pending" ? "bg-yellow-100 border-1 border-yellow-300 p-3 w-max" : session.status == "rejected" || session.status == "cancelled" ? "bg-red-100 border-1 border-red-300 p-3 w-max" : null}>{session.status}</p>
                        <div className="flex flex-col sm:flex-row gap-1 mt-2">
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">DATE</p>
                                <p className="text-sm font-bold">{formatLongDate(session.session.sessionDate)}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">TIME</p>
                                <p className="text-sm font-bold">{session.session.sessionDate.split("T")[1].slice(0,2)}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">COST</p>
                                <p className="text-sm font-bold">{session.creditsPaid} CREDITS</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">BOOKED</p>
                                <p className="text-sm font-bold">{formatShortDate(session.bookedAt)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-1 border-gray-300 rounded-xl bg-gray-100 mt-5 p-5">
                <h1 className="text-2xl font-bold">AVAILABLE SESSIONS</h1>
                {error ? (<p className="bg-red-500 p-5 text-sm absolute top-5 right-1/2 left-1/2">{error}</p>) : null}
                {sessions.filter((session) => session.isAvailable).map(session => (
                    <div key={session.id} className="border-1 border-gray-300 rounded-xl bg-white mt-5 p-5">
                        <p className="text-lg font-bold">{session.mentorName}</p>
                        <hr className="border-dashed my-2" />
                        <p><b>Expertise:</b> {session.expertise}</p>
                        <p className="py-2">Experience level: {session.experienceLevel}</p>
                        <div className="flex flex-col sm:flex-row gap-1">
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">DATE</p>
                                <p className="text-sm font-bold">{formatLongDate(session.sessionDate)}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">TIME</p>
                                <p className="text-sm font-bold">{session.sessionDate ? (session.sessionDate.split("T")[1].slice(0,2) > 12 ? session.sessionDate.split("T")[1].slice(0,2) - 12 + ":00 PM" : session.sessionDate.split("T")[1].slice(0,2) >= 10 ? session.sessionDate.split("T")[1].slice(0,2) + ":00 AM" : session.sessionDate.split("T")[1].slice(1,2) + ":00 AM") : ""}</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">DURATION</p>
                                <p className="text-sm font-bold">{session.durationMinutes} MINUTES</p>
                            </div>
                            <div className="w-full border-1 border-gray-300 rounded-xl bg-gray-100 text-center p-2">
                                <p className="text-xs">COST</p>
                                <p className="text-sm font-bold">{session.creditCost} CREDITS</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-max">
                            <button className="opacity-50 border-1 border-gray-500 rounded-xl bg-gray-100 bg-gray-300 p-3 my-5 px-5 cursor-not-allowed" disabled>VIEW PROFILE</button>
                            <button className="border-1 border-gray-300 rounded-xl bg-gray-100 p-3 px-5 hover:bg-gray-200 transition-all duration-150" onClick={() => BookSession(session.id)}>BOOK SESSION</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Mentor