"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Lock, User, Eye, EyeOff, Shield, Key, ArrowLeft } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    verificationCode: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showEncryptionModal, setShowEncryptionModal] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const sendVerificationCode = async () => {
    if (!formData.email) {
      setError("请输入邮箱地址")
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSuccess("验证码已发送")
      setVerificationSent(true)
      setCountdown(60)
      setIsLoading(false)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setVerificationSent(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check for test account
    if (isLogin && formData.username === "testuser" && formData.password === "test123456") {
      setTimeout(() => {
        setShowEncryptionModal(true)
        setIsLoading(false)
      }, 1000)
      return
    }

    // Simulate authentication
    setTimeout(() => {
      if (isLogin) {
        if (formData.username && formData.password) {
          setShowEncryptionModal(true)
        } else {
          setError("用户名或密码不正确")
        }
      } else {
        if (formData.username && formData.email && formData.password && formData.verificationCode) {
          setSuccess("注册成功！")
          setTimeout(() => setIsLogin(true), 1500)
        } else {
          setError("请填写所有必填字段")
        }
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleEncryptionChoice = (type: "key" | "mac") => {
    setShowEncryptionModal(false)
    // Redirect to appropriate dashboard
    window.location.href = type === "key" ? "/dashboard" : "/projects"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回首页</span>
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">穿云箭GH</h1>
          <p className="text-gray-600">安全的API密钥管理平台</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="login"
                  onClick={() => setIsLogin(true)}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  登录
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  onClick={() => setIsLogin(false)}
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  注册
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Test Account Info for Login */}
            {isLogin && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">测试账号</h3>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>
                          <strong>用户名:</strong> testuser
                        </p>
                        <p>
                          <strong>密码:</strong> test123456
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {isLogin ? "用户名或邮箱" : "用户名"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={isLogin ? "请输入用户名或邮箱" : "请输入用户名"}
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    邮箱
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {isLogin ? "密码" : "新密码"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-sm font-medium">
                    验证码
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      placeholder="请输入验证码"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={verificationSent || isLoading}
                      className="whitespace-nowrap bg-transparent"
                    >
                      {verificationSent ? `重新发送(${countdown})` : "发送验证码"}
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "处理中..." : isLogin ? "登录" : "注册"}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center">
                <Button variant="link" className="text-sm text-blue-600 hover:text-blue-800">
                  忘记密码？
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Encryption Method Modal */}
        {showEncryptionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">选择加密方式</CardTitle>
                <CardDescription className="text-center">请选择一种加密方式来管理您的项目</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleEncryptionChoice("key")}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-3"
                >
                  <Key className="h-6 w-6" />
                  <span className="text-lg">KEY加密</span>
                </Button>
                <Button
                  onClick={() => handleEncryptionChoice("mac")}
                  className="w-full h-16 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-3"
                >
                  <Shield className="h-6 w-6" />
                  <span className="text-lg">MAC加密</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
