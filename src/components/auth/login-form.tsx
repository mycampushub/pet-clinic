"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { UserRole } from "@/types/auth"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login({ email, password })
      onSuccess?.()
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword("password") // Mock password
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            PetClinic Pro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the clinic management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">
                    Quick Login (Demo)
                  </span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin("reception@petclinic.com")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Login as Receptionist</span>
                    <span className="text-xs text-muted-foreground">Full access</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin("vet@petclinic.com")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Login as Veterinarian</span>
                    <span className="text-xs text-muted-foreground">Clinical access</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin("manager@petclinic.com")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Login as Manager</span>
                    <span className="text-xs text-muted-foreground">Admin access</span>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => quickLogin("admin@petclinic.com")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Login as Admin</span>
                    <span className="text-xs text-muted-foreground">System access</span>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}