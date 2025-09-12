import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

interface TenantWithStats {
  id: string
  name: string
  slug: string
  domain?: string
  isActive: boolean
  createdAt: Date
  userCount: number
  clinicCount: number
  revenue: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all tenants with their statistics
    const tenants = await db.tenant.findMany({
      include: {
        _count: {
          select: {
            users: { where: { isActive: true } },
            clinics: { where: { isActive: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data to include stats
    const tenantsWithStats: TenantWithStats[] = tenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain || undefined,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,
      userCount: tenant._count.users,
      clinicCount: tenant._count.clinics,
      revenue: Math.floor(Math.random() * 5000) + 1000 // Mock revenue data
    }))

    return NextResponse.json(tenantsWithStats)
  } catch (error) {
    console.error('Error fetching admin tenants:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}