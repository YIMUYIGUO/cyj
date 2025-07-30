"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, Home, LogOut, User, FileText, Settings, Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavbarProps {
  currentPage?: string
  userInfo?: {
    username: string
    email: string
  }
}

export default function Navbar({ currentPage = "", userInfo }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLoggedIn = !!userInfo
  const isAdmin = userInfo?.username === "admin"

  const navigationItems = [
    { name: "首页", href: "/", icon: Home, show: true },
    { name: "下载", href: "/download", icon: Download, show: true },
    { name: "文章", href: "/articles", icon: FileText, show: true },
    { name: "控制台", href: "/console", icon: Settings, show: isLoggedIn },
  ]

  const logout = () => {
    // 这里应该调用后端注销API
    window.location.href = "/"
  }

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">穿云箭GH</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems
              .filter((item) => item.show)
              .map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.href ||
                    (
                      item.href === "/console" &&
                        (currentPage === "/dashboard" || currentPage === "/projects" || currentPage === "/admin")
                    )
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              ))}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info & Actions */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{userInfo.username}</span>
                  {isAdmin && (
                    <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                      管理员
                    </span>
                  )}
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>注销</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-border">
                <Button variant="outline" onClick={() => (window.location.href = "/auth")}>
                  登录
                </Button>
                <Button onClick={() => (window.location.href = "/auth")} className="bg-blue-600 hover:bg-blue-700">
                  注册
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navigationItems
                .filter((item) => item.show)
                .map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.href ||
                      (
                        item.href === "/console" &&
                          (currentPage === "/dashboard" || currentPage === "/projects" || currentPage === "/admin")
                      )
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                ))}

              {isLoggedIn ? (
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span>{userInfo.username}</span>
                    {isAdmin && (
                      <span className="text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded">
                        管理员
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center space-x-2 bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>注销</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border mt-4">
                  <Button variant="outline" onClick={() => (window.location.href = "/auth")}>
                    登录
                  </Button>
                  <Button onClick={() => (window.location.href = "/auth")} className="bg-blue-600 hover:bg-blue-700">
                    注册
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
