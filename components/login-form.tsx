"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useLogin } from "@/hooks/use-login"

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: login, isPending } = useLogin()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    login(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("auth-token", data.token)
          toast({
            title: "Success",
            description: "Login successful",
          })
          router.push("/form")
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Login failed",
            variant: "destructive",
          })
        },
      },
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="supervisor@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  )
}
