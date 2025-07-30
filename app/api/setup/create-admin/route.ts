import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    // 再次检查是否已经存在管理员用户，防止重复创建
    const existingAdmin = await query<{ id: number }>("SELECT id FROM users WHERE is_admin = TRUE LIMIT 1")
    if (existingAdmin.length > 0) {
      return NextResponse.json({ message: "Admin user already exists. Setup is complete." }, { status: 409 })
    }

    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // 检查用户名或邮箱是否已被占用
    const existingUser = await query<{ id: number }>("SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1", [
      username,
      email,
    ])
    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Username or email already exists" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await query("INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)", [
      username,
      email,
      passwordHash,
      true,
    ])

    return NextResponse.json({ message: "Admin user created successfully", success: true })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      { message: "Failed to create admin user", error: (error as Error).message },
      { status: 500 },
    )
  }
}
