"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SetupWizardForm from "@/components/setup-wizard-form"
import { Loader2 } from "lucide-react"

export default function SetupPage() {
  const [isSetupComplete, setIsSetupComplete] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const response = await fetch("/api/setup/check")
        const data = await response.json()
        if (data.isSetupComplete) {
          router.push("/auth/login") // 如果已完成设置，重定向到登录页
        } else {
          setIsSetupComplete(false) // 未完成设置，显示向导
        }
      } catch (error) {
        console.error("Failed to check setup status:", error)
        setIsSetupComplete(false) // 发生错误，也显示向导，让用户尝试设置
      }
    }

    checkSetupStatus()
  }, [router])

  if (isSetupComplete === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    )
  }

  if (isSetupComplete === false) {
    return <SetupWizardForm />
  }

  return null // 理论上不会到达这里，因为会重定向
}
