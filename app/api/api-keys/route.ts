import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const apiKeys = await query(
      `
      SELECT 
        id,
        api_key,
        api_key_creation,
        api_key_expiration,
        note,
        is_expired,
        CASE 
          WHEN api_key_expiration < NOW() THEN true
          ELSE false
        END as is_expired_calculated
      FROM api_keys 
      WHERE user_id = ?
      ORDER BY api_key_creation DESC
    `,
      [user.userId],
    )

    return NextResponse.json({ apiKeys })
  } catch (error) {
    console.error("Get API keys error:", error)
    return NextResponse.json({ error: "获取API密钥失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { expiration, note } = await request.json()

    // 检查用户是否已有3个有效密钥
    const activeKeysCount = await query(
      "SELECT COUNT(*) as count FROM api_keys WHERE user_id = ? AND api_key_expiration > NOW()",
      [user.userId],
    )

    if (activeKeysCount[0].count >= 3) {
      return NextResponse.json({ error: "最多能创建3个密钥，请删除无用密钥后创建新密钥！" }, { status: 400 })
    }

    // 生成API密钥
    const generateApiKey = () => {
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const numbers = "0123456789"
      let randomString = ""

      // 生成5个随机字母
      for (let i = 0; i < 5; i++) {
        randomString += letters[Math.floor(Math.random() * letters.length)]
      }
      // 生成5个随机数字
      for (let i = 0; i < 5; i++) {
        randomString += numbers[Math.floor(Math.random() * numbers.length)]
      }

      // 随机排序
      return randomString
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")
    }

    const apiKey = generateApiKey()
    const expirationDate = expiration ? new Date(expiration) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 默认7天后过期

    await query("INSERT INTO api_keys (user_id, api_key, api_key_expiration, note) VALUES (?, ?, ?, ?)", [
      user.userId,
      apiKey,
      expirationDate,
      note || "",
    ])

    return NextResponse.json({
      success: true,
      message: "API密钥创建成功",
      apiKey: {
        api_key: apiKey,
        api_key_creation: new Date().toISOString(),
        api_key_expiration: expirationDate.toISOString(),
        note: note || "",
      },
    })
  } catch (error) {
    console.error("Create API key error:", error)
    return NextResponse.json({ error: "创建API密钥失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get("id")

    if (!keyId) {
      return NextResponse.json({ error: "缺少密钥ID" }, { status: 400 })
    }

    await query("DELETE FROM api_keys WHERE id = ? AND user_id = ?", [keyId, user.userId])

    return NextResponse.json({
      success: true,
      message: "密钥删除成功",
    })
  } catch (error) {
    console.error("Delete API key error:", error)
    return NextResponse.json({ error: "删除密钥失败" }, { status: 500 })
  }
}
