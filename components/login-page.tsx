"use client"
import { useState } from "react"
import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ShoppingBag, Users } from "lucide-react"

export default function LoginPage() {
  const { login, logout, user, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"customer" | "staff">("customer")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    const success = await login(email, password)

    if (!success) {
      setError("Invalid email or password")
    }
  }

  const handleDemoLogin = async (type: "customer" | "staff") => {
    setError("")
    const email = type === "customer" ? "customer@example.com" : "staff@example.com"
    const password = "password123" // In a real app, we'd use a proper auth flow

    await login(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">In-Store Self-Service System</CardTitle>
          <CardDescription className="text-center">
            {user ? `Welcome back, ${user.name}` : "Scan items and complete your purchase"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            // Show logout interface if user is logged in
            <div className="space-y-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {user.role === "staff" ? (
                      <Users className="h-6 w-6 text-green-600" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </div>
                <h3 className="font-medium text-green-900">{user.name}</h3>
                <p className="text-sm text-green-700">{user.email}</p>
                <p className="text-xs text-green-600 mt-1">
                  {user.role === "staff" ? "Staff Terminal" : "Self-Checkout"}
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() =>
                    (window.location.href = user.role === "staff" ? "/dashboard/staff" : "/dashboard/customer")
                  }
                >
                  Continue to {user.role === "staff" ? "Staff Dashboard" : "Self-Checkout"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout()
                    setActiveTab("customer")
                    setEmail("")
                    setPassword("")
                    setError("")
                  }}
                >
                  Logout & Switch User
                </Button>
              </div>
            </div>
          ) : (
            // Show login interface if no user is logged in
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "customer" | "staff")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Self-Checkout
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Staff Assist
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="customer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDemoLogin("customer")}
                    disabled={isLoading}
                  >
                    Demo Customer Login
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="staff">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="staff-email">Email</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      placeholder="staff@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-password">Password</Label>
                    <Input
                      id="staff-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleDemoLogin("staff")}
                    disabled={isLoading}
                  >
                    Demo Staff Login
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        {!user && (
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              <p>Self-Checkout: customer@example.com</p>
              <p>Staff Terminal: staff@example.com</p>
              <p className="text-xs mt-1">(Any password will work for demo)</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
