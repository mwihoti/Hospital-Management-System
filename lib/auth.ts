import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Hash a password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare a password with a hash
export const comparePassword = async (password: string, hash: string | undefined): Promise<boolean> => {
  if (!hash) {
    console.error("Password hash is undefined")
    return false
  }

  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error("Password comparison error:", error)
    return false
  }
}

// Get the current user from NextAuth session
export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}

