import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const categories = await query(`
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id
      ORDER BY c.created_date DESC
    `)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }

    const { name, slug, description, color } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "分类名称和URL别名不能为空" }, { status: 400 })
    }

    // 检查名称和slug是否已存在
    const existing = await query("SELECT id FROM categories WHERE name = ? OR slug = ?", [name, slug])

    if (existing.length > 0) {
      return NextResponse.json({ error: "分类名称或URL别名已存在" }, { status: 409 })
    }

    await query("INSERT INTO categories (name, slug, description, color) VALUES (?, ?, ?, ?)", [
      name,
      slug,
      description || "",
      color || "#3B82F6",
    ])

    return NextResponse.json({
      success: true,
      message: "分类创建成功",
    })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 })
  }
}
