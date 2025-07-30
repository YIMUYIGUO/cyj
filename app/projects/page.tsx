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
import { FolderPlus, Folder, Settings, Trash2, Calendar, Hash } from "lucide-react"
import Navbar from "@/components/navbar"

interface Project {
  id: string
  project_name: string
  project_serial: string
  creation_date: string
  remark: string
  deviceCount: number
}

export default function ProjectManagement() {
  // 模拟从原始数据库结构获取的数据
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      project_name: "测试项目1",
      project_serial: "abc123def456ghi7",
      creation_date: "2024-01-15 10:30:00",
      remark: "这是一个测试项目",
      deviceCount: 3,
    },
    {
      id: "2",
      project_name: "生产环境",
      project_serial: "xyz789uvw012rst3",
      creation_date: "2024-01-10 14:20:00",
      remark: "生产环境项目",
      deviceCount: 1,
    },
  ])

  const [userInfo] = useState({
    username: "testuser",
    email: "test@example.com",
  })

  const [newProject, setNewProject] = useState({
    project_name: "",
    remark: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", content: "" })

  const generateRandomString = (length: number) => {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (projects.some((p) => p.project_name === newProject.project_name)) {
      setMessage({ type: "error", content: "项目名称已存在，请选择其他名称。" })
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

      const project: Project = {
        id: Date.now().toString(),
        project_name: newProject.project_name,
        project_serial: generateRandomString(16), // 与原始PHP逻辑一致
        creation_date: currentDate,
        remark: newProject.remark,
        deviceCount: 0,
      }

      setProjects((prev) => [...prev, project])
      setNewProject({ project_name: "", remark: "" })
      setMessage({ type: "success", content: "项目创建成功！" })
      setIsLoading(false)
    }, 1000)
  }

  const deleteProject = (projectId: string) => {
    if (confirm("您确定要删除这个项目吗？")) {
      // 这里应该调用原始PHP删除API: ?delete_project=${projectId}
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      setMessage({ type: "success", content: "项目已成功删除！" })
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Navbar currentPage="/projects" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">项目管理</h1>
          <p className="text-gray-600 mt-1">管理您的项目和设备授权</p>
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
          {/* Create Project Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderPlus className="h-5 w-5" />
                  <span>创建新项目</span>
                </CardTitle>
                <CardDescription>创建一个新的项目来管理设备</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={createProject} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectName">项目名称</Label>
                    <Input
                      id="projectName"
                      placeholder="请输入项目名称"
                      value={newProject.project_name}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, project_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="remark">备注</Label>
                    <Input
                      id="remark"
                      placeholder="请输入备注信息"
                      value={newProject.remark}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, remark: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "创建中..." : "创建项目"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Folder className="h-5 w-5" />
                  <span>我的项目</span>
                </CardTitle>
                <CardDescription>管理您的所有项目</CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>没有项目，请创建新项目！</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div key={project.id}>
                        <div className="p-6 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{project.project_name}</h3>
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                  <Settings className="h-3 w-3" />
                                  <span>{project.deviceCount} 设备</span>
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-2">
                                  <Hash className="h-4 w-4" />
                                  <span>序列号: {project.project_serial}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>创建时间: {project.creation_date}</span>
                                </div>
                              </div>

                              {project.remark && (
                                <div className="text-sm text-gray-600 mb-3">
                                  <strong>备注:</strong> {project.remark}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => (window.location.href = `/projects/${project.id}/devices`)}
                              variant="default"
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              管理设备
                            </Button>
                            <Button onClick={() => deleteProject(project.id)} variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              删除项目
                            </Button>
                          </div>
                        </div>
                        {index < projects.length - 1 && <Separator className="my-4" />}
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
