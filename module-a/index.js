import express from "express"
import { userRouter } from "./src/users.js"
import { coursesRouter } from "./src/courses.js"
import { mentorsRouter } from "./src/mentors.js"

const app = express()

app.use(express.json())

const router = express.Router()

app.use("/api/v1", router)

router.use("/users", userRouter)
router.use("/courses", coursesRouter)
router.use("/mentors", mentorsRouter)

app.listen(3000, () => {
    console.log("Server running")
})