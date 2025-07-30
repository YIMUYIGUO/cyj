import { NextResponse } from "next/server"
import { queryOne } from "@/lib/db"

export async function GET() {
  try {
    // 检查是否存在任何管理员用户
    const adminUser = await queryOne<{ id: number }>("SELECT id FROM users WHERE is_admin = TRUE LIMIT 1")

    if (adminUser) {
      return NextResponse.json({ isSetupComplete: true })
    } else {
      return NextResponse.json({ isSetupComplete: false })
    }
  } catch (error) {
    console.error("Error checking setup status:", error)
    // 如果数据库连接失败或表不存在，也视为未完成设置
    return NextResponse.json({ isSetupComplete: false, error: "Database check failed" }, { status: 500 })
  }
}
