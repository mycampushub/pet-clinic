"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { User, Clinic, Tenant, AuthState, UserRole } from "@/types/auth"
import { checkPermission } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  register: (data: any) => Promise<void>
  updateClinic: (clinic: Clinic) => void
  hasPermission: (resource: string, action: string) => boolean
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; clinic: Clinic; tenant: Tenant } }
  | { type: "LOGIN_ERROR" }
  | { type: "LOGOUT" }
  | { type: "SET_CLINIC"; payload: Clinic }
  | { type: "SET_USER"; payload: User }
  | { type: "SWITCH_ROLE"; payload: UserRole }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true }
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        clinic: action.payload.clinic,
        tenant: action.payload.tenant,
        isAuthenticated: true,
        isLoading: false
      }
    case "LOGIN_ERROR":
      return {
        user: null,
        clinic: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false
      }
    case "LOGOUT":
      return {
        user: null,
        clinic: null,
        tenant: null,
        isAuthenticated: false,
        isLoading: false
      }
    case "SET_CLINIC":
      return { ...state, clinic: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload }
    case "SWITCH_ROLE":
      return state.user 
        ? { ...state, user: { ...state.user, role: action.payload } }
        : state
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  clinic: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: false
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Mock authentication functions - in real app, these would call API
  const login = async (credentials: { email: string; password: string }) => {
    dispatch({ type: "LOGIN_START" })
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email
      const mockUsers = {
        "reception@petclinic.com": {
          role: "RECEPTIONIST" as UserRole,
          name: "Sarah Johnson",
          clinic: "Main Street Pet Clinic"
        },
        "vet@petclinic.com": {
          role: "VETERINARIAN" as UserRole,
          name: "Dr. Michael Chen",
          clinic: "Main Street Pet Clinic"
        },
        "manager@petclinic.com": {
          role: "MANAGER" as UserRole,
          name: "Lisa Rodriguez",
          clinic: "Main Street Pet Clinic"
        },
        "admin@petclinic.com": {
          role: "ADMIN" as UserRole,
          name: "System Administrator",
          clinic: "Main Street Pet Clinic"
        }
      }

      const userData = mockUsers[credentials.email as keyof typeof mockUsers]
      
      if (!userData) {
        throw new Error("Invalid credentials")
      }

      const user: User = {
        id: "1",
        email: credentials.email,
        name: userData.name,
        role: userData.role,
        clinicId: "1",
        tenantId: "1",
        isActive: true
      }

      const clinic: Clinic = {
        id: "1",
        name: userData.clinic,
        phone: "(555) 123-4567",
        email: "info@petclinic.com",
        address: "123 Main St, Anytown, ST 12345",
        timezone: "America/New_York",
        tenantId: "1",
        settings: {
          appointmentDuration: 30,
          currency: "USD",
          taxRate: 7.5,
          features: {
            onlineBooking: true,
            telemedicine: true,
            inventory: true,
            billing: true,
            reports: true
          }
        }
      }

      const tenant: Tenant = {
        id: "1",
        name: "PetClinic Pro",
        settings: {
          maxClinics: 5,
          maxUsers: 20,
          features: ["all"]
        },
        createdAt: new Date().toISOString()
      }

      dispatch({ 
        type: "LOGIN_SUCCESS", 
        payload: { user, clinic, tenant }
      })
    } catch (error) {
      dispatch({ type: "LOGIN_ERROR" })
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
  }

  const register = async (data: any) => {
    // Mock registration - in real app, this would call API
    dispatch({ type: "LOGIN_START" })
    await new Promise(resolve => setTimeout(resolve, 1000))
    dispatch({ type: "LOGIN_ERROR" })
  }

  const updateClinic = (clinic: Clinic) => {
    dispatch({ type: "SET_CLINIC", payload: clinic })
  }

  const switchRole = (role: UserRole) => {
    dispatch({ type: "SWITCH_ROLE", payload: role })
  }

  const hasPermission = (resource: string, action: string) => {
    if (!state.user) return false
    return checkPermission(state.user.role, resource, action)
  }

  useEffect(() => {
    // Check for existing session on mount
    const savedAuth = localStorage.getItem("petclinic_auth")
    if (savedAuth) {
      try {
        const { user, clinic, tenant } = JSON.parse(savedAuth)
        dispatch({ 
          type: "LOGIN_SUCCESS", 
          payload: { user, clinic, tenant }
        })
      } catch (error) {
        console.error("Failed to parse saved auth state:", error)
        localStorage.removeItem("petclinic_auth")
      }
    }
  }, [])

  useEffect(() => {
    // Save auth state to localStorage when it changes
    if (state.isAuthenticated && state.user && state.clinic && state.tenant) {
      localStorage.setItem("petclinic_auth", JSON.stringify({
        user: state.user,
        clinic: state.clinic,
        tenant: state.tenant
      }))
    } else {
      localStorage.removeItem("petclinic_auth")
    }
  }, [state])

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    updateClinic,
    hasPermission,
    switchRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function usePermissions() {
  const { user, hasPermission } = useAuth()
  
  if (!user) {
    return {
      can: () => false,
      role: null as UserRole | null,
      permissions: []
    }
  }
  
  return {
    can: hasPermission,
    role: user.role,
    // Get permissions for the user's role
    permissions: [] // This would be populated from the role permissions
  }
}