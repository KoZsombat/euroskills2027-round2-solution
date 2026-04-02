import { Auth } from "./auth.js"
import { pool } from "./db.js"
import express from "express"
import bcrypt from "bcrypt"
import crypto from "crypto"

export const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    try {
        const {email, password, name} = req.body

        if (!email || !password || !name) return res.status(400).json({
            "message": "Bad Request"
        })

        const [usersWithThisEmail] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

        if (usersWithThisEmail.length > 0) return res.status(400).json({
            "message": "Failed to register user"
        })

        const hashedPass = await bcrypt.hash(password, 10)

        const date = new Date()

        const [insertUser] = await pool.query("INSERT INTO users (name, email, password, role, credit_balance, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)", [name, email, hashedPass, "learner", 0, date, date])

        return res.status(201).json({
            "message": "User created successfully",
            "user": {
                "id": insertUser.insertId,
                "email": email,
                "name": name,
                "credits": 0
            }
        })

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) return res.status(400).json({
            "message": "Bad Request"
        })

        const [thisUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

        if (thisUser.length > 0){
            const hashedPass = thisUser[0].password.replace("$2y$", "$2b$")
            const match = await bcrypt.compare(password, hashedPass)
            if (match){
                const token = `${thisUser[0].name.split(" ")[0].toLowerCase()}_token_${crypto.randomBytes(15).toString("hex").slice(0, 15)}`
                const date = new Date()
                await pool.query("INSERT INTO api_tokens (user_id, token, created_at, revoked_at) VALUES (?,?,?,?)", [thisUser[0].id, token, date, null])

                return res.status(200).json({
                    "message": "Login successful",
                    "user": {
                        "id": thisUser[0].id,
                        "name": thisUser[0].name,
                        "email": thisUser[0].email,
                        "credits": thisUser[0].credit_balance
                    },
                    "token": token
                })
            } else {
                return res.status(401).json({
                    "message": "Invalid email or password"
                })  
            }
        } else {
            return res.status(401).json({
                "message": "Invalid email or password"
            })  
        }

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

userRouter.post("/logout", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]

        const [tokenRow] = await pool.query("SELECT * FROM api_tokens WHERE token = ? AND revoked_at IS NULL", [token])

        if (tokenRow.length > 0) {
            const date = new Date()

            await pool.query("UPDATE api_tokens SET revoked_at = ? WHERE id = ?", [date, tokenRow[0].id])

            return res.status(200).json({
                "message": "Logout successful"
            })
        } else return res.status(401).json({
            "message": "Invalid token"
        })

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

userRouter.get("/me", Auth, async (req, res) => {
    try {
        const token = req.headers["x-api-token"]

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const [userRow] = await pool.query("SELECT * FROM users WHERE id = ?", [user[0].user_id])

        const [enrolledCourses] = await pool.query("SELECT COUNT(*) as enrolledCourses FROM enrollments WHERE user_id = ?", [user[0].user_id])
        const [completedChapters] = await pool.query("SELECT COUNT(*) as completedChapters FROM chapter_completions WHERE user_id = ?", [user[0].user_id])
        const [totalCreditsEarned] = await pool.query("SELECT SUM(credits_earned) as totalCreditsEarned FROM chapter_completions WHERE user_id = ?", [user[0].user_id])
        const [upcomingBookings] = await pool.query("SELECT COUNT(*) as upcomingBookings FROM session_bookings WHERE user_id = ? AND status = ?", [user[0].user_id, "confirmed"])

        let [activity1] = await pool.query("SELECT * FROM session_bookings WHERE user_id = ?", [user[0].user_id])
        let [activity2] = await pool.query("SELECT * FROM chapter_completions WHERE user_id = ?", [user[0].user_id])

        activity1 = await Promise.all(activity1.map(async activity => {

            const [mentorRow] = await pool.query("SELECT * FROM mentor_sessions WHERE id = ?", [activity.session_id])

            return {
                "type": "session_booked",
                "description": `Booked session with ${mentorRow[0].mentor_name}`,
                "creditsPaid": activity.credits_paid,
                "timestamp": activity.booked_at
            }
        }))

        activity2 = activity2.map(activity => {
            return {
                "type": "chapter_completed",
                "description": `Completed chapter ${activity.chapter_id}`,
                "creditsEarned": activity.credits_earned,
                "timestamp": activity.completed_at
            }
        })

        const activities = [...activity1, ...activity2]

        const sortedActivities = activities.sort((a, b) => {
            return b.timestamp - a.timestamp
        })

        let returnActivities

        if (sortedActivities.length > 5) returnActivities = sortedActivities.splice(5)
        else returnActivities = sortedActivities

        const [sessBookings] = await pool.query("SELECT * FROM session_bookings WHERE user_id = ?", [user[0].user_id])

        const sessions = await Promise.all(sessBookings.map(async activity => {
            const [sessionRow] = await pool.query("SELECT * FROM mentor_sessions WHERE id = ?", [activity.session_id])
            const [sessionBookingRow] = await pool.query("SELECT * FROM session_bookings WHERE session_id = ? AND user_id = ?", [sessionRow[0].id, user[0].user_id])

            return {
                "id": sessionBookingRow[0].id,
                "session": {
                    "id": sessionRow[0].id,
                    "mentorName": sessionRow[0].mentor_name,
                    "expertise": sessionRow[0].expertise,
                    "experienceLevel": sessionRow[0].experience_level,
                    "sessionDate": sessionRow[0].session_date,
                    "durationMinutes": sessionRow[0].duration_minutes
                },
                "status": activity.status,
                "creditsPaid": activity.credits_paid,
                "bookedAt": activity.booked_at
            }
        }))

        return res.status(200).json({
            "user": {
                "id": userRow[0].id,
                "name": userRow[0].name,
                "email": userRow[0].email,
                "creditBalance": userRow[0].credit_balance
            },
            "stats": {
                "enrolledCourses": enrolledCourses[0].enrolledCourses,
                "completedChapters": completedChapters[0].completedChapters,
                "totalCreditsEarned": totalCreditsEarned[0].totalCreditsEarned,
                "upcomingBookings": upcomingBookings[0].upcomingBookings
            },
            "recentActivity": returnActivities,
            "sessions": sessions
        })
        

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable" + err
        })
    }
})