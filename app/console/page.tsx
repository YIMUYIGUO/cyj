"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Key,
  Shield,
  Settings,
  FileText,
  Tag,
  Smartphone,
  ArrowRight,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react"
import Navbar from "@/components/navbar"

export default function ConsolePage() {
  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const isAdmin = userInfo.username === "admin"

  // 模拟统计数据
  const stats = {
    apiKeys: 5,
    activeKeys: 3,
    expiredKeys: 2,
    projects: 2,
    devices: 5,
    articles: 3,
    categories: 4,
  }

  const managementSections = [
    {
      title: "API密钥管理",
      description: "管理您的API密钥，包括创建、查看、删除和监控密钥状态",
      icon: <Key className="h-8 w-8 text-blue-600" />,
      href: "/dashboard",
      stats: [
        { label: "总密钥", value: stats.apiKeys, color: "text-blue-600" },
        { label: "有效密钥", value: stats.activeKeys, color: "text-green-600" },
        { label: "已过期", value: stats.expiredKeys, color: "text-red-600" },
      ],
      features: ["密钥生成", "自动过期", "使用监控", "安全存储"],
    },
    {
      title: "设备授权管理",
      description: "基于MAC地址的设备授权管理，控制设备访问权限",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      href: "/projects",
      stats: [
        { label: "项目数", value: stats.projects, color: "text-purple-600" },
        { label: "授权设备", value: stats.devices, color: "text-green-600" },
        { label: "待审核", value: 0, color: "text-orange-600" },
      ],
      features: ["MAC验证", "批量管理", "权限控制", "实时监控"],
    },
  ]

  const adminSections = [
    {
      title: "文章管理",
      description: "管理技术文章的发布、编辑和分类",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      href: "/admin/articles",
      stats: [
        { label: "总文章", value: stats.articles, color: "text-purple-600" },
        { label: "已发布", value: 2, color: "text-green-600" },
        { label: "草稿", value: 1, color: "text-yellow-600" },
      ],
      features: ["Markdown编辑", "SEO优化", "图片上传", "评论管理"],
    },
    {
      title: "分类管理",
      description: "管理文章分类和标签系统",
      icon: <Tag className="h-8 w-8 text-orange-600" />,
      href: "/admin/categories",
      stats: [
        { label: "分类数", value: stats.categories, color: "text-orange-600" },
        { label: "有文章", value: 3, color: "text-green-600" },
        { label: "空分类", value: 1, color: "text-gray-600" },
      ],
      features: ["分类创建", "颜色标记", "URL别名", "统计分析"],
    },
  ]

  const recentActivities = [
    {
      type: "api_key",
      message: "创建了新的API密钥",
      time: "2分钟前",
      icon: <Key className="h-4 w-4 text-blue-600" />,
    },
    {
      type: "device",
      message: "授权了新设备 00:1B:44:11:3A:B7",
      time: "15分钟前",
      icon: <Smartphone className="h-4 w-4 text-green-600" />,
    },
    {
      type: "article",
      message: "发布了新文章《API安全最佳实践》",
      time: "1小时前",
      icon: <FileText className="h-4 w-4 text-purple-600" />,
    },
    {
      type: "warning",
      message: "API密钥 abc123 即将过期",
      time: "2小时前",
      icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar currentPage="/console" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">控制台</h1>
          <p className="text-muted-foreground">
            欢迎回来，{userInfo.username}！管理您的API密钥、设备授权
            {isAdmin && "和内容发布"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.apiKeys}</div>
              <div className="text-sm text-muted-foreground">API密钥</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.devices}</div>
              <div className="text-sm text-muted-foreground">授权设备</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.projects}</div>
              <div className="text-sm text-muted-foreground">项目数量</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">99.9%</div>
              <div className="text-sm text-muted-foreground">系统可用性</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Management Sections */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">管理功能</h2>

            {/* Core Management */}
            <div className="space-y-6 mb-8">
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
                        <span>进入管理</span>
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

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {section.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Admin Sections */}
            {isAdmin && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-6">内容管理</h2>
                <div className="space-y-6">
                  {adminSections.map((section, index) => (
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
                            <span>进入管理</span>
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

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {section.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
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
                      <span className="text-sm text-muted-foreground">API服务</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">数据库</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">存储服务</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">监控系统</span>
                      <Badge className="bg-green-600">正常</Badge>
                    </div>
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
                      onClick={() => (window.location.href = "/dashboard")}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      创建API密钥
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => (window.location.href = "/projects")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      授权新设备
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => (window.location.href = "/admin/articles")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          发布文章
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-transparent"
                          onClick={() => (window.location.href = "/admin/categories")}
                        >
                          <Tag className="h-4 w-4 mr-2" />
                          管理分类
                        </Button>
                      </>
                    )}
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
