import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { version: string } }) {
  try {
    const version = params.version

    // 增加下载计数
    await query("UPDATE versions SET download_count = download_count + 1 WHERE version = ?", [version])

    // 获取版本信息
    const versionInfo = await query("SELECT download_url, file_name FROM versions WHERE version = ?", [version])

    if (versionInfo.length === 0) {
      return NextResponse.json({ error: "版本不存在" }, { status: 404 })
    }

    // 重定向到实际下载链接
    return NextResponse.redirect(versionInfo[0].download_url)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "下载失败" }, { status: 500 })
  }
}
