import { Auth } from "./auth.js"
import { pool } from "./db.js"
import express from "express"

export const coursesRouter = express.Router()

const externalUrl = "https://content.ssa.skillsit.hu"

coursesRouter.get("/", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const response = await fetch(`${externalUrl}/api/courses`)
        const data = await response.json()
        const courses = data.courses

        const returnCourses = await Promise.all(courses.map(async course => {

            const [userEnrollment] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [user[0].user_id, course.id])

            return {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "difficulty": course.difficulty.toLowerCase(),
                "totalChapters": course.totalChapters,
                "totalCredits": course.totalCredits,
                "isEnrolled": userEnrollment.length > 0
            }
        }))

        return res.status(200).json({"courses": returnCourses})
    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable" + err
        })
    }
})

coursesRouter.get("/:id", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const { id } = req.params

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const response = await fetch(`${externalUrl}/api/courses/${id}`)
        const data = await response.json()
        const course = data.course

        if (!course) return res.status(404).json({
             "message": "Course not found"
        })


        const [userEnrollment] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [user[0].user_id, course.id])

        const [chapters] = await Promise.all(course.chapters.map(async chapter => {

            const [userChapterCompleted] = await pool.query("SELECT * FROM chapter_completions WHERE user_id = ? AND chapter_id = ?", [user[0].user_id, chapter.id])

            return {
                "id": chapter.id,
                "title": chapter.title,
                "description": chapter.description,
                "credits": chapter.credits,
                "isCompleted": userChapterCompleted.length > 0
            }
        }))

        const returnCourses = {
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "difficulty": course.difficulty.toLowerCase(),
            "totalChapters": course.totalChapters,
            "totalCredits": course.totalCredits,
            "isEnrolled": userEnrollment.length > 0,
            "chapters": chapters
        }

        return res.status(200).json({"course": returnCourses})
    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

coursesRouter.post("/:id/enroll", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const { id } = req.params

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const response = await fetch(`${externalUrl}/api/courses/${id}`)
        const data = await response.json()
        const course = data.course

        if (!course) return res.status(404).json({
             "message": "Course not found"
        })

        const [userEnrollment] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [user[0].user_id, course.id])

        if (userEnrollment.length > 0) return res.status(409).json({
            "message": "Already enrolled in this course"
        })

        const date = new Date()

        await pool.query("INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?,?,?)", [user[0].user_id, id, date])

        return res.status(200).json({
            "message": "Successfully enrolled in course"
        })

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

coursesRouter.post("/:courseId/chapters/:chapterId/complete", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const { courseId, chapterId } = req.params

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const [userEnrollment] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [user[0].user_id, courseId])

        if (userEnrollment.length == 0) return res.status(403).json({
            "message": "Not enrolled in this course"
        })

        const response = await fetch(`${externalUrl}/api/courses/${courseId}`)
        const data = await response.json()
        const course = data.course

        if (!course) return res.status(404).json({
             "message": "Course not found"
        })

        const [userChapterCompleted] = await pool.query("SELECT * FROM chapter_completions WHERE user_id = ? AND chapter_id = ?", [user[0].user_id, chapterId])

        if (userChapterCompleted.length > 0) return res.status(409).json({
            "message": "Chapter already completed"
        })

        const date = new Date()

        const earned = course.chapters[chapterId].credits

        await pool.query("INSERT INTO chapter_completions (user_id, chapter_id, credits_earned, completed_at) VALUES (?,?,?,?)", [user[0].user_id, chapterId, earned, date]) 

        const [userRow] = await pool.query("SELECT * FROM users WHERE id = ?", [user[0].user_id])

        const bal = userRow[0].credit_balance + earned

        await pool.query("UPDATE users SET credit_balance = ? WHERE id = ?", [bal, user[0].user_id])

        return res.status(200).json({
            "message": "Chapter completed",
            "creditsEarned": earned,
            "newBalance": bal
        })

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})