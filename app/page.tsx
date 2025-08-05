"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

type ViewMode = "welcome" | "selection" | "login"
type UserType = "admin" | "staff" | null

export default function LoginPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("welcome")
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // Store user type in session for reference
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          type: selectedUserType,
          user: email,
          loginTime: new Date().toISOString(),
        }),
      )
      // Both admin and staff go to the same dashboard
      router.push("/dashboard")
    }, 1500)
  }

  const handleLoginButtonClick = () => {
    setViewMode("selection")
  }

  const handleUserTypeSelection = (userType: UserType) => {
    setSelectedUserType(userType)
    setViewMode("login")
  }

  const handleBackToWelcome = () => {
    setViewMode("welcome")
    setSelectedUserType(null)
    setEmail("")
    setPassword("")
    setShowPassword(false)
  }

  const handleBackToSelection = () => {
    setViewMode("selection")
    setSelectedUserType(null)
    setEmail("")
    setPassword("")
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen relative">
      {viewMode === "welcome" ? (
        /* Welcome Screen */
        <div className="min-h-screen relative flex items-center justify-center">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/new-login-bg.png')",
            }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Welcome Content */}
          <div className="relative z-10 w-full max-w-2xl px-6 text-center">
            <div className="space-y-12">
              {/* Spacer to position button properly */}
              <div className="h-[420px]"></div>

              {/* LOGIN Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleLoginButtonClick}
                  className="w-44 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-lg"
                >
                  LOGIN
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-16 text-center">
                <p className="text-white/90 text-sm font-medium">© 2024 EduEmpower. All rights reserved.</p>
                <p className="text-white/70 text-xs mt-1">Powered by 1Malaysia for Society</p>
              </div>
            </div>
          </div>
        </div>
      ) : viewMode === "selection" ? (
        /* Simple User Type Selection */
        <div className="min-h-screen relative flex items-center justify-center">
          {/* Same Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/new-login-bg.png')",
            }}
          >
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="relative z-10 w-full max-w-lg px-6">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                onClick={handleBackToWelcome}
                variant="ghost"
                className="text-white hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Welcome
              </Button>
            </div>

            {/* Selection Card */}
            <Card className="backdrop-blur-md bg-white/95 shadow-2xl border-0 rounded-xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Are you Admin or Staff?</CardTitle>
                <CardDescription className="text-gray-600">Please select your role to continue</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  <Button
                    onClick={() => handleUserTypeSelection("admin")}
                    className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-lg shadow-lg rounded-lg"
                  >
                    Admin
                  </Button>

                  <Button
                    onClick={() => handleUserTypeSelection("staff")}
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-lg shadow-lg rounded-lg"
                  >
                    Staff
                  </Button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">Both will access the same dashboard</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Login Form Screen */
        <div className="min-h-screen relative flex items-center justify-center">
          {/* Same Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/new-login-bg.png')",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 w-full max-w-md px-6">
            {/* Back Button */}
            <div className="mb-6">
              <Button
                onClick={handleBackToSelection}
                variant="ghost"
                className="text-white hover:bg-white/20 p-3 rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Selection
              </Button>
            </div>

            {/* Login Form Card */}
            <Card className="backdrop-blur-md bg-white/95 shadow-2xl border-0 rounded-xl">
              <CardHeader className="space-y-1 text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in as {selectedUserType === "admin" ? "Admin" : "Staff"}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email or Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="text"
                        placeholder="Enter your email or username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Forgot password?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </div>
                    ) : (
                      "LOGIN"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                      Contact Administrator
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer for login form */}
            <div className="mt-8 text-center">
              <p className="text-white/90 text-sm font-medium">© 2024 EduEmpower. All rights reserved.</p>
              <p className="text-white/70 text-xs mt-1">Powered by 1Malaysia for Society</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
