"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Key, Plus, Trash2, Calendar, Clock, User, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import Navbar from "@/components/navbar"

interface ApiKey {
  id: string
  api_key: string
  api_key_creation: string
  api_key_expiration: string
  note: string
  isExpired: boolean
}

export default function Dashboard() {
  // 模拟从原始数据库结构获取的数据
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      api_key: "abcDE12345",
      api_key_creation: "2024-01-15 10:30:00",
      api_key_expiration: "2024-02-15 10:30:00",
      note: "测试密钥",
      isExpired: false,
    },
    {
      id: "2",
      api_key: "key已过期",
      api_key_creation: "2024-01-01 09:00:00",
      api_key_expiration: "2024-01-08 09:00:00",
      note: "过期密钥",
      isExpired: true,
    },
  ])

  // 模拟用户信息（从原始users表获取）
  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const [newKey, setNewKey] = useState({
    expiration: "",
    note: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })

  const generateApiKey = async (e: React.FormEvent) => {
    e.preventDefault()

    if (apiKeys.filter((key) => !key.isExpired).length >= 3) {
      setMessage({ type: "error", content: "最多能创建3个密钥，请删除无用密钥后创建新密钥！" })
      return
    }

    setIsLoading(true)

    // 模拟调用原始PHP API
    setTimeout(() => {
      // 生成10位随机字符串（5个字母+5个数字，与原始PHP逻辑一致）
      const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const numbers = "0123456789"
      let randomString = ""

      // 生成5个随机字母
      for (let i = 0; i < 5; i++) {
        randomString += letters[Math.floor(Math.random() * letters.length)]
      }
      // 生成5个随机数字
      for (let i = 0; i < 5; i++) {
        randomString += numbers[Math.floor(Math.random() * numbers.length)]
      }
      // 随机排序
      const shuffled = randomString
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("")

      const currentDate = new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      const expirationDate =
        newKey.expiration ||
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })

      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        api_key: shuffled,
        api_key_creation: currentDate,
        api_key_expiration: expirationDate,
        note: newKey.note,
        isExpired: false,
      }

      setApiKeys((prev) => [...prev, newApiKey])
      setNewKey({ expiration: "", note: "" })
      setMessage({ type: "success", content: "API Key generated successfully!" })
      setIsLoading(false)
    }, 1000)
  }

  const deleteApiKey = (keyId: string, apiKey: string, creationDate: string) => {
    if (confirm("确定删除这个密钥吗？")) {
      // 这里应该调用原始PHP删除API: ?delete_key=${apiKey}&delete_creation=${creationDate}
      setApiKeys((prev) => prev.filter((key) => key.id !== keyId))
      setMessage({ type: "success", content: "密钥已被成功删除！" })
    }
  }

  useEffect(() => {
    if (message.content) {
      const timer = setTimeout(() => {
        setMessage({ type: "", content: "" })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar currentPage="/dashboard" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">控制中心</h1>
          <p className="text-gray-600 mt-1">管理您的API密钥</p>
        </div>

        {/* Alert Messages */}
        {message.content && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-800"}`}
          >
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>用户信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">用户名:</span>
                  <span className="font-medium">{userInfo.username}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium">{userInfo.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Create New Key */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>创建密钥</span>
                </CardTitle>
                <CardDescription>最多可创建3个有效密钥</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={generateApiKey} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiration">设置到期时间(可选)</Label>
                    <Input
                      id="expiration"
                      type="date"
                      value={newKey.expiration}
                      onChange={(e) => setNewKey((prev) => ({ ...prev, expiration: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <p className="text-xs text-gray-500">不设置则默认7天后过期</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note">备注</Label>
                    <Input
                      id="note"
                      placeholder="请输入备注信息"
                      value={newKey.note}
                      onChange={(e) => setNewKey((prev) => ({ ...prev, note: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "创建中..." : "创建密钥"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* API Keys List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>密钥列表</span>
                </CardTitle>
                <CardDescription>管理您的所有API密钥</CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>没有密钥，请创建！</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey, index) => (
                      <div key={apiKey.id}>
                        <div className="flex items-start justify-between p-4 rounded-lg border bg-gray-50/50">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                {apiKey.api_key}
                              </span>
                              {apiKey.isExpired || apiKey.api_key === "key已过期" ? (
                                <Badge variant="destructive" className="flex items-center space-x-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>已过期</span>
                                </Badge>
                              ) : (
                                <Badge variant="default" className="flex items-center space-x-1 bg-green-600">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>有效</span>
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>创建时间: {apiKey.api_key_creation}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>到期时间: {apiKey.api_key_expiration}</span>
                              </div>
                            </div>

                            {apiKey.note && (
                              <div className="text-sm text-gray-600">
                                <strong>备注:</strong> {apiKey.note}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => deleteApiKey(apiKey.id, apiKey.api_key, apiKey.api_key_creation)}
                            variant="destructive"
                            size="sm"
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {index < apiKeys.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
