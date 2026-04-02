import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigation = useNavigate()

    if (localStorage.getItem("token")) navigation("/")

    async function HandleLogin(){
        const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/users/login", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: email, password: password})
        })

        const data = await res.json()

        if (res.status === 401) setError(data.message)
        else if (res.status === 200) {
            localStorage.setItem("token", data.token)
            navigation("/")
        }
    }

    return (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            <form
                className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 w-[80vw] sm:w-[30vw] flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault()
                    HandleLogin()
                }}
            >
                <h1 className="text-center text-2xl pb-7 font-bold">WELCOME BACK</h1>

                {error ? (<p className="bg-red-500 p-5 text-sm m-5 rounded-xl">{error}</p>) : null}

                <label className="text-xs pb-2">EMAIL ADDRESS</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <label className="text-xs pb-2 pt-3">PASSWORD</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button className="border-1 border-gray-300 rounded-xl bg-white p-2 mt-5 font-bold hover:bg-gray-200 transition-all duration-150" type="submit">LOGIN</button>

                <p className="pt-5 text-sm text-center">Registration is free! <Link className="underline" to="/register">CREATE AN ACCOUNT</Link></p>
            </form>
        </div>
    )
}

export default Login