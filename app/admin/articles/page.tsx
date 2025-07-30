"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Search,
  FileText,
  Save,
  X,
  Tag,
  Settings,
  ImageIcon,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Image from "next/image"
import ImageUpload from "@/components/ImageUpload"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author: string
  publish_date: string
  updated_date: string
  category: string
  tags: string[]
  views: number
  comments_count: number
  status: "draft" | "published" | "archived"
  meta_description: string
  meta_keywords: string
}

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "1",
      title: "API密钥管理最佳实践：如何保护您的应用程序安全",
      slug: "api-key-management-best-practices",
      excerpt: "在现代应用开发中，API密钥管理是确保应用安全的关键环节。本文将详细介绍API密钥管理的最佳实践。",
      content: `# API密钥管理最佳实践

在现代应用开发中，API密钥管理是确保应用安全的关键环节。随着微服务架构的普及和第三方服务集成的增加，开发者需要管理越来越多的API密钥。

## 1. 密钥生成原则

### 1.1 使用强随机性
API密钥应该使用加密安全的随机数生成器生成，确保足够的熵值。推荐使用至少128位的随机性。

\`\`\`javascript
// 示例：生成安全的API密钥
const crypto = require('crypto');

function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}
\`\`\`

### 1.2 密钥格式设计
- 使用易于识别的前缀（如 \`ak_\`）
- 包含版本信息便于后续升级
- 使用校验位防止输入错误

## 2. 密钥存储安全

![API密钥存储架构图](/placeholder.svg?height=300&width=500&text=API密钥存储架构)

### 2.1 环境变量存储
永远不要在代码中硬编码API密钥，使用环境变量或配置文件。

> **重要提示**：定期审查和更新您的API密钥管理策略，确保始终跟上最新的安全威胁和防护技术。`,
      featured_image: "/placeholder.svg?height=200&width=300&text=API安全",
      author: "技术团队",
      publish_date: "2024-01-20 10:30:00",
      updated_date: "2024-01-20 10:30:00",
      category: "技术教程",
      tags: ["API", "安全", "最佳实践"],
      views: 1250,
      comments_count: 8,
      status: "published",
      meta_description: "学习API密钥管理的最佳实践，提升应用程序安全性。",
      meta_keywords: "API密钥,安全管理,最佳实践",
    },
    {
      id: "2",
      title: "设备授权系统设计：基于MAC地址的访问控制",
      slug: "device-authorization-mac-based-access-control",
      excerpt: "设备授权是物联网和企业应用中的重要安全机制。本文探讨如何设计基于MAC地址的设备授权系统。",
      content: `# 设备授权系统设计

设备授权是物联网和企业应用中的重要安全机制...

## 系统架构

\`\`\`mermaid
graph TD
    A[设备] --> B[MAC验证]
    B --> C{是否授权}
    C -->|是| D[允许访问]
    C -->|否| E[拒绝访问]
\`\`\`

## 实现方案

### 1. MAC地址收集
- 自动检测设备MAC地址
- 手动输入MAC地址
- 批量导入MAC地址

### 2. 授权管理
- 实时授权/撤销
- 批量操作
- 权限分级`,
      featured_image: "/placeholder.svg?height=200&width=300&text=设备授权",
      author: "安全专家",
      publish_date: "2024-01-18 14:20:00",
      updated_date: "2024-01-18 14:20:00",
      category: "安全技术",
      tags: ["设备授权", "MAC地址", "访问控制"],
      views: 890,
      comments_count: 5,
      status: "published",
      meta_description: "深入了解基于MAC地址的设备授权系统设计原理。",
      meta_keywords: "设备授权,MAC地址,访问控制",
    },
  ])

  const [categories] = useState<Category[]>([
    { id: "1", name: "技术教程", slug: "tutorials", color: "#3B82F6" },
    { id: "2", name: "安全技术", slug: "security", color: "#EF4444" },
    { id: "3", name: "架构设计", slug: "architecture", color: "#10B981" },
    { id: "4", name: "产品更新", slug: "updates", color: "#F59E0B" },
  ])

  const [userInfo] = useState({
    username: "admin",
    email: "admin@example.com",
  })

  const [showEditor, setShowEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [message, setMessage] = useState({ type: "", content: "" })
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category: "",
    tags: "",
    status: "draft" as "draft" | "published" | "archived",
    meta_description: "",
    meta_keywords: "",
  })

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && { slug: generateSlug(value) }),
    }))
  }

  const insertImageToContent = (imageUrl: string) => {
    const imageMarkdown = `\n![图片描述](${imageUrl})\n`
    setFormData((prev) => ({
      ...prev,
      content: prev.content + imageMarkdown,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const currentDate = new Date().toLocaleString("zh-CN")
    const articleData: Article = {
      id: editingArticle?.id || Date.now().toString(),
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featured_image: formData.featured_image || "/placeholder.svg?height=200&width=300&text=默认图片",
      author: userInfo.username,
      publish_date: editingArticle?.publish_date || currentDate,
      updated_date: currentDate,
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      views: editingArticle?.views || 0,
      comments_count: editingArticle?.comments_count || 0,
      status: formData.status,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords,
    }

    if (editingArticle) {
      setArticles((prev) => prev.map((article) => (article.id === editingArticle.id ? articleData : article)))
      setMessage({ type: "success", content: "文章更新成功！" })
    } else {
      setArticles((prev) => [...prev, articleData])
      setMessage({ type: "success", content: "文章创建成功！" })
    }

    resetForm()
    setTimeout(() => setMessage({ type: "", content: "" }), 3000)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      category: "",
      tags: "",
      status: "draft",
      meta_description: "",
      meta_keywords: "",
    })
    setEditingArticle(null)
    setShowEditor(false)
    setPreviewMode(false)
  }

  const handleEdit = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featured_image,
      category: article.category,
      tags: article.tags.join(", "),
      status: article.status,
      meta_description: article.meta_description,
      meta_keywords: article.meta_keywords,
    })
    setShowEditor(true)
  }

  const handleDelete = (articleId: string) => {
    if (confirm("确定要删除这篇文章吗？")) {
      setArticles((prev) => prev.filter((article) => article.id !== articleId))
      setMessage({ type: "success", content: "文章删除成功！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-600">已发布</Badge>
      case "draft":
        return <Badge variant="secondary">草稿</Badge>
      case "archived":
        return <Badge variant="outline">已归档</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar currentPage="/admin" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
            <p className="text-gray-600 mt-1">管理和发布技术文章</p>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="bg-purple-600 hover:bg-purple-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>新建文章</span>
          </Button>
        </div>

        {/* Alert Messages */}
        {message.content && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
          >
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        {/* Article Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>{editingArticle ? "编辑文章" : "新建文章"}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                      <Eye className="h-4 w-4 mr-1" />
                      {previewMode ? "编辑" : "预览"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="space-y-6">
                    <div className="prose prose-lg max-w-none">
                      <h1>{formData.title || "文章标题"}</h1>
                      {formData.featured_image && (
                        <Image
                          src={formData.featured_image || "/placeholder.svg"}
                          alt={formData.title}
                          width={800}
                          height={400}
                          className="rounded-lg"
                        />
                      )}
                      <p className="text-gray-600">{formData.excerpt}</p>
                      <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">文章标题 *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="请输入文章标题"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">URL别名 *</Label>
                        <Input
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          placeholder="url-friendly-slug"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">文章摘要 *</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="请输入文章摘要，用于SEO和文章列表显示"
                        rows={3}
                        required
                      />
                    </div>

                    {/* 特色图片上传 */}
                    <div className="space-y-2">
                      <ImageUpload
                        value={formData.featured_image}
                        onChange={(url) => setFormData((prev) => ({ ...prev, featured_image: url }))}
                        label="特色图片"
                        placeholder="请输入图片URL或上传特色图片"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="content">文章内容 * (支持Markdown)</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const imageUrl = prompt("请输入图片URL:")
                              if (imageUrl) {
                                insertImageToContent(imageUrl)
                              }
                            }}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            插入图片
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="请输入文章内容（支持Markdown格式）&#10;&#10;支持的Markdown语法：&#10;# 标题&#10;## 二级标题&#10;**粗体** *斜体*&#10;- 列表项&#10;\`\`\`代码块\`\`\`&#10;![图片](URL)&#10;[链接](URL)&#10;> 引用&#10;| 表格 | 列 |"
                        rows={15}
                        required
                        className="font-mono"
                      />
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>💡 Markdown语法提示：</p>
                        <p>• 标题：# 一级标题 ## 二级标题</p>
                        <p>• 格式：**粗体** *斜体* `代码`</p>
                        <p>• 列表：- 项目 或 1. 项目</p>
                        <p>• 链接：[文字](URL) 图片：![描述](URL)</p>
                        <p>• 代码块：\`\`\`语言名 代码 \`\`\`</p>
                        <p>• 引用：&gt; 引用内容</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">文章分类 *</Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">选择分类</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tags">标签</Label>
                        <Input
                          id="tags"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="标签1, 标签2, 标签3"
                        />
                        <p className="text-xs text-gray-500">多个标签用逗号分隔</p>
                      </div>
                    </div>

                    <Separator />

                    {/* SEO Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Settings className="h-5 w-5 mr-2" />
                        SEO设置
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="meta_description">SEO描述</Label>
                        <Textarea
                          id="meta_description"
                          name="meta_description"
                          value={formData.meta_description}
                          onChange={handleInputChange}
                          placeholder="用于搜索引擎显示的文章描述（建议150-160字符）"
                          rows={2}
                        />
                        <p className="text-xs text-gray-500">当前字符数: {formData.meta_description.length}/160</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meta_keywords">SEO关键词</Label>
                        <Input
                          id="meta_keywords"
                          name="meta_keywords"
                          value={formData.meta_keywords}
                          onChange={handleInputChange}
                          placeholder="关键词1,关键词2,关键词3"
                        />
                        <p className="text-xs text-gray-500">多个关键词用逗号分隔</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="status">发布状态</Label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="draft">草稿</option>
                          <option value="published">发布</option>
                          <option value="archived">归档</option>
                        </select>
                      </div>

                      <div className="flex space-x-3">
                        <Button type="button" variant="outline" onClick={resetForm}>
                          取消
                        </Button>
                        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                          <Save className="h-4 w-4 mr-2" />
                          {editingArticle ? "更新文章" : "保存文章"}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索文章标题或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
            <option value="archived">已归档</option>
          </select>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">没有找到相关文章</p>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={article.featured_image || "/placeholder.svg"}
                      alt={article.title}
                      width={120}
                      height={80}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{article.title}</h3>
                        {getStatusBadge(article.status)}
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {article.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleEdit(article)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>编辑</span>
                      </Button>
                      <Button
                        onClick={() => window.open(`/articles/${article.slug}`, "_blank")}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>预览</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(article.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>删除</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {articles.filter((a) => a.status === "published").length}
              </div>
              <div className="text-sm text-gray-600">已发布</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {articles.filter((a) => a.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">草稿</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{articles.reduce((sum, a) => sum + a.views, 0)}</div>
              <div className="text-sm text-gray-600">总浏览量</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {articles.reduce((sum, a) => sum + a.comments_count, 0)}
              </div>
              <div className="text-sm text-gray-600">总评论数</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
