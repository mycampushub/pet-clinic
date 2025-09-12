import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get system-wide statistics
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalClinics
    ] = await Promise.all([
      db.tenant.count(),
      db.tenant.count({ where: { isActive: true } }),
      db.user.count({ where: { isActive: true } }),
      db.clinic.count({ where: { isActive: true } })
    ])

    // Get current month revenue (mock data for demo)
    const systemRevenue = 15000
    const newTenantsThisMonth = 3

    const stats = {
      totalTenants,
      activeTenants,
      totalUsers,
      totalClinics,
      systemRevenue,
      newTenantsThisMonth
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}