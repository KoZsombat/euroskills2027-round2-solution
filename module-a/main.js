import express from "express"
import mysql from "mysql2/promise"
import bcrypt from "bcrypt"
import crypto from "crypto"

const pool = mysql.createPool({
    host: "db.ssa.skillsit.hu",
    port: 3306,
    user: "cXX",
    password: "2506",
    database: "cXX_module-a"
})

const externalUrl = "https://content.ssa.skillsit.hu"

const app = express()
app.use(express.json())

const router = express.Router()
app.use("/api/v1", router)

async function authMiddleware(req, res, next){
    try{
        const token = req.headers["x-api-token"]

        if (!token) return res.status(401).json({
            "message": "Invalid token"
        })

        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        if (users.length == 0) return res.status(401).json({
            "message": "Invalid token"
        })

        next()
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
}

router.post("/users/register", async (req, res) => {
    try{
        const { email, password, name } = req.body

        if (!email || !password || !name) return res.status(400).json({"message": "Bad Request"})

        const [usersWithThisEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

        if (usersWithThisEmail.length > 0) return res.status(400).json({
            "message": "Failed to register user"
        })

        const date = new Date()
        const hashedPass = await bcrypt.hash(password, 10)
        const [insertUser] = await pool.query("INSERT INTO users (name, email, password, role, credit_balance, created_at, updated_at) VALUES (?,?,?,?,?,?,?)", [name, email, hashedPass, "learner", 0, date, date])

        return res.status(201).json({
            "message": "User created successfully",
            "user": {
                "id": insertUser.insertId,
                "email": email,
                "name": name,
                "credits": 0
            }
        })
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({"message": "Bad Request"})

        const [usersWithThisEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

        if (usersWithThisEmail.length == 0) return res.status(401).json({
            "message": "Invalid email or password"
        })

        const storedHash = usersWithThisEmail[0].password
        const normalizedHash = typeof storedHash == "string" && storedHash.startsWith("$2y$")
            ? `$2b$${storedHash.slice(4)}`
            : storedHash

        const comparedPass = await bcrypt.compare(password, normalizedHash)

        if (comparedPass){
            const token = `${usersWithThisEmail[0].name.split(" ")[0].toLowerCase()}_token_${crypto.randomBytes(15).toString("hex").slice(0, 15)}`

            const date = new Date()
            await pool.query("INSERT INTO api_tokens (user_id, token, created_at, revoked_at) VALUES (?,?,?,?)", [usersWithThisEmail[0].id, token, date, null])

            return res.status(200).json({
                "message": "Login successful",
                "user": {
                    "id": usersWithThisEmail[0].id,
                    "name": usersWithThisEmail[0].name,
                    "email": usersWithThisEmail[0].email,
                    "credits": usersWithThisEmail[0].credit_balance
                },
                "token": token
            })
        } else {
            return res.status(401).json({
                "message": "Invalid email or password"
            })
        }
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.post("/users/logout", authMiddleware, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const date = new Date()

        await pool.query("UPDATE api_tokens SET revoked_at = ? WHERE token = ?", [date, token])

        return res.status(200).json({
            "message": "Logout successful"
        })
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.get("/users/me", authMiddleware , async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])
        const [stats] = await pool.query("SELECT * FROM users WHERE id = ?", [users[0].user_id])
        const [enrolledCourses] = await pool.query("SELECT COUNT(*) as enrolledCourses FROM enrollments WHERE user_id = ?", [users[0].user_id])
        const [completedChapters] = await pool.query("SELECT COUNT(*) as completedChapters FROM chapter_completions WHERE user_id = ?", [users[0].user_id])
        const [totalCreditsEarned] = await pool.query("SELECT SUM(credits_earned) as totalCreditsEarned FROM chapter_completions WHERE user_id = ?", [users[0].user_id])
        const [upcomingBookings] = await pool.query("SELECT COUNT(*) as upcomingBookings FROM session_bookings WHERE user_id = ? AND status = 'confirmed'", [users[0].user_id])

        const [activity1] = await pool.query("SELECT credits_paid, booked_at as time, session_id FROM session_bookings WHERE user_id = ?", [users[0].user_id])
        const [activity2] = await pool.query("SELECT credits_earned, completed_at as time, chapter_id FROM chapter_completions WHERE user_id = ?", [users[0].user_id])

        const readyActivity1 = await Promise.all(activity1.map(async activity => {

            const [mentor] = await pool.query("SELECT * FROM mentor_sessions WHERE id = ?", [activity.session_id])

            return {
                "type": "session_booked",
                "description": `Booked session with ${mentor[0].mentor_name}`,
                "creditsPaid": activity.credits_paid,
                "timestamp": activity.time
            }
        }))

        const readyActivity2 = activity2.map(activity => {
            return {
                "type": "chapter_completed",
                "description": `Completed chapter ${activity.chapter_id}`,
                "creditsEarned": activity.credits_earned,
                "timestamp": activity.time
            }
        })

        const activity = [...readyActivity1, ...readyActivity2]

        activity.sort((a, b) => {
            return b.timestamp - a.timestamp
        })

        if (activity.length > 5) activity.splice(5)

        const [userSessions] = await pool.query("SELECT * FROM session_bookings WHERE user_id = ?", [users[0].user_id])

        const readyUserSessions = await Promise.all(userSessions.map(async session => {

            const [mentor] = await pool.query("SELECT * FROM mentor_sessions WHERE id = ?", [session.session_id])

            return {
                "id": session.id,
                "session": {
                    "id": session.session_id,
                    "mentorName": mentor[0].mentor_name,
                    "expertise": mentor[0].expertise,
                    "experienceLevel": mentor[0].experience_level,
                    "sessionDate": mentor[0].session_date,
                    "durationMinutes": mentor[0].duration_minutes
                },
                "status": session.status,
                "creditsPaid": session.credits_paid,
                "bookedAt": session.booked_at
            }
        }))

        return res.status(200).json({
            "user": {
                "id": users[0].user_id,
                "name": stats[0].name,
                "email": stats[0].email,
                "creditBalance": stats[0].credit_balance
            },
            "stats": {
                "enrolledCourses": enrolledCourses[0].enrolledCourses,
                "completedChapters": completedChapters[0].completedChapters,
                "totalCreditsEarned": totalCreditsEarned[0].totalCreditsEarned == null ? 0 : Number(totalCreditsEarned[0].totalCreditsEarned),
                "upcomingBookings": upcomingBookings[0].upcomingBookings
            },
            "recentActivity": activity,
            "sessions": readyUserSessions
        })
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.get("/courses", authMiddleware , async (req, res) => {
    try {
        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        const answer = await fetch(`${externalUrl}/api/courses`)
        const data = await answer.json()
        const coursesData = data.courses

        const courses = await Promise.all(coursesData.map(async course => {
            const [enrolled] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [users[0].user_id, course.id])

            return {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "difficulty": course.difficulty,
                "totalChapters": course.totalChapters,
                "totalCredits": course.totalCredits,
                "isEnrolled": enrolled.length > 0
            }
        }))

        return res.status(200).json({courses})
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.get("/courses/:id", authMiddleware , async (req, res) => {
    try {
        const { id } = req.params

        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        const answer = await fetch(`${externalUrl}/api/courses/${id}`)
        const data = await answer.json()

        if (!data?.course) {
            return res.status(404).json({"message": "Course not found"})
        }

        const courses = [data.course]

        const mappedCourses = await Promise.all(courses.map(async course => {
            const [enrolled] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [users[0].user_id, course.id])

            const chapters = await Promise.all((course.chapters || []).map(async chapter => {
                const [completed] = await pool.query("SELECT * FROM chapter_completions WHERE user_id = ? AND chapter_id = ?", [users[0].user_id, chapter.id])

                return {
                    "id": chapter.id,
                    "title": chapter.title,
                    "description": chapter.description,
                    "credits": chapter.credits,
                    "isCompleted": completed.length > 0
                }
            }))

            return {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "difficulty": course.difficulty,
                "totalChapters": course.totalChapters,
                "totalCredits": course.totalCredits,
                "isEnrolled": enrolled.length > 0,
                "chapters": chapters
            }
        }))

        if (mappedCourses.length == 0) return res.status(404).json({"message": "Course not found"})

        return res.status(200).json({"course": mappedCourses[0]})
    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.post("/courses/:id/enroll", authMiddleware , async (req, res) => {
    try {
        const { id } = req.params

        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        const answer = await fetch(`${externalUrl}/api/courses/${id}`)
        const data = await answer.json()

        if (!data?.course) {
            return res.status(404).json({"message": "Course not found"})
        }

        const [enrolled] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [users[0].user_id, id])

        if (enrolled.length > 0) return res.status(409).json({"message": "Already enrolled in this course"})

        const date = new Date()
        await pool.query("INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?,?,?)", [users[0].user_id, id, date])

        res.status(200).json({"message": "Successfully enrolled in course"})

    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }   
})

router.post("/courses/:courseId/chapters/:chapterId/complete", authMiddleware , async (req, res) => {
    try {
        const { courseId, chapterId } = req.params

        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        const answer = await fetch(`${externalUrl}/api/courses/${courseId}`)
        const data = await answer.json()

        if (!data?.course) {
            return res.status(404).json({"message": "Course not found"})
        }

        const course = data.course

        if (!course || !Array.isArray(course.chapters)) {
            return res.status(404).json({"message": "Course not found"})
        }

        const chapter = course.chapters[chapterId]

        if (!chapter) {
            return res.status(404).json({"message": "Chapter not found"})
        }

        const cred = chapter.credits

        const [enrolled] = await pool.query("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?", [users[0].user_id, courseId])

        if (enrolled.length == 0) return res.status(403).json({"message": "Not enrolled in this course"})

        const [completed] = await pool.query("SELECT * FROM chapter_completions WHERE user_id = ? AND chapter_id = ?", [users[0].user_id, chapterId])

        if (completed.length > 0) return res.status(409).json({"message": "Chapter already completed"})

        const date = new Date()
        await pool.query("INSERT INTO chapter_completions (user_id, chapter_id, credits_earned, completed_at) VALUES (?,?,?,?)", [users[0].user_id, chapterId, cred, date])
        const [stats] = await pool.query("SELECT * FROM users WHERE id = ?", [users[0].user_id])
        await pool.query("UPDATE users SET credit_balance = ? WHERE id = ?", [stats[0].credit_balance + cred, users[0].user_id])

        return res.status(200).json({
            "message": "Chapter completed",
            "creditsEarned": cred,
            "newBalance": stats[0].credit_balance + cred
        })

    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }   
})

router.get("/mentors/sessions", authMiddleware , async (req, res) => {
    try {

        const [sessions] = await pool.query("SELECT * FROM mentor_sessions WHERE is_available = 1")
        
        const sessionsAnswer = sessions.map(session => {
            return {
                "id": session.id,
                "mentorName": session.mentor_name,
                "expertise": session.expertise,
                "experienceLevel": session.experience_level,
                "sessionDate": session.session_date,
                "durationMinutes": session.duration_minutes,
                "creditCost": session.credit_cost,
                "isAvailable": session.is_available == 1
            }
        })

        return res.status(200).json({"sessions": sessionsAnswer})

    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

router.post("/mentors/sessions/:id/book", authMiddleware , async(req, res) => {
    try {
        const { id } = req.params

        const token = req.headers["x-api-token"]
        const [users] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])
        const [stats] = await pool.query("SELECT * FROM users WHERE id = ?", [users[0].user_id])

        const [isAvailable] = await pool.query("SELECT * FROM mentor_sessions WHERE id = ?", [id])

        if (isAvailable.length == 0) return res.status(404).json({"message": "Session not found"})

        if (isAvailable[0].is_available == 0) return res.status(409).json({"message": "Session not available"})

        if (isAvailable[0].credit_cost > stats[0].credit_balance) return res.status(403).json({"message": "Insufficient credits"})

        const date = new Date()
        const [insert] = await pool.query("INSERT INTO session_bookings (user_id, session_id, status, credits_paid, booked_at) VALUES (?,?,?,?,?)", [users[0].user_id, id, "pending", isAvailable[0].credit_cost, date])
        await pool.query("UPDATE users SET credit_balance = ? WHERE id = ?", [stats[0].credit_balance - isAvailable[0].credit_cost, users[0].user_id])
        await pool.query("UPDATE mentor_sessions SET is_available = 0 WHERE id = ?", [isAvailable[0].id])

        return res.status(200).json({
            "message": "Session booked successfully",
            "booking": {
                "id": insert.insertId,
                "sessionId": id,
                "status": "pending",
                "creditsPaid": isAvailable[0].credit_cost,
                "bookedAt": date
            }
        })

    } catch (error) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

app.listen(80, () => {
    console.log("running")
})