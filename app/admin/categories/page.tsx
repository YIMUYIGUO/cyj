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
import { Plus, Edit, Trash2, Tag, Save, X, Search, FolderOpen } from "lucide-react"
import Navbar from "@/components/navbar"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  color: string
  article_count: number
  created_date: string
  updated_date: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "技术教程",
      slug: "tutorials",
      description: "各种技术教程和开发指南",
      color: "#3B82F6",
      article_count: 15,
      created_date: "2024-01-01 10:00:00",
      updated_date: "2024-01-01 10:00:00",
    },
    {
      id: "2",
      name: "安全技术",
      slug: "security",
      description: "网络安全、应用安全相关文章",
      color: "#EF4444",
      article_count: 8,
      created_date: "2024-01-02 10:00:00",
      updated_date: "2024-01-02 10:00:00",
    },
    {
      id: "3",
      name: "架构设计",
      slug: "architecture",
      description: "系统架构设计和最佳实践",
      color: "#10B981",
      article_count: 6,
      created_date: "2024-01-03 10:00:00",
      updated_date: "2024-01-03 10:00:00",
    },
    {
      id: "4",
      name: "产品更新",
      slug: "updates",
      description: "产品功能更新和发布说明",
      color: "#F59E0B",
      article_count: 4,
      created_date: "2024-01-04 10:00:00",
      updated_date: "2024-01-04 10:00:00",
    },
  ])

  const [userInfo] = useState({
    username: "admin",
    email: "admin@example.com",
  })

  const [showEditor, setShowEditor] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState({ type: "", content: "" })

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
  })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" && { slug: generateSlug(value) }),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 检查名称和slug是否重复
    const isDuplicate = categories.some(
      (cat) => cat.id !== editingCategory?.id && (cat.name === formData.name || cat.slug === formData.slug),
    )

    if (isDuplicate) {
      setMessage({ type: "error", content: "分类名称或URL别名已存在！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
      return
    }

    const currentDate = new Date().toLocaleString("zh-CN")
    const categoryData: Category = {
      id: editingCategory?.id || Date.now().toString(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      color: formData.color,
      article_count: editingCategory?.article_count || 0,
      created_date: editingCategory?.created_date || currentDate,
      updated_date: currentDate,
    }

    if (editingCategory) {
      setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? categoryData : cat)))
      setMessage({ type: "success", content: "分类更新成功！" })
    } else {
      setCategories((prev) => [...prev, categoryData])
      setMessage({ type: "success", content: "分类创建成功！" })
    }

    resetForm()
    setTimeout(() => setMessage({ type: "", content: "" }), 3000)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
    })
    setEditingCategory(null)
    setShowEditor(false)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
    })
    setShowEditor(true)
  }

  const handleDelete = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category && category.article_count > 0) {
      setMessage({ type: "error", content: "无法删除包含文章的分类，请先移动或删除相关文章！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
      return
    }

    if (confirm("确定要删除这个分类吗？")) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
      setMessage({ type: "success", content: "分类删除成功！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
    }
  }

  const colorOptions = [
    { name: "蓝色", value: "#3B82F6" },
    { name: "红色", value: "#EF4444" },
    { name: "绿色", value: "#10B981" },
    { name: "黄色", value: "#F59E0B" },
    { name: "紫色", value: "#8B5CF6" },
    { name: "粉色", value: "#EC4899" },
    { name: "青色", value: "#06B6D4" },
    { name: "橙色", value: "#F97316" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar currentPage="/admin" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
            <p className="text-gray-600 mt-1">管理文章分类和标签</p>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>新建分类</span>
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

        {/* Category Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>{editingCategory ? "编辑分类" : "新建分类"}</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">分类名称 *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="请输入分类名称"
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
                    <Label htmlFor="description">分类描述</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="请输入分类描述"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">分类颜色</Label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                            className={`w-8 h-8 rounded-full border-2 ${
                              formData.color === color.value ? "border-gray-900" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.color }} />
                      <span className="text-sm text-gray-600">预览颜色</span>
                    </div>

                    <div className="flex space-x-3">
                      <Button type="button" variant="outline" onClick={resetForm}>
                        取消
                      </Button>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        {editingCategory ? "更新分类" : "保存分类"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索分类名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">没有找到相关分类</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {category.article_count} 篇文章
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description || "暂无描述"}</p>

                  <div className="text-xs text-gray-500 mb-4">
                    <p>URL: /{category.slug}</p>
                    <p>创建时间: {new Date(category.created_date).toLocaleDateString("zh-CN")}</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(category)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>编辑</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(category.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center space-x-1"
                        disabled={category.article_count > 0}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>删除</span>
                      </Button>
                    </div>
                    <Badge style={{ backgroundColor: category.color, color: "white" }} className="text-xs">
                      {category.name}
                    </Badge>
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
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-gray-600">总分类数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + cat.article_count, 0)}
              </div>
              <div className="text-sm text-gray-600">总文章数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {categories.filter((cat) => cat.article_count > 0).length}
              </div>
              <div className="text-sm text-gray-600">有文章的分类</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {categories.filter((cat) => cat.article_count === 0).length}
              </div>
              <div className="text-sm text-gray-600">空分类</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
