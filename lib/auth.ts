import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface DecodedToken {
    userId: string
    role: "admin" | "doctor" | "patient"
    iat: number
    exp: number
}

export function verifyToken(token: string): DecodedToken | null {
    try {
        return jwt.verify(token, JWT_SECRET) as DecodedToken
    } catch (error) {
        return null
    }
}

export function generateToken(userId: string, role: "admin" | "doctor" | "patient"): string {
    return jwt.sign({ userId, role}, JWT_SECRET, {expiresIn: "Id"})
}