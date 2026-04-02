import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conf, setConf] = useState("")
    const [error, setError] = useState(null)
    const navigation = useNavigate()

    if (localStorage.getItem("token")) navigation("/")

    const validation = {
        email: !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? "Not a valid email." : null,
        password: password.length < 8 ? "The password doesn't meet the requirements! (Min. 8 characters)" : null,
        confirm: conf !== password ? "The password doesn't match!" : null,
    }

    async function HandleRegister(){
        if (validation.email || validation.password || validation.confirm) return
        const res = await fetch("https://cXX-solution.ssa.skillsit.hu/api/v1/users/register", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: name, email: email, password: password})
        })

        const data = await res.json()

        if (res.status === 400) setError(data.message)
        else if (res.status === 201) {
            navigation("/login")
        }
    }

    return (
        <div className="w-[100vw] h-[100vh] flex justify-center items-center">
            <form 
                className="border-1 border-gray-300 rounded-xl bg-gray-100 p-5 w-[80vw] sm:w-[30vw] flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault()
                    HandleRegister()
                }}
            >
                <h1 className="text-center text-2xl pb-7 font-bold">WELCOME BACK</h1>

                {error ? (<p className="bg-red-500 p-5 text-sm m-5 rounded-xl">{error}</p>) : null}

                <label className="text-xs pb-2">FULL NAME</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)}/>

                <label className="text-xs pb-2 pt-3">EMAIL ADDRESS</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                {validation.email ? (<p className="text-xs text-red-500 ptb-5 pt-1">{validation.email}</p>) : null}

                <label className="text-xs pb-2 pt-3">PASSWORD</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                {validation.password ? (<p className="text-xs text-red-500 ptb-5 pt-1">{validation.password}</p>) : null}

                <label className="text-xs pb-2 pt-3">CONFIRM PASSWORD</label>
                <input className="border-1 border-gray-300 rounded-xl bg-white p-2 hover:bg-gray-200 transition-all duration-150" type="password" placeholder="Confirm your password" value={conf} onChange={(e) => setConf(e.target.value)}/>
                {validation.confirm ? (<p className="text-xs text-red-500 ptb-5 pt-1">{validation.confirm}</p>) : null}

                <button className="border-1 border-gray-300 rounded-xl bg-white p-2 mt-5 font-bold hover:bg-gray-200 transition-all duration-150" type="submit">CREATE ACCOUNT</button>

                <p className="pt-5 text-sm text-center">Already have an account? <Link className="underline" to="/login">SIGN IN HERE</Link></p>
            </form>
        </div>
    )
}

export default Register