"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Eye, MessageCircle, Tag, Share2, Heart, ArrowLeft, ThumbsUp, Reply } from "lucide-react"
import Navbar from "@/components/navbar"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface Article {
  id: string
  title: string
  slug: string
  content: string
  featured_image: string
  author: string
  author_avatar: string
  author_bio: string
  publish_date: string
  updated_date: string
  category: string
  tags: string[]
  views: number
  comments_count: number
  likes_count: number
  meta_description: string
  meta_keywords: string
}

interface Comment {
  id: string
  article_id: string
  user_name: string
  user_avatar: string
  content: string
  created_date: string
  likes: number
  replies: Comment[]
  is_author: boolean
}

export default function ArticleDetailPageClient() {
  const params = useParams()
  const slug = params.slug as string

  // 模拟文章数据
  const [article, setArticle] = useState<Article>({
    id: "1",
    title: "API密钥管理最佳实践：如何保护您的应用程序安全",
    slug: "api-key-management-best-practices",
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

### 2.1 环境变量存储
永远不要在代码中硬编码API密钥，使用环境变量或配置文件：

\`\`\`bash
# .env 文件
API_KEY=your_secret_api_key_here
DATABASE_URL=your_database_connection_string
\`\`\`

### 2.2 密钥加密存储
在数据库中存储密钥时，应该进行加密：

\`\`\`python
import hashlib
import hmac

def hash_api_key(api_key, salt):
    return hmac.new(
        salt.encode('utf-8'),
        api_key.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
\`\`\`

## 3. 密钥轮换策略

### 3.1 定期轮换
建立定期的密钥轮换机制：
- 生产环境：每90天轮换一次
- 开发环境：每30天轮换一次
- 高风险场景：立即轮换

### 3.2 平滑过渡
实现密钥的平滑过渡，避免服务中断：

1. 生成新密钥
2. 同时支持新旧密钥
3. 通知客户端更新
4. 废弃旧密钥

## 4. 访问控制

### 4.1 最小权限原则
每个API密钥应该只拥有完成其任务所需的最小权限。

### 4.2 IP白名单
对敏感操作实施IP白名单限制：

\`\`\`javascript
const allowedIPs = ['192.168.1.100', '10.0.0.50'];

function validateIP(clientIP) {
  return allowedIPs.includes(clientIP);
}
\`\`\`

## 5. 监控和审计

### 5.1 使用日志记录
记录所有API密钥的使用情况：
- 请求时间
- 来源IP
- 请求类型
- 响应状态

### 5.2 异常检测
实施自动化的异常检测：
- 异常高频请求
- 来自未知IP的请求
- 权限外的操作尝试

## 6. 应急响应

### 6.1 密钥泄露处理
一旦发现密钥泄露：
1. 立即撤销受影响的密钥
2. 生成新的密钥
3. 分析泄露影响范围
4. 通知相关用户

### 6.2 备份和恢复
建立完善的备份和恢复机制，确保在紧急情况下能够快速恢复服务。

## 总结

API密钥管理是一个系统性工程，需要从生成、存储、使用、监控到废弃的全生命周期进行管理。通过实施这些最佳实践，可以大大提升应用程序的安全性。

> **重要提示**：安全不是一次性的工作，而是需要持续关注和改进的过程。定期审查和更新您的API密钥管理策略，确保始终跟上最新的安全威胁和防护技术。

---

**参考资料**：
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)`,
    featured_image: "/placeholder.svg?height=400&width=800&text=API密钥管理最佳实践",
    author: "技术团队",
    author_avatar: "/placeholder.svg?height=60&width=60&text=作者",
    author_bio: "专注于API安全和系统架构设计，拥有10年以上的企业级应用开发经验。",
    publish_date: "2024-01-20 10:30:00",
    updated_date: "2024-01-20 10:30:00",
    category: "技术教程",
    tags: ["API", "安全", "最佳实践", "开发"],
    views: 1250,
    comments_count: 8,
    likes_count: 45,
    meta_description: "学习API密钥管理的最佳实践，包括密钥生成、存储、轮换和监控等关键技术，提升应用程序安全性。",
    meta_keywords: "API密钥,安全管理,最佳实践,应用安全,密钥轮换",
  })

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      article_id: "1",
      user_name: "张开发者",
      user_avatar: "/placeholder.svg?height=40&width=40&text=张",
      content: "非常实用的文章！特别是密钥轮换的部分，我们公司正好需要实施这个策略。请问有没有推荐的自动化工具？",
      created_date: "2024-01-20 14:30:00",
      likes: 5,
      replies: [
        {
          id: "2",
          article_id: "1",
          user_name: "技术团队",
          user_avatar: "/placeholder.svg?height=40&width=40&text=技",
          content: "推荐使用HashiCorp Vault或者AWS Secrets Manager，这些工具都有很好的密钥轮换功能。",
          created_date: "2024-01-20 15:45:00",
          likes: 3,
          replies: [],
          is_author: true,
        },
      ],
      is_author: false,
    },
    {
      id: "3",
      article_id: "1",
      user_name: "李安全专家",
      user_avatar: "/placeholder.svg?height=40&width=40&text=李",
      content: "文章写得很全面，但是建议增加一些关于密钥泄露检测的内容，比如如何监控GitHub等代码仓库中的密钥泄露。",
      created_date: "2024-01-20 16:20:00",
      likes: 8,
      replies: [],
      is_author: false,
    },
  ])

  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })

  // 模拟增加浏览量
  useEffect(() => {
    setArticle((prev) => ({ ...prev, views: prev.views + 1 }))
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setArticle((prev) => ({
      ...prev,
      likes_count: isLiked ? prev.likes_count - 1 : prev.likes_count + 1,
    }))
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      article_id: article.id,
      user_name: userInfo.username,
      user_avatar: "/placeholder.svg?height=40&width=40&text=用户",
      content: newComment,
      created_date: new Date().toLocaleString("zh-CN"),
      likes: 0,
      replies: [],
      is_author: false,
    }

    setComments((prev) => [...prev, comment])
    setNewComment("")
    setMessage({ type: "success", content: "评论发布成功！" })

    setTimeout(() => setMessage({ type: "", content: "" }), 3000)
  }

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: Date.now().toString(),
      article_id: article.id,
      user_name: userInfo.username,
      user_avatar: "/placeholder.svg?height=40&width=40&text=用户",
      content: replyContent,
      created_date: new Date().toLocaleString("zh-CN"),
      likes: 0,
      replies: [],
      is_author: false,
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setReplyContent("")
    setReplyTo(null)
    setMessage({ type: "success", content: "回复发布成功！" })

    setTimeout(() => setMessage({ type: "", content: "" }), 3000)
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.meta_description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      setMessage({ type: "success", content: "链接已复制到剪贴板！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar currentPage="/articles" userInfo={userInfo} />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/articles">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>返回文章列表</span>
              </Button>
            </Link>
          </div>

          {/* Alert Messages */}
          {message.content && (
            <Alert
              className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
            >
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          )}

          {/* Article Header */}
          <article className="mb-8">
            <header className="mb-8">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <Badge variant="outline">{article.category}</Badge>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.publish_date).toLocaleDateString("zh-CN")}
                </span>
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views} 阅读
                </span>
                <span className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {comments.length} 评论
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{article.title}</h1>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Image
                    src={article.author_avatar || "/placeholder.svg"}
                    alt={article.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{article.author}</p>
                    <p className="text-sm text-gray-500">{article.author_bio}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    onClick={handleLike}
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    <span>{article.likes_count}</span>
                  </Button>
                  <Button onClick={shareArticle} variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    分享
                  </Button>
                </div>
              </div>

              <Image
                src={article.featured_image || "/placeholder.svg"}
                alt={article.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
              />
            </header>

            {/* Article Content with Markdown Support */}
            <div className="prose prose-lg max-w-none mb-8 prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-blue-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "")
                    const language = match ? match[1] : ""

                    return !inline && match ? (
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 border">
                        <code className={`language-${language}`} {...props}>
                          {String(children).replace(/\n$/, "")}
                        </code>
                      </pre>
                    ) : (
                      <code
                        className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  img: ({ src, alt, ...props }) => (
                    <Image
                      src={src || ""}
                      alt={alt || ""}
                      width={800}
                      height={400}
                      className="rounded-lg shadow-md my-4"
                      {...props}
                    />
                  ),
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table
                        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
                        {...props}
                      >
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, ...props }) => (
                    <th
                      className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
                      {...props}
                    >
                      {children}
                    </th>
                  ),
                  td: ({ children, ...props }) => (
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700"
                      {...props}
                    >
                      {children}
                    </td>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote
                      className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 p-4 my-4 rounded-r-lg"
                      {...props}
                    >
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children, ...props }) => (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4" {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3" {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2" {...props}>
                      {children}
                    </h3>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>
                      {children}
                    </p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props}>
                      {children}
                    </ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="ml-4" {...props}>
                      {children}
                    </li>
                  ),
                  a: ({ children, href, ...props }) => (
                    <a
                      href={href}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="font-bold text-gray-900 dark:text-gray-100" {...props}>
                      {children}
                    </strong>
                  ),
                  em: ({ children, ...props }) => (
                    <em className="italic text-gray-800 dark:text-gray-200" {...props}>
                      {children}
                    </em>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="flex items-center space-x-2 mb-8">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">标签：</span>
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </article>

          <Separator className="my-8" />

          {/* Comments Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              评论 ({comments.length})
            </h2>

            {/* Comment Form */}
            {userInfo && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <form onSubmit={handleComment}>
                    <div className="flex items-start space-x-4">
                      <Image
                        src="/placeholder.svg?height=40&width=40&text=用户"
                        alt="用户头像"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <Textarea
                          placeholder="写下您的评论..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-4"
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button type="submit" disabled={!newComment.trim()}>
                            发布评论
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-l-4 border-l-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={comment.user_avatar || "/placeholder.svg"}
                        alt={comment.user_name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">{comment.user_name}</span>
                          {comment.is_author && (
                            <Badge variant="default" className="text-xs bg-blue-600">
                              作者
                            </Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_date).toLocaleString("zh-CN")}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-blue-600"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            回复
                          </Button>
                        </div>

                        {/* Reply Form */}
                        {replyTo === comment.id && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200">
                            <div className="flex items-start space-x-3">
                              <Image
                                src="/placeholder.svg?height=32&width=32&text=用户"
                                alt="用户头像"
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div className="flex-1">
                                <Textarea
                                  placeholder={`回复 ${comment.user_name}...`}
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  className="mb-2"
                                  rows={2}
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleReply(comment.id)}
                                    disabled={!replyContent.trim()}
                                  >
                                    发布回复
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setReplyTo(null)
                                      setReplyContent("")
                                    }}
                                  >
                                    取消
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Image
                                  src={reply.user_avatar || "/placeholder.svg"}
                                  alt={reply.user_name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm text-gray-900">{reply.user_name}</span>
                                    {reply.is_author && (
                                      <Badge variant="default" className="text-xs bg-blue-600">
                                        作者
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.created_date).toLocaleString("zh-CN")}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{reply.content}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-gray-500 hover:text-blue-600"
                                  >
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    {reply.likes}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
