import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      clinicId: string | null
      tenantId: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    clinicId: string | null
    tenantId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    clinicId: string | null
    tenantId: string
  }
}