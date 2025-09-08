import { UserRole } from "@/types/auth"

export interface Permission {
  resource: string
  action: "read" | "write" | "delete" | "manage"
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
  canAccess: (resource: string, action: string) => boolean
}

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  RECEPTIONIST: [
    { resource: "appointments", action: "read" },
    { resource: "appointments", action: "write" },
    { resource: "patients", action: "read" },
    { resource: "patients", action: "write" },
    { resource: "billing", action: "read" },
    { resource: "billing", action: "write" },
    { resource: "dashboard", action: "read" }
  ],
  VETERINARIAN: [
    { resource: "appointments", action: "read" },
    { resource: "appointments", action: "write" },
    { resource: "patients", action: "read" },
    { resource: "patients", action: "write" },
    { resource: "visits", action: "read" },
    { resource: "visits", action: "write" },
    { resource: "prescriptions", action: "read" },
    { resource: "prescriptions", action: "write" },
    { resource: "lab_orders", action: "read" },
    { resource: "lab_orders", action: "write" },
    { resource: "billing", action: "read" },
    { resource: "dashboard", action: "read" }
  ],
  VET_TECH: [
    { resource: "appointments", action: "read" },
    { resource: "patients", action: "read" },
    { resource: "visits", action: "read" },
    { resource: "visits", action: "write" },
    { resource: "lab_orders", action: "read" },
    { resource: "lab_orders", action: "write" },
    { resource: "dashboard", action: "read" }
  ],
  PHARMACIST: [
    { resource: "inventory", action: "read" },
    { resource: "inventory", action: "write" },
    { resource: "prescriptions", action: "read" },
    { resource: "prescriptions", action: "write" },
    { resource: "dashboard", action: "read" }
  ],
  MANAGER: [
    { resource: "appointments", action: "read" },
    { resource: "appointments", action: "write" },
    { resource: "patients", action: "read" },
    { resource: "patients", action: "write" },
    { resource: "visits", action: "read" },
    { resource: "billing", action: "read" },
    { resource: "billing", action: "write" },
    { resource: "inventory", action: "read" },
    { resource: "inventory", action: "write" },
    { resource: "reports", action: "read" },
    { resource: "reports", action: "write" },
    { resource: "users", action: "read" },
    { resource: "users", action: "write" },
    { resource: "dashboard", action: "read" },
    { resource: "dashboard", action: "manage" }
  ],
  ADMIN: [
    { resource: "*", action: "*" } // Full access
  ],
  OWNER: [
    { resource: "appointments", action: "read" },
    { resource: "patients", action: "read" },
    { resource: "billing", action: "read" },
    { resource: "dashboard", action: "read" }
  ]
}

export function createRolePermissions(role: UserRole): RolePermissions {
  const permissions = ROLE_PERMISSIONS[role]
  
  return {
    role,
    permissions,
    canAccess: (resource: string, action: string) => {
      return permissions.some(perm => 
        perm.resource === "*" || 
        (perm.resource === resource && perm.action === action) ||
        (perm.resource === resource && perm.action === "*") ||
        (perm.resource === "*" && perm.action === action)
      )
    }
  }
}

export function checkPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const rolePermissions = createRolePermissions(userRole)
  return rolePermissions.canAccess(resource, action)
}

// Hook for client-side permission checking
export function usePermissions(userRole: UserRole) {
  const rolePermissions = createRolePermissions(userRole)
  
  return {
    can: (resource: string, action: string) => rolePermissions.canAccess(resource, action),
    role: userRole,
    permissions: rolePermissions.permissions
  }
}

// Higher-order component for route protection
export function withPermission(
  Component: React.ComponentType<any>,
  requiredResource: string,
  requiredAction: string
) {
  return function ProtectedComponent(props: any) {
    // This would typically get the user role from context/auth state
    // For now, we'll use a placeholder implementation
    const userRole: UserRole = "RECEPTIONIST" // This should come from auth context
    
    if (!checkPermission(userRole, requiredResource, requiredAction)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this resource.
            </p>
          </div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}