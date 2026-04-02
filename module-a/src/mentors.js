import { Auth } from "./auth.js"
import { pool } from "./db.js"
import express from "express"

export const mentorsRouter = express.Router()

mentorsRouter.get("/sessions", Auth, async (req, res) =>{
    try {
        const [sessions] = await pool.query("SELECT * FROM mentor_sessions WHERE is_available = 1")

        const returnSessions = sessions.map(session => {
            return {
            "id": session.id,
            "mentorName": session.mentor_name,
            "expertise": session.expertise,
            "experienceLevel": session.experience_level,
            "sessionDate": session.session_date,
            "durationMinutes": session.duration_minutes,
            "creditCost": session.credit_cost,
            "isAvailable": true
            }
        })

        return res.status(200).json({"sessions": returnSessions})

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})

mentorsRouter.post("/sessions/:id/book", Auth, async (req, res) =>{
    try {
        const { id } = req.params

        const token = req.headers["x-api-token"]

        const [user] = await pool.query("SELECT * FROM api_tokens WHERE token = ?", [token])

        const [userRow] = await pool.query("SELECT * FROM users WHERE id = ?", [user[0].user_id])

        const [sessions] = await pool.query("SELECT * FROM mentor_sessions WHERE is_available = 1 AND id = ?", [id])

        if (sessions.length == 0) return res.status(409).json({
            "message": "Session not available"
        })

        if (userRow[0].credit_balance < sessions[0].credit_cost) return res.status(403).json({
            "message": "Insufficient credits"
        })

        await pool.query("UPDATE users SET credit_balance = ? WHERE id = ?", [userRow[0].credit_balance - sessions[0].credit_cost, user[0].user_id])
        const date = new Date()
        const [insert] = await pool.query("INSERT INTO session_bookings (user_id, session_id, status, credits_paid, booked_at) VALUES (?,?,?,?,?)", [user[0].user_id, id, "pending", sessions[0].credit_cost, date])

        return res.status(200).json({
            "message": "Session booked successfully",
            "booking": {
                "id": insert.insertId,
                "sessionId": id,
                "status": "pending",
                "creditsPaid": sessions[0].credit_cost,
                "bookedAt": date
            }
        })

    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
})