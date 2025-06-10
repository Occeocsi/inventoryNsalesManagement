"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "staff"
  avatar?: string
}

// Mock user data
export const MOCK_USERS: User[] = [
  {
    id: "staff-1",
    email: "staff@example.com",
    name: "Admin Staff",
    role: "staff",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "staff-2",
    email: "manager@example.com",
    name: "Store Manager",
    role: "staff",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "customer-1",
    email: "customer@example.com",
    name: "John Customer",
    role: "customer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "customer-2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "customer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for saved user on initial load
  useEffect(() => {
    if (!isClient) return

    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error loading saved user:", error)
      localStorage.removeItem("user")
    }
    setIsLoading(false)
  }, [isClient])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Find user by email (in a real app, we'd validate password too)
      const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (foundUser) {
        setUser(foundUser)
        if (isClient) {
          localStorage.setItem("user", JSON.stringify(foundUser))
        }
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    if (isClient) {
      localStorage.removeItem("user")
    }
  }

  // Don't render children until we've checked for saved user
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
