import { pool } from "./db.js"

export async function Auth(req, res, next){
    try {
        const token = req.headers["x-api-token"]

        if (!token || token == "") return res.status(401).json({
            "message": "Invalid token"
        })

        const [userWithToken] = await pool.query("SELECT * FROM api_tokens WHERE revoked_at IS NULL AND token = ?", [token])

        if (userWithToken.length > 0)  
            next() 
        else return res.status(401).json({
            "message": "Invalid token"
        })
    } catch (err) {
        return res.status(503).json({
            "message": "Service Unavailable"
        })
    }
}