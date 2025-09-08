"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { UserRole } from "@/types/auth"

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  clinicId: string | null
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

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id || "",
    email: session.user.email || "",
    name: session.user.name || "",
    role: (session.user as any).role as UserRole || "RECEPTIONIST",
    clinicId: (session.user as any).clinicId || null,
    tenantId: (session.user as any).tenantId || "",
    isActive: true,
    permissions: (session.user as any).permissions || []
  } : null

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })
      return result?.ok || false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // In a real app, this would call a registration API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        // Auto-login after registration
        return await login(data.email, data.password)
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    
    const userPermissions = ROLE_PERMISSIONS[user.role]
    
    // Admin has full access
    if (user.role === "ADMIN") return true
    
    // Check if user has the specific permission
    return userPermissions.includes(permission) || userPermissions.includes("*")
  }

  return {
    user,
    login,
    logout,
    register,
    hasPermission,
    isLoading: status === "loading"
  }
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
      // Redirect to login instead of rendering the login page component
      window.location.href = "/login"
      return null
    }

    if (requiredPermissions && !requiredPermissions.every(permission => hasPermission(permission))) {
      return <UnauthorizedPage />
    }

    return <Component {...props} />
  }
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
          onClick={() => window.location.href = "/dashboard"}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}