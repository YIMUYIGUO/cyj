import type { Metadata } from "next"
import ArticleDetailPageClient from "./ArticleDetailPageClient"

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // 这里应该根据slug从数据库获取文章信息
  // 现在先用模拟数据
  const article = {
    title: "API密钥管理最佳实践：如何保护您的应用程序安全",
    meta_description: "学习API密钥管理的最佳实践，包括密钥生成、存储、轮换和监控等关键技术，提升应用程序安全性。",
    meta_keywords: "API密钥,安全管理,最佳实践,应用安全,密钥轮换",
    featured_image: "/placeholder.svg?height=400&width=800&text=API密钥管理最佳实践",
    author: "技术团队",
    publish_date: "2024-01-20 10:30:00",
    updated_date: "2024-01-20 10:30:00",
    category: "技术教程",
    tags: ["API", "安全", "最佳实践", "开发"],
  }

  return {
    title: `${article.title} - 穿云箭GH`,
    description: article.meta_description,
    keywords: article.meta_keywords,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.meta_description,
      type: "article",
      url: `https://chuanyunjian.xyz/articles/${params.slug}`,
      images: [article.featured_image],
      publishedTime: article.publish_date,
      modifiedTime: article.updated_date,
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
      images: [article.featured_image],
    },
    alternates: {
      canonical: `https://chuanyunjian.xyz/articles/${params.slug}`,
    },
  }
}

export default function ArticleDetailPage() {
  return <ArticleDetailPageClient />
}
