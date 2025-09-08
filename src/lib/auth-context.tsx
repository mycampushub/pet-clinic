"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { UserRole } from "@/types/auth"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  clinicId?: string
  tenantId: string
  isActive: boolean
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  clinicName: string
  phone?: string
  address?: string
  subscriptionPlan: "starter" | "professional" | "enterprise"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Role-based permissions configuration
const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  RECEPTIONIST: [
    "appointments:view",
    "appointments:create",
    "appointments:edit",
    "patients:view",
    "patients:register",
    "billing:view",
    "billing:create",
    "billing:process_payments",
    "inventory:view"
  ],
  VETERINARIAN: [
    "appointments:view",
    "patients:view",
    "patients:edit_medical",
    "visits:view",
    "visits:create",
    "visits:edit",
    "prescriptions:view",
    "prescriptions:create",
    "prescriptions:edit",
    "lab_orders:view",
    "lab_orders:create",
    "inventory:view",
    "inventory:dispense"
  ],
  VET_TECH: [
    "appointments:view",
    "patients:view",
    "visits:view",
    "visits:create",
    "visits:edit",
    "lab_orders:view",
    "lab_orders:create",
    "inventory:view",
    "inventory:dispense"
  ],
  PHARMACIST: [
    "inventory:view",
    "inventory:manage",
    "inventory:dispense_controlled",
    "prescriptions:view",
    "prescriptions:dispense",
    "reports:view"
  ],
  MANAGER: [
    "appointments:view",
    "appointments:manage",
    "patients:view",
    "patients:manage",
    "visits:view",
    "billing:view",
    "billing:manage",
    "inventory:view",
    "inventory:manage",
    "users:view",
    "users:manage_clinic",
    "reports:view",
    "reports:generate",
    "clinic:settings"
  ],
  ADMIN: [
    "*" // Full access
  ],
  OWNER: [
    "appointments:view",
    "patients:view_own",
    "billing:view_own",
    "appointments:book_own"
  ],
  AUDITOR: [
    "appointments:view",
    "patients:view",
    "billing:view",
    "inventory:view",
    "audit_logs:view",
    "reports:view"
  ]
}

// Mock user database - in real app, this would come from backend
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "demo@petclinic.com",
    name: "Demo User",
    role: "MANAGER",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "2",
    email: "reception@petclinic.com",
    name: "Sarah Johnson",
    role: "RECEPTIONIST",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "3",
    email: "vet@petclinic.com",
    name: "Dr. Michael Smith",
    role: "VETERINARIAN",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "4",
    email: "tech@petclinic.com",
    name: "Emily Davis",
    role: "VET_TECH",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "5",
    email: "pharmacy@petclinic.com",
    name: "James Wilson",
    role: "PHARMACIST",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "6",
    email: "manager@petclinic.com",
    name: "Lisa Anderson",
    role: "MANAGER",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "7",
    email: "admin@petclinic.com",
    name: "System Admin",
    role: "ADMIN",
    tenantId: "tenant-1",
    isActive: true
  },
  {
    id: "7",
    email: "demo@petclinic.com",
    name: "Demo User",
    role: "MANAGER",
    clinicId: "clinic-1",
    tenantId: "tenant-1",
    isActive: true
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("petclinic_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("petclinic_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Find user (in real app, this would be an API call)
    const foundUser = MOCK_USERS.find(u => u.email === email)
    
    if (foundUser && password === "demo123") {
      setUser(foundUser)
      localStorage.setItem("petclinic_user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create new user (in real app, this would be an API call)
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: "MANAGER", // First user is always a manager
      clinicId: "clinic-" + Date.now(),
      tenantId: "tenant-" + Date.now(),
      isActive: true
    }
    
    // Add to mock users (in real app, this would be handled by backend)
    MOCK_USERS.push(newUser)
    
    // Auto-login after registration
    setUser(newUser)
    localStorage.setItem("petclinic_user", JSON.stringify(newUser))
    
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("petclinic_user")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role]
    
    // Admin has full access
    if (user.role === "ADMIN") return true
    
    // Check if user has the specific permission
    return userPermissions.includes(permission) || userPermissions.includes("*")
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      hasPermission,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Higher-order component for route protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, hasPermission, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return <LoginPage />
    }

    if (requiredPermissions && !requiredPermissions.every(permission => hasPermission(permission))) {
      return <UnauthorizedPage />
    }

    return <Component {...props} />
  }
}

// Login Page Component
export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)
    
    if (!success) {
      setError("Invalid email or password")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">PetClinic Pro</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <div><strong>Receptionist:</strong> reception@petclinic.com / demo123</div>
            <div><strong>Veterinarian:</strong> vet@petclinic.com / demo123</div>
            <div><strong>Manager:</strong> manager@petclinic.com / demo123</div>
            <div><strong>Admin:</strong> admin@petclinic.com / demo123</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Unauthorized Page Component
export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <button
          onClick={() => window.location.href = "/"}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}