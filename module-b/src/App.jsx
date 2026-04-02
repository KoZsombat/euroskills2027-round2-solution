import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Layout from "./pages/Layout"
import Secured from "./pages/Secured"
import Index from "./pages/Index"
import Courses from "./pages/Courses"
import Course from "./pages/Course"
import Mentor from "./pages/Mentor"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/" element={<Secured><Layout page={"INDEX"}><Index /></Layout></Secured>}/>
        <Route path="/courses" element={<Secured><Layout page={"COURSES"}><Courses /></Layout></Secured>}/>
        <Route path="/course/:id" element={<Secured><Layout page={"COURSES"}><Course /></Layout></Secured>}/>
        <Route path="/mentors" element={<Secured><Layout page={"MENTORS"}><Mentor /></Layout></Secured>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
