import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface User {
  userId: number
  username: string
  email: string
  isAdmin: boolean
}

export async function verifyToken(request: NextRequest): Promise<User | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    }
  } catch (error) {
    return null
  }
}
