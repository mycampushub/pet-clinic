import { getServerSession } from "next-auth"
import { authOptions } from "./config"
import { UserRole } from "@prisma/client"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth()
  
  if (Array.isArray(role)) {
    if (!role.includes(user.role)) {
      throw new Error("Insufficient permissions")
    }
  } else {
    if (user.role !== role) {
      throw new Error("Insufficient permissions")
    }
  }
  
  return user
}

export async function requireClinicAccess() {
  const user = await requireAuth()
  
  if (!user.clinicId) {
    throw new Error("Clinic access required")
  }
  
  return user
}

export async function canAccessTenant(tenantId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // Admin can access any tenant
  if (user.role === UserRole.ADMIN) {
    return true
  }
  
  // Users can only access their own tenant
  return user.tenantId === tenantId
}

export async function canAccessClinic(clinicId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // Admin can access any clinic
  if (user.role === UserRole.ADMIN) {
    return true
  }
  
  // Users can only access their own clinic
  return user.clinicId === clinicId
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.ADMIN]: 5,
    [UserRole.CLINIC_ADMIN]: 4,
    [UserRole.VETERINARIAN]: 3,
    [UserRole.VET_TECH]: 2,
    [UserRole.RECEPTIONIST]: 2,
    [UserRole.PHARMACIST]: 2,
    [UserRole.OWNER]: 1,
    [UserRole.STAFF]: 1
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}