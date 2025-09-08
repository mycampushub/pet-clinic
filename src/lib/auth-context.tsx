"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type UserRole = "RECEPTIONIST" | "VETERINARIAN" | "VET_TECH" | "PHARMACIST" | "MANAGER" | "ADMIN" | "CLINIC_OWNER"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  clinicId?: string
  clinicName?: string
  isActive: boolean
  lastLogin?: Date
}

export interface Clinic {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  subscriptionPlan: "starter" | "professional" | "enterprise"
  isActive: boolean
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  clinic: Clinic | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  updateUserRole: (role: UserRole) => Promise<boolean>
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

// Role-based permissions
const rolePermissions: Record<UserRole, string[]> = {
  RECEPTIONIST: [
    "view_appointments",
    "create_appointments",
    "edit_appointments",
    "view_patients",
    "create_patients",
    "edit_patients",
    "view_invoices",
    "create_invoices",
    "process_payments"
  ],
  VETERINARIAN: [
    "view_appointments",
    "create_appointments",
    "edit_appointments",
    "view_patients",
    "create_patients",
    "edit_patients",
    "view_visits",
    "create_visits",
    "edit_visits",
    "view_medical_records",
    "create_medical_records",
    "prescribe_medications",
    "view_lab_results",
    "order_lab_tests"
  ],
  VET_TECH: [
    "view_appointments",
    "view_patients",
    "view_visits",
    "create_visits",
    "edit_visits",
    "view_medical_records",
    "create_medical_records",
    "view_lab_results",
    "order_lab_tests",
    "manage_inventory"
  ],
  PHARMACIST: [
    "view_prescriptions",
    "manage_prescriptions",
    "manage_inventory",
    "view_patients",
    "order_supplies"
  ],
  MANAGER: [
    "view_appointments",
    "create_appointments",
    "edit_appointments",
    "view_patients",
    "create_patients",
    "edit_patients",
    "view_visits",
    "create_visits",
    "edit_visits",
    "view_medical_records",
    "create_medical_records",
    "prescribe_medications",
    "view_lab_results",
    "order_lab_tests",
    "view_invoices",
    "create_invoices",
    "edit_invoices",
    "process_payments",
    "manage_inventory",
    "manage_users",
    "view_reports",
    "manage_billing",
    "manage_clinic_settings"
  ],
  ADMIN: [
    "view_appointments",
    "create_appointments",
    "edit_appointments",
    "view_patients",
    "create_patients",
    "edit_patients",
    "view_visits",
    "create_visits",
    "edit_visits",
    "view_medical_records",
    "create_medical_records",
    "prescribe_medications",
    "view_lab_results",
    "order_lab_tests",
    "view_invoices",
    "create_invoices",
    "edit_invoices",
    "process_payments",
    "manage_inventory",
    "manage_users",
    "view_reports",
    "manage_billing",
    "manage_clinic_settings",
    "manage_subscriptions",
    "manage_integrations",
    "view_audit_logs",
    "system_administration"
  ],
  CLINIC_OWNER: [
    "view_appointments",
    "create_appointments",
    "edit_appointments",
    "view_patients",
    "create_patients",
    "edit_patients",
    "view_visits",
    "create_visits",
    "edit_visits",
    "view_medical_records",
    "create_medical_records",
    "prescribe_medications",
    "view_lab_results",
    "order_lab_tests",
    "view_invoices",
    "create_invoices",
    "edit_invoices",
    "process_payments",
    "manage_inventory",
    "manage_users",
    "view_reports",
    "manage_billing",
    "manage_clinic_settings",
    "manage_subscriptions",
    "view_financial_reports",
    "manage_clinic_profile"
  ]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [clinic, setClinic] = useState<Clinic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("petclinic_user")
    const savedClinic = localStorage.getItem("petclinic_clinic")
    
    if (savedUser && savedClinic) {
      try {
        setUser(JSON.parse(savedUser))
        setClinic(JSON.parse(savedClinic))
      } catch (error) {
        console.error("Error parsing saved auth data:", error)
        localStorage.removeItem("petclinic_user")
        localStorage.removeItem("petclinic_clinic")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const mockUser: User = {
        id: "1",
        email,
        name: "Dr. John Doe",
        role: "MANAGER",
        clinicId: "clinic-1",
        clinicName: "Happy Paws Veterinary Clinic",
        isActive: true,
        lastLogin: new Date()
      }

      const mockClinic: Clinic = {
        id: "clinic-1",
        name: "Happy Paws Veterinary Clinic",
        address: "123 Main St, Anytown, ST 12345",
        phone: "(555) 123-4567",
        email: "contact@happypaws.com",
        subscriptionPlan: "professional",
        isActive: true,
        createdAt: new Date()
      }

      setUser(mockUser)
      setClinic(mockClinic)
      
      // Save to localStorage
      localStorage.setItem("petclinic_user", JSON.stringify(mockUser))
      localStorage.setItem("petclinic_clinic", JSON.stringify(mockClinic))
      
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create clinic first
      const newClinic: Clinic = {
        id: `clinic-${Date.now()}`,
        name: data.clinicName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        subscriptionPlan: data.subscriptionPlan,
        isActive: true,
        createdAt: new Date()
      }

      // Create user with CLINIC_OWNER role
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: "CLINIC_OWNER",
        clinicId: newClinic.id,
        clinicName: newClinic.name,
        isActive: true,
        lastLogin: new Date()
      }

      setClinic(newClinic)
      setUser(newUser)
      
      // Save to localStorage
      localStorage.setItem("petclinic_user", JSON.stringify(newUser))
      localStorage.setItem("petclinic_clinic", JSON.stringify(newClinic))
      
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setClinic(null)
    localStorage.removeItem("petclinic_user")
    localStorage.removeItem("petclinic_clinic")
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return rolePermissions[user.role]?.includes(permission) || false
  }

  const updateUserRole = async (role: UserRole): Promise<boolean> => {
    if (!user) return false
    
    try {
      // Simulate API call - replace with actual role update
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem("petclinic_user", JSON.stringify(updatedUser))
      
      return true
    } catch (error) {
      console.error("Role update error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      clinic,
      isLoading,
      login,
      logout,
      register,
      hasPermission,
      updateUserRole
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

// Permission component for conditional rendering
interface PermissionProps {
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function Permission({ permission, children, fallback = null }: PermissionProps) {
  const { hasPermission } = useAuth()
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Role-based navigation component
interface RoleNavProps {
  requiredRole: UserRole
  children: ReactNode
  fallback?: ReactNode
}

export function RoleNav({ requiredRole, children, fallback = null }: RoleNavProps) {
  const { user } = useAuth()
  
  if (!user || user.role !== requiredRole) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}