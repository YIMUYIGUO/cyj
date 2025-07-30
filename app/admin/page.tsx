"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Tag,
  Package,
  Users,
  Download,
  Eye,
  MessageCircle,
  TrendingUp,
  Settings,
  BarChart3,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react"
import Navbar from "@/components/navbar"

export default function AdminPage() {
  const [userInfo] = useState({
    username: "admin",
    email: "admin@example.com",
  })

  // 模拟统计数据
  const stats = {
    articles: {
      total: 15,
      published: 12,
      draft: 3,
      views: 25600,
      comments: 89,
    },
    categories: {
      total: 8,
      active: 6,
      empty: 2,
    },
    versions: {
      total: 5,
      stable: 4,
      downloads: 4250,
      latest: "v2.1.0",
    },
    users: {
      total: 1250,
      active: 890,
      new_this_month: 156,
    },
  }

  const recentActivities = [
    {
      type: "article",
      message: "发布了新文章《API密钥管理最佳实践》",
      time: "2小时前",
      icon: <FileText className="h-4 w-4 text-blue-600" />,
    },
    {
      type: "version",
      message: "发布了新版本 v2.1.0",
      time: "1天前",
      icon: <Package className="h-4 w-4 text-green-600" />,
    },
    {
      type: "category",
      message: "创建了新分类「幕墙设计」",
      time: "3天前",
      icon: <Tag className="h-4 w-4 text-purple-600" />,
    },
    {
      type: "user",
      message: "新用户注册数量达到156人",
      time: "1周前",
      icon: <Users className="h-4 w-4 text-orange-600" />,
    },
  ]

  const managementSections = [
    {
      title: "文章管理",
      description: "管理技术文章的发布、编辑和分类",
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      href: "/admin/articles",
      stats: [
        { label: "总文章", value: stats.articles.total, color: "text-blue-600" },
        { label: "已发布", value: stats.articles.published, color: "text-green-600" },
        { label: "草稿", value: stats.articles.draft, color: "text-yellow-600" },
      ],
      metrics: {
        views: stats.articles.views,
        comments: stats.articles.comments,
      },
    },
    {
      title: "分类管理",
      description: "管理文章分类和标签系统",
      icon: <Tag className="h-8 w-8 text-purple-600" />,
      href: "/admin/categories",
      stats: [
        { label: "总分类", value: stats.categories.total, color: "text-purple-600" },
        { label: "有文章", value: stats.categories.active, color: "text-green-600" },
        { label: "空分类", value: stats.categories.empty, color: "text-gray-600" },
      ],
    },
    {
      title: "版本管理",
      description: "管理插件版本发布和下载统计",
      icon: <Package className="h-8 w-8 text-green-600" />,
      href: "/admin/versions",
      stats: [
        { label: "版本数", value: stats.versions.total, color: "text-green-600" },
        { label: "稳定版", value: stats.versions.stable, color: "text-blue-600" },
        { label: "下载量", value: stats.versions.downloads, color: "text-orange-600" },
      ],
      latest: stats.versions.latest,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar currentPage="/admin" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">管理后台</h1>
          <p className="text-muted-foreground">欢迎回来，{userInfo.username}！管理您的内容、版本和用户数据</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总文章数</p>
                  <p className="text-2xl font-bold text-foreground">{stats.articles.total}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />+{stats.articles.published} 已发布
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">插件版本</p>
                  <p className="text-2xl font-bold text-foreground">{stats.versions.total}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Package className="h-3 w-3 mr-1" />
                    最新 {stats.versions.latest}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总下载量</p>
                  <p className="text-2xl font-bold text-foreground">{stats.versions.downloads.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Download className="h-3 w-3 mr-1" />
                    本月 +{stats.users.new_this_month}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">活跃用户</p>
                  <p className="text-2xl font-bold text-foreground">{stats.users.active}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    总计 {stats.users.total}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Management Sections */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">内容管理</h2>

            <div className="space-y-6">
              {managementSections.map((section, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-muted rounded-lg">{section.icon}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
                          <p className="text-muted-foreground text-sm">{section.description}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => (window.location.href = section.href)}
                        className="flex items-center space-x-2"
                      >
                        <span>管理</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {section.stats.map((stat, statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Metrics */}
                    {section.metrics && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{section.metrics.views.toLocaleString()} 浏览</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{section.metrics.comments} 评论</span>
                        </div>
                      </div>
                    )}

                    {section.latest && (
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                        <span>最新版本: {section.latest}</span>
                        <Badge variant="outline" className="text-xs">
                          稳定版
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Settings className="h-5 w-5 mr-2" />
                    快捷操作
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => (window.location.href = "/admin/articles")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      发布新文章
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => (window.location.href = "/admin/versions")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      发布新版本
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => (window.location.href = "/admin/categories")}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      管理分类
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 mr-2" />
                    最近活动
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-1 bg-muted rounded">{activity.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2" />
                    系统状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">网站服务</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">数据库</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">文件存储</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">下载服务</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    性能指标
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>服务器负载</span>
                        <span>23%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>内存使用</span>
                        <span>67%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>存储空间</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
