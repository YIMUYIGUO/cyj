"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Eye, MessageCircle, Tag, TrendingUp, Clock } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author: string
  author_avatar: string
  publish_date: string
  updated_date: string
  category: string
  tags: string[]
  views: number
  comments_count: number
  is_featured: boolean
  meta_description: string
  meta_keywords: string
}

interface Category {
  id: string
  name: string
  slug: string
  count: number
}

export default function ArticlesClientPage() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "1",
      title: "API密钥管理最佳实践：如何保护您的应用程序安全",
      slug: "api-key-management-best-practices",
      excerpt:
        "在现代应用开发中，API密钥管理是确保应用安全的关键环节。本文将详细介绍API密钥管理的最佳实践，帮助开发者构建更安全的应用程序。",
      content: "",
      featured_image: "/placeholder.svg?height=400&width=600&text=API安全管理",
      author: "技术团队",
      author_avatar: "/placeholder.svg?height=40&width=40&text=作者",
      publish_date: "2024-01-20 10:30:00",
      updated_date: "2024-01-20 10:30:00",
      category: "技术教程",
      tags: ["API", "安全", "最佳实践", "开发"],
      views: 1250,
      comments_count: 8,
      is_featured: true,
      meta_description: "学习API密钥管理的最佳实践，包括密钥生成、存储、轮换和监控等关键技术，提升应用程序安全性。",
      meta_keywords: "API密钥,安全管理,最佳实践,应用安全,密钥轮换",
    },
    {
      id: "2",
      title: "设备授权系统设计：基于MAC地址的访问控制",
      slug: "device-authorization-mac-based-access-control",
      excerpt:
        "设备授权是物联网和企业应用中的重要安全机制。本文探讨如何设计基于MAC地址的设备授权系统，实现精确的访问控制。",
      content: "",
      featured_image: "/placeholder.svg?height=400&width=600&text=设备授权系统",
      author: "安全专家",
      author_avatar: "/placeholder.svg?height=40&width=40&text=专家",
      publish_date: "2024-01-18 14:20:00",
      updated_date: "2024-01-18 14:20:00",
      category: "安全技术",
      tags: ["设备授权", "MAC地址", "访问控制", "物联网"],
      views: 890,
      comments_count: 5,
      is_featured: false,
      meta_description: "深入了解基于MAC地址的设备授权系统设计原理，包括授权流程、安全考虑和实现方案。",
      meta_keywords: "设备授权,MAC地址,访问控制,物联网安全,授权系统",
    },
    {
      id: "3",
      title: "现代Web应用安全架构设计指南",
      slug: "modern-web-application-security-architecture",
      excerpt: "随着Web应用复杂性的增加，安全架构设计变得越来越重要。本文提供了现代Web应用安全架构的完整设计指南。",
      content: "",
      featured_image: "/placeholder.svg?height=400&width=600&text=Web安全架构",
      author: "架构师",
      author_avatar: "/placeholder.svg?height=40&width=40&text=架构",
      publish_date: "2024-01-15 09:15:00",
      updated_date: "2024-01-15 09:15:00",
      category: "架构设计",
      tags: ["Web安全", "架构设计", "安全防护", "系统设计"],
      views: 2100,
      comments_count: 12,
      is_featured: true,
      meta_description: "全面的现代Web应用安全架构设计指南，涵盖认证授权、数据保护、网络安全等关键领域。",
      meta_keywords: "Web安全,架构设计,安全防护,认证授权,数据保护",
    },
  ])

  const [categories] = useState<Category[]>([
    { id: "1", name: "技术教程", slug: "tutorials", count: 15 },
    { id: "2", name: "安全技术", slug: "security", count: 8 },
    { id: "3", name: "架构设计", slug: "architecture", count: 6 },
    { id: "4", name: "产品更新", slug: "updates", count: 4 },
    { id: "5", name: "行业动态", slug: "industry", count: 3 },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)

  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  // 搜索和筛选逻辑
  useEffect(() => {
    let filtered = articles

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [searchTerm, selectedCategory, articles])

  const featuredArticles = articles.filter((article) => article.is_featured)
  const popularTags = ["API", "安全", "最佳实践", "设备授权", "Web安全", "架构设计"]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar currentPage="/articles" userInfo={userInfo} />

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">技术文章</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              分享API管理、安全技术、架构设计等专业知识，助力开发者成长
            </p>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
                精选文章
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredArticles.slice(0, 2).map((article) => (
                  <Card
                    key={article.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg"
                  >
                    <div className="relative">
                      <Image
                        src={article.featured_image || "/placeholder.svg"}
                        alt={article.title}
                        width={600}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-600">精选</Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {article.comments_count}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Image
                            src={article.author_avatar || "/placeholder.svg"}
                            alt={article.author}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-600">{article.author}</span>
                        </div>
                        <Badge variant="secondary">{article.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filter */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索文章标题、内容或标签..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">所有分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Articles List */}
              <div className="space-y-8">
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">没有找到相关文章</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <Image
                            src={article.featured_image || "/placeholder.svg"}
                            alt={article.title}
                            width={400}
                            height={250}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {article.views}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {article.comments_count}
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                              {article.title}
                            </Link>
                          </h2>

                          <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Image
                                src={article.author_avatar || "/placeholder.svg"}
                                alt={article.author}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{article.author}</p>
                                <p className="text-xs text-gray-500">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" disabled>
                    上一页
                  </Button>
                  <Button variant="default" className="bg-blue-600">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">下一页</Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Tag className="h-5 w-5 mr-2" />
                      文章分类
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(selectedCategory === category.name ? "" : category.name)}
                          className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                            selectedCategory === category.name ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Tag className="h-5 w-5 mr-2" />
                      热门标签
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-100 hover:border-blue-300"
                          onClick={() => setSearchTerm(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Clock className="h-5 w-5 mr-2" />
                      最新文章
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {articles.slice(0, 5).map((article) => (
                        <div key={article.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                              {article.title}
                            </Link>
                          </h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                            <span className="mx-2">•</span>
                            <Eye className="h-3 w-3 mr-1" />
                            {article.views}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
