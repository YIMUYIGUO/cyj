"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function SetupWizardForm() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/setup/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "设置成功",
          description: "管理员账户已创建。",
        })
        setStep(3) // Move to success step
      } else {
        setError(data.message || "Failed to create admin user.")
        toast({
          title: "设置失败",
          description: data.message || "创建管理员账户失败。",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Setup error:", err)
      setError("An unexpected error occurred.")
      toast({
        title: "错误",
        description: "发生未知错误。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">欢迎使用 穿云箭GH</CardTitle>
              <CardDescription>这是您第一次运行本程序。请按照以下步骤完成初始设置。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>我们将引导您创建一个管理员账户，这是管理本平台所必需的。</p>
              <Button onClick={() => setStep(2)} className="w-full">
                开始设置
              </Button>
            </CardContent>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">创建管理员账户</CardTitle>
              <CardDescription>请填写以下信息以创建您的管理员账户。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">确认密码</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    "创建管理员"
                  )}
                </Button>
              </form>
            </CardContent>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">设置完成！</CardTitle>
              <CardDescription>恭喜您，管理员账户已成功创建。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>您现在可以登录并开始使用 穿云箭GH 平台了。</p>
              <Button onClick={() => router.push("/auth/login")} className="w-full">
                前往登录页面
              </Button>
            </CardContent>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">{renderStep()}</Card>
    </div>
  )
}
