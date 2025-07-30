"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, CheckCircle, ArrowRight, Star, Zap, Globe, Layers, Calculator, Wrench } from "lucide-react"
import Navbar from "@/components/navbar"
import { redirect } from "next/navigation"
import { queryOne } from "@/lib/db"

export default async function HomePage() {
  let isSetupComplete = false
  try {
    // 检查是否存在任何管理员用户
    const adminUser = await queryOne<{ id: number }>("SELECT id FROM users WHERE is_admin = TRUE LIMIT 1")
    if (adminUser) {
      isSetupComplete = true
    }
  } catch (error) {
    console.error("Error checking setup status on home page:", error)
    // 如果数据库连接失败或表不存在，视为未完成设置，引导用户进行设置
    isSetupComplete = false
  }

  if (!isSetupComplete) {
    redirect("/setup")
  } else {
    // 如果设置已完成，重定向到登录页面
    redirect("/auth/login")
  }

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "电池控制管理",
      description: "解决Grasshopper电池外发不受控制的问题，通过API密钥和设备授权确保插件的合理使用",
    },
    {
      icon: <Layers className="h-8 w-8 text-green-600" />,
      title: "幕墙设计工具",
      description: "专为幕墙工作者开发的实用工具集，包含幕墙设计、计算、优化等常用功能模块",
    },
    {
      icon: <Calculator className="h-8 w-8 text-purple-600" />,
      title: "工程计算",
      description: "集成幕墙工程中常用的计算功能，提高设计效率，减少重复性工作",
    },
    {
      icon: <Wrench className="h-8 w-8 text-orange-600" />,
      title: "持续更新",
      description: "根据幕墙工作者的实际需求持续添加新功能，欢迎提出改进建议",
    },
  ]

  const stats = [
    { number: "1,000+", label: "活跃用户" },
    { number: "50+", label: "功能模块" },
    { number: "99.9%", label: "系统稳定性" },
    { number: "24/7", label: "在线支持" },
  ]

  const testimonials = [
    {
      name: "张幕墙设计师",
      role: "幕墙设计师",
      content: "穿云箭GH大大提高了我的工作效率，特别是幕墙计算模块，非常实用！",
      rating: 5,
    },
    {
      name: "李工程师",
      role: "结构工程师",
      content: "插件的电池控制功能很好地解决了我们团队协作中的授权问题。",
      rating: 5,
    },
    {
      name: "王项目经理",
      role: "项目经理",
      content: "功能丰富，界面友好，是幕墙工作者必备的Grasshopper插件。",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage="/" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-100">
                  <Zap className="h-3 w-3 mr-1" />
                  专业 · 实用 · 开源
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    穿云箭GH
                  </span>
                  <br />
                  幕墙工作者的
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                    Grasshopper插件
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  专为幕墙工作者开发的Grasshopper插件，最初为解决电池外发控制问题而生，现已发展为包含幕墙设计、工程计算、项目管理等多功能的综合工具集。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                  onClick={() => (window.location.href = "/auth")}
                >
                  开始使用
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 bg-transparent"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  了解功能
                </Button>
              </div>

              {/* Test Account Info */}
              <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Key className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">体验账号</h3>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <p>
                          <strong>用户名:</strong> testuser
                        </p>
                        <p>
                          <strong>密码:</strong> test123456
                        </p>
                        <p className="text-xs">* 体验插件管理功能，了解授权机制</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Layers className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Grasshopper插件生态</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">为幕墙设计提供全方位支持</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-semibold text-blue-600">电池控制</div>
                      <div className="text-gray-500">授权管理</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-semibold text-green-600">幕墙工具</div>
                      <div className="text-gray-500">设计计算</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-semibold text-purple-600">工程计算</div>
                      <div className="text-gray-500">效率提升</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="font-semibold text-orange-600">持续更新</div>
                      <div className="text-gray-500">功能扩展</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse dark:opacity-20"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse dark:opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">核心功能模块</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              从电池控制到幕墙设计，为幕墙工作者提供全方位的Grasshopper插件解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-muted rounded-lg">{feature.icon}</div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">为什么选择穿云箭GH？</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">专业定制</h3>
                    <p className="text-blue-100">专为幕墙工作者设计，深度理解行业需求和工作流程</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">持续进化</h3>
                    <p className="text-blue-100">根据用户反馈持续更新功能，欢迎提出改进建议</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">开放生态</h3>
                    <p className="text-blue-100">开放的插件架构，支持功能扩展和定制开发</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white/10 rounded-lg p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Layers className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">幕墙工作者的选择</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 p-4 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold">行业专精</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold">功能丰富</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold">易于使用</div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-400 mb-2" />
                      <div className="font-semibold">持续更新</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">用户评价</h2>
            <p className="text-xl text-muted-foreground">来自幕墙行业用户的真实反馈</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">加入我们的社区</h2>
          <p className="text-xl text-muted-foreground mb-8">
            与其他幕墙工作者交流经验，分享使用心得，提出功能建议，共同推动插件发展
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => (window.location.href = "/auth")}
            >
              立即体验
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 bg-transparent"
              onClick={() => (window.location.href = "/articles")}
            >
              查看文档
            </Button>
          </div>

          {/* Feature Request */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-bold text-foreground mb-3">💡 功能建议</h3>
            <p className="text-muted-foreground mb-4">
              作为幕墙工作者，您在使用Grasshopper时遇到了哪些痛点？希望穿云箭GH增加什么功能？
            </p>
            <p className="text-sm text-muted-foreground">
              欢迎通过技术文章评论区或联系我们提出您的宝贵建议，让我们一起完善这个插件！
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">穿云箭GH</span>
              </div>
              <p className="text-muted-foreground mb-4">
                专为幕墙工作者开发的Grasshopper插件，从电池控制到幕墙设计的全方位解决方案。
              </p>
              <div className="flex space-x-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">www.chuanyunjian.xyz</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">插件功能</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    电池控制
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    幕墙工具
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    工程计算
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">支持与帮助</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/articles" className="hover:text-foreground transition-colors">
                    使用文档
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    功能建议
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    技术支持
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 穿云箭GH - 一个幕墙工作者的Grasshopper插件. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
