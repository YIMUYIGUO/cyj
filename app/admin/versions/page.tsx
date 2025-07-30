"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Download, Calendar, Save, X, Search, Package, Upload, Settings } from "lucide-react"
import Navbar from "@/components/navbar"
import FileUpload from "@/components/FileUpload"

interface Version {
  id: string
  version: string
  release_date: string
  download_url: string
  file_size: string
  file_name: string
  is_latest: boolean
  is_stable: boolean
  changelog: string
  new_features: string[]
  bug_fixes: string[]
  improvements: string[]
  requirements: {
    grasshopper: string
    rhino: string
    dotnet: string
  }
  download_count: number
}

export default function AdminVersionsPage() {
  const [versions, setVersions] = useState<Version[]>([
    {
      id: "1",
      version: "v2.1.0",
      release_date: "2024-01-25 10:30:00",
      download_url: "/downloads/chuanyunjian-gh-v2.1.0.gha",
      file_size: "2.5 MB",
      file_name: "ChuanYunJian-GH-v2.1.0.gha",
      is_latest: true,
      is_stable: true,
      changelog: "新增幕墙面板优化算法，增加结构计算模块，支持批量设备授权管理",
      new_features: ["幕墙面板优化算法", "结构计算模块", "批量设备授权管理"],
      bug_fixes: ["修复插件崩溃问题", "解决MAC地址验证失败", "修复计算精度问题"],
      improvements: ["优化电池控制逻辑", "改进用户界面", "增强API密钥安全性"],
      requirements: {
        grasshopper: "1.0.0007+",
        rhino: "7.0+",
        dotnet: ".NET Framework 4.8+",
      },
      download_count: 1250,
    },
    {
      id: "2",
      version: "v2.0.5",
      release_date: "2024-01-15 14:20:00",
      download_url: "/downloads/chuanyunjian-gh-v2.0.5.gha",
      file_size: "2.3 MB",
      file_name: "ChuanYunJian-GH-v2.0.5.gha",
      is_latest: false,
      is_stable: true,
      changelog: "优化幕墙设计工具性能，改进设备授权流程",
      new_features: ["增强错误提示系统"],
      bug_fixes: ["修复API调用超时问题", "解决计算结果不准确"],
      improvements: ["优化性能", "改进用户体验"],
      requirements: {
        grasshopper: "1.0.0007+",
        rhino: "7.0+",
        dotnet: ".NET Framework 4.8+",
      },
      download_count: 890,
    },
  ])

  const [userInfo] = useState({
    username: "admin",
    email: "admin@example.com",
  })

  const [showEditor, setShowEditor] = useState(false)
  const [editingVersion, setEditingVersion] = useState<Version | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState({ type: "", content: "" })

  const [formData, setFormData] = useState({
    version: "",
    release_date: "",
    download_url: "",
    file_size: "",
    file_name: "",
    is_latest: false,
    is_stable: true,
    changelog: "",
    new_features: "",
    bug_fixes: "",
    improvements: "",
    grasshopper_version: "1.0.0007+",
    rhino_version: "7.0+",
    dotnet_version: ".NET Framework 4.8+",
  })

  const filteredVersions = versions.filter(
    (version) =>
      version.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.changelog.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileUpload = (url: string, fileName: string, fileSize: string) => {
    setFormData((prev) => ({
      ...prev,
      download_url: url,
      file_name: fileName,
      file_size: fileSize,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const currentDate = new Date().toLocaleString("zh-CN")
    const versionData: Version = {
      id: editingVersion?.id || Date.now().toString(),
      version: formData.version,
      release_date: formData.release_date || currentDate,
      download_url: formData.download_url,
      file_size: formData.file_size,
      file_name: formData.file_name,
      is_latest: formData.is_latest,
      is_stable: formData.is_stable,
      changelog: formData.changelog,
      new_features: formData.new_features.split("\n").filter((f) => f.trim()),
      bug_fixes: formData.bug_fixes.split("\n").filter((f) => f.trim()),
      improvements: formData.improvements.split("\n").filter((f) => f.trim()),
      requirements: {
        grasshopper: formData.grasshopper_version,
        rhino: formData.rhino_version,
        dotnet: formData.dotnet_version,
      },
      download_count: editingVersion?.download_count || 0,
    }

    // 如果设置为最新版本，取消其他版本的最新标记
    if (formData.is_latest) {
      setVersions((prev) => prev.map((v) => ({ ...v, is_latest: false })))
    }

    if (editingVersion) {
      setVersions((prev) => prev.map((v) => (v.id === editingVersion.id ? versionData : v)))
      setMessage({ type: "success", content: "版本更新成功！" })
    } else {
      setVersions((prev) => [versionData, ...prev])
      setMessage({ type: "success", content: "版本创建成功！" })
    }

    resetForm()
    setTimeout(() => setMessage({ type: "", content: "" }), 3000)
  }

  const resetForm = () => {
    setFormData({
      version: "",
      release_date: "",
      download_url: "",
      file_size: "",
      file_name: "",
      is_latest: false,
      is_stable: true,
      changelog: "",
      new_features: "",
      bug_fixes: "",
      improvements: "",
      grasshopper_version: "1.0.0007+",
      rhino_version: "7.0+",
      dotnet_version: ".NET Framework 4.8+",
    })
    setEditingVersion(null)
    setShowEditor(false)
  }

  const handleEdit = (version: Version) => {
    setEditingVersion(version)
    setFormData({
      version: version.version,
      release_date: version.release_date,
      download_url: version.download_url,
      file_size: version.file_size,
      file_name: version.file_name,
      is_latest: version.is_latest,
      is_stable: version.is_stable,
      changelog: version.changelog,
      new_features: version.new_features.join("\n"),
      bug_fixes: version.bug_fixes.join("\n"),
      improvements: version.improvements.join("\n"),
      grasshopper_version: version.requirements.grasshopper,
      rhino_version: version.requirements.rhino,
      dotnet_version: version.requirements.dotnet,
    })
    setShowEditor(true)
  }

  const handleDelete = (versionId: string) => {
    if (confirm("确定要删除这个版本吗？")) {
      setVersions((prev) => prev.filter((v) => v.id !== versionId))
      setMessage({ type: "success", content: "版本删除成功！" })
      setTimeout(() => setMessage({ type: "", content: "" }), 3000)
    }
  }

  const toggleLatest = (versionId: string) => {
    setVersions((prev) =>
      prev.map((v) => ({
        ...v,
        is_latest: v.id === versionId ? !v.is_latest : false,
      })),
    )
  }

  const toggleStable = (versionId: string) => {
    setVersions((prev) => prev.map((v) => (v.id === versionId ? { ...v, is_stable: !v.is_stable } : v)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar currentPage="/admin" userInfo={userInfo} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">版本管理</h1>
            <p className="text-muted-foreground mt-1">管理插件版本发布和下载</p>
          </div>
          <Button
            onClick={() => setShowEditor(true)}
            className="bg-indigo-600 hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>发布新版本</span>
          </Button>
        </div>

        {/* Alert Messages */}
        {message.content && (
          <Alert
            className={`mb-6 ${
              message.type === "error"
                ? "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                : "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
            }`}
          >
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        {/* Version Editor Modal */}
        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>{editingVersion ? "编辑版本" : "发布新版本"}</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version">版本号 *</Label>
                      <Input
                        id="version"
                        name="version"
                        value={formData.version}
                        onChange={handleInputChange}
                        placeholder="v2.1.0"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="release_date">发布时间</Label>
                      <Input
                        id="release_date"
                        name="release_date"
                        type="datetime-local"
                        value={formData.release_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* 文件上传 */}
                  <FileUpload
                    value={formData.download_url}
                    onChange={handleFileUpload}
                    label="插件文件 *"
                    accept=".gha,.zip,.rar"
                    maxSize={100}
                    allowedTypes={[".gha", ".zip", ".rar"]}
                  />

                  {/* 版本标记 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_latest"
                        checked={formData.is_latest}
                        onCheckedChange={(checked) => handleSwitchChange("is_latest", checked)}
                      />
                      <Label htmlFor="is_latest">设为最新版本</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_stable"
                        checked={formData.is_stable}
                        onCheckedChange={(checked) => handleSwitchChange("is_stable", checked)}
                      />
                      <Label htmlFor="is_stable">稳定版本</Label>
                    </div>
                  </div>

                  {/* 系统要求 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      系统要求
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rhino_version">Rhino版本</Label>
                        <Input
                          id="rhino_version"
                          name="rhino_version"
                          value={formData.rhino_version}
                          onChange={handleInputChange}
                          placeholder="7.0+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grasshopper_version">Grasshopper版本</Label>
                        <Input
                          id="grasshopper_version"
                          name="grasshopper_version"
                          value={formData.grasshopper_version}
                          onChange={handleInputChange}
                          placeholder="1.0.0007+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dotnet_version">.NET版本</Label>
                        <Input
                          id="dotnet_version"
                          name="dotnet_version"
                          value={formData.dotnet_version}
                          onChange={handleInputChange}
                          placeholder=".NET Framework 4.8+"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 更新日志 */}
                  <div className="space-y-2">
                    <Label htmlFor="changelog">更新日志 *</Label>
                    <Textarea
                      id="changelog"
                      name="changelog"
                      value={formData.changelog}
                      onChange={handleInputChange}
                      placeholder="简要描述本次更新的主要内容..."
                      rows={3}
                      required
                    />
                  </div>

                  {/* 详细更新内容 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new_features">新增功能</Label>
                      <Textarea
                        id="new_features"
                        name="new_features"
                        value={formData.new_features}
                        onChange={handleInputChange}
                        placeholder="每行一个功能点..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="improvements">功能改进</Label>
                      <Textarea
                        id="improvements"
                        name="improvements"
                        value={formData.improvements}
                        onChange={handleInputChange}
                        placeholder="每行一个改进点..."
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bug_fixes">问题修复</Label>
                      <Textarea
                        id="bug_fixes"
                        name="bug_fixes"
                        value={formData.bug_fixes}
                        onChange={handleInputChange}
                        placeholder="每行一个修复项..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      取消
                    </Button>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingVersion ? "更新版本" : "发布版本"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索版本号或更新内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Versions List */}
        <div className="space-y-6">
          {filteredVersions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">没有找到相关版本</p>
              </CardContent>
            </Card>
          ) : (
            filteredVersions.map((version, index) => (
              <Card key={version.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{version.version}</h3>
                        {version.is_latest && <Badge className="bg-green-600 hover:bg-green-600">最新版本</Badge>}
                        {version.is_stable && (
                          <Badge variant="outline" className="border-blue-600 text-blue-600">
                            稳定版
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>发布: {new Date(version.release_date).toLocaleDateString("zh-CN")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>大小: {version.file_size}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>下载: {version.download_count.toLocaleString()}次</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{version.changelog}</p>

                      {/* 详细信息 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {version.new_features.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-600 mb-1">新增功能</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                              {version.new_features.slice(0, 2).map((feature, idx) => (
                                <li key={idx}>• {feature}</li>
                              ))}
                              {version.new_features.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.new_features.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {version.improvements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-600 mb-1">功能改进</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                              {version.improvements.slice(0, 2).map((improvement, idx) => (
                                <li key={idx}>• {improvement}</li>
                              ))}
                              {version.improvements.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.improvements.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {version.bug_fixes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-600 mb-1">问题修复</h4>
                            <ul className="text-muted-foreground space-y-0.5">
                              {version.bug_fixes.slice(0, 2).map((fix, idx) => (
                                <li key={idx}>• {fix}</li>
                              ))}
                              {version.bug_fixes.length > 2 && (
                                <li className="text-blue-600">• 还有 {version.bug_fixes.length - 2} 项...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        onClick={() => handleEdit(version)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span>编辑</span>
                      </Button>
                      <Button
                        onClick={() => toggleLatest(version.id)}
                        variant={version.is_latest ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <span>{version.is_latest ? "取消最新" : "设为最新"}</span>
                      </Button>
                      <Button
                        onClick={() => toggleStable(version.id)}
                        variant={version.is_stable ? "default" : "outline"}
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <span>{version.is_stable ? "取消稳定" : "设为稳定"}</span>
                      </Button>
                      <Button
                        onClick={() => handleDelete(version.id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>删除</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{versions.length}</div>
              <div className="text-sm text-muted-foreground">总版本数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{versions.filter((v) => v.is_stable).length}</div>
              <div className="text-sm text-muted-foreground">稳定版本</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {versions.reduce((sum, v) => sum + v.download_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">总下载量</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">1</div>
              <div className="text-sm text-muted-foreground">最新版本</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
