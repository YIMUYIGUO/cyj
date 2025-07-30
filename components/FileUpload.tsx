"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, Check, AlertTriangle } from "lucide-react"

interface FileUploadProps {
  value?: string
  onChange: (url: string, fileName: string, fileSize: string) => void
  label?: string
  accept?: string
  maxSize?: number // MB
  allowedTypes?: string[]
}

export default function FileUpload({
  value = "",
  onChange,
  label = "文件",
  accept = "*/*",
  maxSize = 50,
  allowedTypes = [],
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    size: string
    url: string
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): boolean => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`)
      return false
    }

    // 检查文件类型
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()
      const isValidType = allowedTypes.some((type) =>
        type.startsWith(".") ? type.slice(1) === fileExtension : file.type.includes(type),
      )

      if (!isValidType) {
        setError(`只支持以下文件类型: ${allowedTypes.join(", ")}`)
        return false
      }
    }

    return true
  }

  const handleFileSelect = async (file: File) => {
    if (!validateFile(file)) return

    setError("")
    setUploading(true)
    setUploadProgress(0)

    try {
      // 模拟文件上传过程
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // 模拟上传延迟
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(uploadInterval)
      setUploadProgress(100)

      // 在实际应用中，这里应该上传到服务器
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const { url } = await response.json()

      // 模拟上传结果
      const mockUrl = `/uploads/${file.name}`
      const fileSize = formatFileSize(file.size)

      setUploadedFile({
        name: file.name,
        size: fileSize,
        url: mockUrl,
      })

      onChange(mockUrl, file.name, fileSize)
    } catch (err) {
      setError("上传失败，请重试")
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    onChange("", "", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* 拖拽上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploadedFile ? (
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <File className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-green-800 dark:text-green-200">{uploadedFile.name}</div>
                <div className="text-sm text-green-600 dark:text-green-400">{uploadedFile.size}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-5 w-5 text-green-600" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">拖拽文件到此处，或者</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{uploading ? "上传中..." : "选择文件"}</span>
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>支持的文件类型: {allowedTypes.length > 0 ? allowedTypes.join(", ") : "所有文件"}</p>
              <p>最大文件大小: {maxSize}MB</p>
            </div>
          </div>
        )}
      </div>

      {/* 上传进度 */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>上传进度</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* 隐藏的文件输入 */}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
