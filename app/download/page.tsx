"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Calendar,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers,
  Zap,
  Shield,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"

interface Version {
  id: string
  version: string
  release_date: string
  download_url: string
  file_size: string
  file_name: string
  is_latest: boolean
  is_stable: boolean
  changelog: string
  new_features: string[]
  bug_fixes: string[]
  improvements: string[]
  requirements: {
    grasshopper: string
    rhino: string
    dotnet: string
  }
  download_count: number
}

export default function DownloadPage() {
  const [versions] = useState<Version[]>([
    {
      id: "1",
      version: "v2.1.0",
      release_date: "2024-01-25 10:30:00",
      download_url: "/downloads/chuanyunjian-gh-v2.1.0.gha",
      file_size: "2.5 MB",
      file_name: "ChuanYunJian-GH-v2.1.0.gha",
      is_latest: true,
      is_stable: true,
      changelog: `## 新增功能
- 新增幕墙面板优化算法
- 增加结构计算模块
- 支持批量设备授权管理

## 功能改进
- 优化电池控制逻辑，提升稳定性
- 改进用户界面，操作更加直观
- 增强API密钥安全性

## 问题修复
- 修复在某些情况下插件崩溃的问题
- 解决MAC地址验证偶发失败的bug
- 修复幕墙计算精度问题`,
      new_features: ["幕墙面板优化算法", "结构计算模块", "批量设备授权管理", "新增项目模板功能"],
      bug_fixes: [
        "修复插件在特定条件下崩溃的问题",
        "解决MAC地址验证失败的bug",
        "修复幕墙计算精度问题",
        "解决内存泄漏问题",
      ],
      improvements: ["优化电池控制逻辑", "改进用户界面设计", "增强API密钥安全性", "提升整体性能30%"],
      requirements: {
        grasshopper: "1.0.0007+",
        rhino: "7.0+",
        dotnet: ".NET Framework 4.8+",
      },
      download_count: 1250,
    },
    {
      id: "2",
      version: "v2.0.5",
      release_date: "2024-01-15 14:20:00",
      download_url: "/downloads/chuanyunjian-gh-v2.0.5.gha",
      file_size: "2.3 MB",
      file_name: "ChuanYunJian-GH-v2.0.5.gha",
      is_latest: false,
      is_stable: true,
      changelog: `## 功能改进
- 优化幕墙设计工具性能
- 改进设备授权流程
- 增强错误提示信息

## 问题修复
- 修复API调用超时问题
- 解决部分计算结果不准确的问题`,
      new_features: ["增强错误提示系统", "新增使用统计功能"],
      bug_fixes: ["修复API调用超时问题", "解决计算结果不准确的问题", "修复界面显示异常"],
      improvements: ["优化幕墙设计工具性能", "改进设备授权流程", "提升用户体验"],
      requirements: {
        grasshopper: "1.0.0007+",
        rhino: "7.0+",
        dotnet: ".NET Framework 4.8+",
      },
      download_count: 890,
    },
    {
      id: "3",
      version: "v2.0.0",
      release_date: "2024-01-01 09:00:00",
      download_url: "/downloads/chuanyunjian-gh-v2.0.0.gha",
      file_size: "2.1 MB",
      file_name: "ChuanYunJian-GH-v2.0.0.gha",
      is_latest: false,
      is_stable: true,
      changelog: `## 重大更新
- 全新的插件架构
- 重新设计的用户界面
- 增强的安全性和稳定性

## 新增功能
- 电池控制系统
- 设备授权管理
- 基础幕墙工具集`,
      new_features: ["全新插件架构", "电池控制系统", "设备授权管理", "基础幕墙工具集"],
      bug_fixes: ["修复所有已知问题", "重构核心代码"],
      improvements: ["全新用户界面", "增强安全性", "提升稳定性"],
      requirements: {
        grasshopper: "1.0.0007+",
        rhino: "7.0+",
        dotnet: ".NET Framework 4.8+",
      },
      download_count: 2100,
    },
  ])

  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const latestVersion = versions.find((v) => v.is_latest)
  const totalDownloads = versions.reduce((sum, v) => sum + v.download_count, 0)

  const handleDownload = (version: Version) => {
    // 这里应该调用下载API，记录下载统计
    console.log(`下载版本: ${version.version}`)

    // 模拟下载
    const link = document.createElement("a")
    link.href = version.download_url
    link.download = version.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar currentPage="/download" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">插件下载</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            下载最新版本的穿云箭GH插件，获取最新功能和性能改进
          </p>
        </div>

        {/* Download Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{latestVersion?.version}</div>
              <div className="text-sm text-muted-foreground">最新版本</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalDownloads.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">总下载量</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{versions.length}</div>
              <div className="text-sm text-muted-foreground">历史版本</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">稳定性</div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Version Highlight */}
        {latestVersion && (
          <Card className="mb-12 border-2 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <span>穿云箭GH {latestVersion.version}</span>
                      <Badge className="bg-green-600 hover:bg-green-600">最新版本</Badge>
                      {latestVersion.is_stable && (
                        <Badge variant="outline" className="border-blue-600 text-blue-600">
                          稳定版
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      发布时间: {new Date(latestVersion.release_date).toLocaleDateString("zh-CN")} | 文件大小:{" "}
                      {latestVersion.file_size} | 下载次数: {latestVersion.download_count.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDownload(latestVersion)}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>立即下载</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* System Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  系统要求
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Rhino {latestVersion.requirements.rhino}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Grasshopper {latestVersion.requirements.grasshopper}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{latestVersion.requirements.dotnet}</span>
                  </div>
                </div>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    新增功能
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {latestVersion.new_features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <Zap className="h-4 w-4 text-blue-600 mr-2" />
                    功能改进
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {latestVersion.improvements.slice(0, 3).map((improvement, index) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                    问题修复
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {latestVersion.bug_fixes.slice(0, 3).map((fix, index) => (
                      <li key={index}>• {fix}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installation Guide */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              安装指南
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">下载插件文件</h4>
                  <p className="text-muted-foreground text-sm">点击上方下载按钮，获取最新版本的.gha文件</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">复制到插件目录</h4>
                  <p className="text-muted-foreground text-sm">将.gha文件复制到Grasshopper插件文件夹中</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    %APPDATA%\Grasshopper\Libraries\
                  </code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">重启Grasshopper</h4>
                  <p className="text-muted-foreground text-sm">重新启动Grasshopper，插件将自动加载</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">激活插件</h4>
                  <p className="text-muted-foreground text-sm">使用您的账号登录激活插件，开始使用穿云箭GH的强大功能</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">注意事项</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                    <li>• 请确保您的Rhino和Grasshopper版本符合系统要求</li>
                    <li>• 首次使用需要联网激活，请确保网络连接正常</li>
                    <li>
                      • 如遇到安装问题，请查看
                      <Link href="/articles" className="underline">
                        技术文档
                      </Link>
                      或联系技术支持
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              版本历史
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {versions.map((version, index) => (
                <div key={version.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{version.version}</h3>
                        {version.is_latest && <Badge className="bg-green-600 hover:bg-green-600">最新</Badge>}
                        {version.is_stable && (
                          <Badge variant="outline" className="border-blue-600 text-blue-600">
                            稳定版
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(version.release_date).toLocaleDateString("zh-CN")}
                        </span>
                        <span>文件大小: {version.file_size}</span>
                        <span>下载: {version.download_count.toLocaleString()}次</span>
                      </div>

                      {/* Changelog Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {version.new_features.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-green-600 mb-1">新增功能</h4>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {version.new_features.slice(0, 2).map((feature, idx) => (
                                <li key={idx}>• {feature}</li>
                              ))}
                              {version.new_features.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.new_features.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {version.improvements.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-blue-600 mb-1">功能改进</h4>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {version.improvements.slice(0, 2).map((improvement, idx) => (
                                <li key={idx}>• {improvement}</li>
                              ))}
                              {version.improvements.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.improvements.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {version.bug_fixes.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-orange-600 mb-1">问题修复</h4>
                            <ul className="text-xs text-muted-foreground space-y-0.5">
                              {version.bug_fixes.slice(0, 2).map((fix, idx) => (
                                <li key={idx}>• {fix}</li>
                              ))}
                              {version.bug_fixes.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.bug_fixes.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        onClick={() => handleDownload(version)}
                        variant={version.is_latest ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>下载</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2"
                        onClick={() => {
                          // 显示完整更新日志
                          alert(version.changelog)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        <span>详情</span>
                      </Button>
                    </div>
                  </div>

                  {index < versions.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Links */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">需要帮助？</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/articles" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>查看文档</span>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth" className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>获取支持</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
