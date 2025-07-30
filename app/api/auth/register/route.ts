import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query, queryOne } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, verificationCode } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "所有字段都是必填的" }, { status: 400 })
    }

    // 检查用户名是否已存在
    const existingUser = await queryOne("SELECT id FROM users WHERE username = ? OR email = ?", [username, email])

    if (existingUser) {
      return NextResponse.json({ error: "用户名或邮箱已存在" }, { status: 409 })
    }

    // 加密密码
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // 插入新用户
    await query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [username, email, passwordHash])

    return NextResponse.json({
      success: true,
      message: "注册成功",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 })
  }
}
