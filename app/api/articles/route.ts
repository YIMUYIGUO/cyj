import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "published"

    const offset = (page - 1) * limit

    let whereClause = "WHERE a.status = ?"
    const params: any[] = [status]

    if (category) {
      whereClause += " AND c.slug = ?"
      params.push(category)
    }

    if (search) {
      whereClause += " AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)"
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    const articles = await query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color,
        GROUP_CONCAT(at.tag_name) as tags
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      ${whereClause}
      GROUP BY a.id
      ORDER BY a.publish_date DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset],
    )

    // 处理标签
    const processedArticles = articles.map((article) => ({
      ...article,
      tags: article.tags ? article.tags.split(",") : [],
    }))

    // 获取总数
    const totalResult = await query(
      `
      SELECT COUNT(DISTINCT a.id) as total
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `,
      params,
    )

    const total = totalResult[0].total

    return NextResponse.json({
      articles: processedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get articles error:", error)
    return NextResponse.json({ error: "获取文章失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      author,
      category_id,
      tags,
      status,
      meta_description,
      meta_keywords,
    } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "标题、URL别名和内容不能为空" }, { status: 400 })
    }

    // 检查slug是否已存在
    const existingArticle = await query("SELECT id FROM articles WHERE slug = ?", [slug])

    if (existingArticle.length > 0) {
      return NextResponse.json({ error: "URL别名已存在" }, { status: 409 })
    }

    // 插入文章
    const result = await query(
      `
      INSERT INTO articles (
        title, slug, excerpt, content, featured_image, author,
        category_id, status, meta_description, meta_keywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [title, slug, excerpt, content, featured_image, author, category_id, status, meta_description, meta_keywords],
    )

    const articleId = result.insertId

    // 插入标签
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await query("INSERT INTO article_tags (article_id, tag_name) VALUES (?, ?)", [articleId, tag.trim()])
      }
    }

    return NextResponse.json({
      success: true,
      message: "文章创建成功",
      articleId,
    })
  } catch (error) {
    console.error("Create article error:", error)
    return NextResponse.json({ error: "创建文章失败" }, { status: 500 })
  }
}
