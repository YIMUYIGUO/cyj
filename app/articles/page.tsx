import type { Metadata } from "next"
import ArticlesClientPage from "./ArticlesClientPage"

export const metadata: Metadata = {
  title: "技术文章 - 穿云箭GH | API管理与安全技术分享",
  description: "穿云箭GH技术博客，分享API管理、安全技术、架构设计等专业技术文章，帮助开发者提升技术能力。",
  keywords: "API管理,技术博客,安全技术,架构设计,开发教程,穿云箭GH",
  openGraph: {
    title: "技术文章 - 穿云箭GH",
    description: "专业的技术文章分享平台，涵盖API管理、安全技术、架构设计等领域",
    type: "website",
    url: "https://chuanyunjian.xyz/articles",
  },
  alternates: {
    canonical: "https://chuanyunjian.xyz/articles",
  },
}

export default function ArticlesPage() {
  return <ArticlesClientPage />
}
