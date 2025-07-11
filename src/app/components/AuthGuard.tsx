'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = false // Replace with real check (e.g., localStorage, Zustand, Redux)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/') // Force redirect
    }
  }, [isAuthenticated, router])

  return isAuthenticated ? children : null
}