import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const versions = await query(`
      SELECT 
        v.*,
        JSON_ARRAYAGG(
          CASE 
            WHEN vf.id IS NOT NULL THEN
              JSON_OBJECT(
                'type', vf.feature_type,
                'description', vf.description
              )
            ELSE NULL
          END
        ) as features
      FROM versions v
      LEFT JOIN version_features vf ON v.id = vf.version_id
      GROUP BY v.id
      ORDER BY v.release_date DESC
    `)

    // 处理功能列表
    const processedVersions = versions.map((version) => {
      const features = version.features ? JSON.parse(version.features).filter((f) => f !== null) : []

      return {
        ...version,
        new_features: features.filter((f) => f.type === "new_feature").map((f) => f.description),
        improvements: features.filter((f) => f.type === "improvement").map((f) => f.description),
        bug_fixes: features.filter((f) => f.type === "bug_fix").map((f) => f.description),
        requirements: version.requirements
          ? JSON.parse(version.requirements)
          : {
              grasshopper: "1.0.0007+",
              rhino: "7.0+",
              dotnet: ".NET Framework 4.8+",
            },
      }
    })

    return NextResponse.json({ versions: processedVersions })
  } catch (error) {
    console.error("Get versions error:", error)
    return NextResponse.json({ error: "获取版本失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }

    const {
      version,
      download_url,
      file_size,
      file_name,
      is_latest,
      is_stable,
      changelog,
      new_features,
      improvements,
      bug_fixes,
      requirements,
    } = await request.json()

    if (!version || !download_url || !file_name) {
      return NextResponse.json({ error: "版本号、下载链接和文件名不能为空" }, { status: 400 })
    }

    // 如果设置为最新版本，取消其他版本的最新标记
    if (is_latest) {
      await query("UPDATE versions SET is_latest = FALSE")
    }

    // 插入版本
    const result = await query(
      `
      INSERT INTO versions (
        version, download_url, file_size, file_name, is_latest, is_stable,
        changelog, requirements
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [version, download_url, file_size, file_name, is_latest, is_stable, changelog, JSON.stringify(requirements)],
    )

    const versionId = result.insertId

    // 插入功能特性
    const features = [
      ...(new_features || []).map((desc) => ({ type: "new_feature", description: desc })),
      ...(improvements || []).map((desc) => ({ type: "improvement", description: desc })),
      ...(bug_fixes || []).map((desc) => ({ type: "bug_fix", description: desc })),
    ]

    for (const feature of features) {
      await query("INSERT INTO version_features (version_id, feature_type, description) VALUES (?, ?, ?)", [
        versionId,
        feature.type,
        feature.description,
      ])
    }

    return NextResponse.json({
      success: true,
      message: "版本发布成功",
      versionId,
    })
  } catch (error) {
    console.error("Create version error:", error)
    return NextResponse.json({ error: "发布版本失败" }, { status: 500 })
  }
}
