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
import { Smartphone, Plus, Trash2, Calendar, ArrowLeft, Wifi, Shield } from "lucide-react"
import Navbar from "@/components/navbar"

interface Device {
  id: string
  device_mac: string
  authorization_date: string
  remark: string
}

export default function DeviceManagement() {
  // 模拟从原始数据库结构获取的数据
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      device_mac: "00:1B:44:11:3A:B7",
      authorization_date: "2024-01-15 10:30:00",
      remark: "测试设备1",
    },
    {
      id: "2",
      device_mac: "00:1B:44:11:3A:B8",
      authorization_date: "2024-01-16 14:20:00",
      remark: "生产设备",
    },
  ])

  const [projectName] = useState("测试项目1")
  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const [newDevice, setNewDevice] = useState({
    device_mac: "",
    remark: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })

  const validateMacAddress = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    return macRegex.test(mac)
  }

  const addDevice = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateMacAddress(newDevice.device_mac)) {
      setMessage({ type: "error", content: "MAC地址格式不正确，请使用格式：00:1B:44:11:3A:B7" })
      return
    }

    if (devices.some((d) => d.device_mac === newDevice.device_mac)) {
      setMessage({ type: "error", content: "设备MAC地址已存在。" })
      return
    }

    setIsLoading(true)

    // 模拟调用原始PHP API
    setTimeout(() => {
      const currentDate = new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })

      const device: Device = {
        id: Date.now().toString(),
        device_mac: newDevice.device_mac.toUpperCase(),
        authorization_date: currentDate,
        remark: newDevice.remark,
      }

      setDevices((prev) => [...prev, device])
      setNewDevice({ device_mac: "", remark: "" })
      setMessage({ type: "success", content: "设备已成功授权！" })
      setIsLoading(false)
    }, 1000)
  }

  const deleteDevice = (deviceId: string) => {
    if (confirm("您确定要删除这个设备吗？")) {
      // 这里应该调用原始PHP删除API: ?project_id=${projectId}&delete_device=${deviceId}
      setDevices((prev) => prev.filter((d) => d.id !== deviceId))
      setMessage({ type: "success", content: "设备已成功删除！" })
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
      <Navbar currentPage="/projects" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button onClick={() => (window.location.href = "/projects")} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回项目
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">管理设备</h1>
              <p className="text-gray-600 mt-1">项目: {projectName}</p>
            </div>
          </div>
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
          {/* Add Device Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>添加新设备</span>
                </CardTitle>
                <CardDescription>通过MAC地址授权新设备</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={addDevice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceMac">设备MAC地址</Label>
                    <div className="relative">
                      <Wifi className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="deviceMac"
                        placeholder="00:1B:44:11:3A:B7"
                        value={newDevice.device_mac}
                        onChange={(e) => setNewDevice((prev) => ({ ...prev, device_mac: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">格式：XX:XX:XX:XX:XX:XX</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remark">备注</Label>
                    <Input
                      id="remark"
                      placeholder="请输入设备备注"
                      value={newDevice.remark}
                      onChange={(e) => setNewDevice((prev) => ({ ...prev, remark: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? "添加中..." : "添加设备"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Devices List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>已授权设备</span>
                </CardTitle>
                <CardDescription>管理项目中的所有授权设备</CardDescription>
              </CardHeader>
              <CardContent>
                {devices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>没有已授权设备。</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {devices.map((device, index) => (
                      <div key={device.id}>
                        <div className="flex items-start justify-between p-4 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="h-5 w-5 text-blue-600" />
                              <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                {device.device_mac}
                              </span>
                              <Badge variant="default" className="bg-green-600">
                                已授权
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>授权时间: {device.authorization_date}</span>
                            </div>

                            {device.remark && (
                              <div className="text-sm text-gray-600">
                                <strong>备注:</strong> {device.remark}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => deleteDevice(device.id)}
                            variant="destructive"
                            size="sm"
                            className="ml-4"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {index < devices.length - 1 && <Separator className="my-2" />}
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
