"use client"

import Cookies from "js-cookie"
import { useMutation } from "@tanstack/react-query"
import { loginUser } from "@/services/auth-api"
import { useRouter } from "next/navigation"

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const token = data.token
      if (token) {
        // Save token in cookies
        Cookies.set("auth-token", token)

        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))

        router.push("/form")
      }
    },
  })
}
