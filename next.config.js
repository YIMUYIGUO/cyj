/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 忽略在构建期间的 ESLint 错误，这在生产环境中可能有用，但建议在开发中解决所有警告。
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 忽略在构建期间的 TypeScript 错误，这在生产环境中可能有用，但建议在开发中解决所有警告。
    ignoreBuildErrors: true,
  },
  images: {
    // 如果您不使用Next.js的图片优化服务（例如，所有图片都来自外部CDN或不需要优化），可以设置为true。
    // 这会禁用Next.js的图片优化功能，避免在构建时出现相关错误。
    unoptimized: true,
  },
  // 这里可以添加您的Next.js配置
  // 例如，如果您需要配置图片优化、国际化、或实验性功能等
  // output: 'standalone', // 如果您计划使用Docker或独立服务器部署，可以启用此项
}

module.exports = nextConfig
