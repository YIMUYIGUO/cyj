import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const projects = await query(
      `
      SELECT 
        p.*,
        COUNT(d.id) as device_count
      FROM projects p
      LEFT JOIN devices d ON p.id = d.project_id AND d.is_active = true
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY p.creation_date DESC
    `,
      [user.userId],
    )

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "获取项目失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { project_name, remark } = await request.json()

    if (!project_name) {
      return NextResponse.json({ error: "项目名称不能为空" }, { status: 400 })
    }

    // 检查项目名称是否已存在
    const existingProject = await query("SELECT id FROM projects WHERE user_id = ? AND project_name = ?", [
      user.userId,
      project_name,
    ])

    if (existingProject.length > 0) {
      return NextResponse.json({ error: "项目名称已存在，请选择其他名称" }, { status: 409 })
    }

    // 生成项目序列号
    const generateSerial = () => {
      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      let result = ""
      for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return result
    }

    const projectSerial = generateSerial()

    const result = await query(
      "INSERT INTO projects (user_id, project_name, project_serial, remark) VALUES (?, ?, ?, ?)",
      [user.userId, project_name, projectSerial, remark || ""],
    )

    return NextResponse.json({
      success: true,
      message: "项目创建成功",
      project: {
        id: result.insertId,
        project_name,
        project_serial: projectSerial,
        creation_date: new Date().toISOString(),
        remark: remark || "",
        device_count: 0,
      },
    })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "创建项目失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("id")

    if (!projectId) {
      return NextResponse.json({ error: "缺少项目ID" }, { status: 400 })
    }

    await query("DELETE FROM projects WHERE id = ? AND user_id = ?", [projectId, user.userId])

    return NextResponse.json({
      success: true,
      message: "项目删除成功",
    })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "删除项目失败" }, { status: 500 })
  }
}
