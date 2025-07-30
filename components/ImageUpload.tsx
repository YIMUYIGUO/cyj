"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, ImageIcon, X, Copy, Check } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  accept?: string
  maxSize?: number // MB
}

export default function ImageUpload({
  value = "",
  onChange,
  label = "图片",
  placeholder = "请输入图片URL或上传图片",
  accept = "image/*",
  maxSize = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      setError(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件")
      return
    }

    setError("")
    setUploading(true)

    try {
      // 模拟上传过程
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 创建本地预览URL
      const imageUrl = URL.createObjectURL(file)
      onChange(imageUrl)

      // 在实际应用中，这里应该上传到服务器并返回真实URL
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // })
      // const { url } = await response.json()
      // onChange(url)
    } catch (err) {
      setError("上传失败，请重试")
    } finally {
      setUploading(false)
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

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) {
          handleFileSelect(file)
        }
        break
      }
    }
  }

  const copyToClipboard = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("复制失败:", err)
      }
    }
  }

  const removeImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* URL输入框 */}
      <div className="flex space-x-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onPaste={handlePaste}
          className="flex-1"
        />
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center space-x-1 bg-transparent"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "已复制" : "复制"}</span>
          </Button>
        )}
      </div>

      {/* 拖拽上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value ? (
          <div className="relative">
            <Image
              src={value || "/placeholder.svg"}
              alt="预览图片"
              width={200}
              height={150}
              className="mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={removeImage}
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <p className="text-gray-600 mb-2">拖拽图片到此处，或者</p>
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
            <p className="text-xs text-gray-500">
              支持 JPG、PNG、GIF 格式，最大 {maxSize}MB
              <br />
              也可以直接粘贴剪贴板中的图片
            </p>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileInputChange} className="hidden" />

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
