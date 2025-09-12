import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

interface TenantUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  lastLoginAt?: Date
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId

    // Get all users for this tenant
    const users = await db.user.findMany({
      where: { 
        tenantId,
        isActive: true 
      },
      include: {
        clinic: true
      },
      orderBy: { lastName: 'asc' }
    })

    // Transform data for response
    const tenantUsers: TenantUser[] = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt
    }))

    return NextResponse.json(tenantUsers)
  } catch (error) {
    console.error('Error fetching tenant users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}