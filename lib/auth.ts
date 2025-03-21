import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

// Define the token payload interface
interface TokenPayload {
  userId: string
  email: string
  role: string
}

// Generate a JWT token
export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }

  return jwt.sign(payload, secret, { expiresIn: "1d" })
}

// Verify a JWT token
export const verifyJwtToken = async (token: string): Promise<TokenPayload> => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not defined")
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err)
      }

      resolve(decoded as TokenPayload)
    })
  })
}

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10)
}

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

// Get the current user from the token in cookies
export const getCurrentUser = async (): Promise<TokenPayload | null> => {
  const cookieStore = cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    return null
  }

  try {
    return await verifyJwtToken(token)
  } catch (error) {
    return null
  }
}

// Set the token in cookies
export const setTokenCookie = (token: string): void => {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
}

// Remove the token from cookies
export const removeTokenCookie = (): void => {
  cookies().delete("token")
}

