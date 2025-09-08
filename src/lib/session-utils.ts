import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface SessionUser {
  id: string
  email: string
  name: string
  role: string
  tenantId: string
  clinicId?: string | null
  permissions?: string[]
}

interface ValidatedSession {
  user: SessionUser
  clinicId: string
}

export async function getValidatedSession(): Promise<ValidatedSession | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log("No session found")
      return null
    }

    const user = session.user as any
    
    if (!user.clinicId) {
      console.log("User has no clinicId assigned:", user.email || user.id)
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        clinicId: user.clinicId,
        permissions: user.permissions || []
      },
      clinicId: user.clinicId
    }
  } catch (error) {
    console.error("Error validating session:", error)
    return null
  }
}