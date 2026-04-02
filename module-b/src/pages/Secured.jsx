import { Navigate } from "react-router-dom"

function Secured({ children }){
    if (!localStorage.getItem("token")) return <Navigate to="/login" replace />

    return children
}

export default Secured