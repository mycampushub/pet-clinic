import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId

    // Get tenant-specific statistics
    const [
      totalUsers,
      activeUsers,
      totalClinics,
      appointments
    ] = await Promise.all([
      db.user.count({ 
        where: { 
          tenantId,
          isActive: true 
        } 
      }),
      db.user.count({ 
        where: { 
          tenantId,
          isActive: true,
          lastLoginAt: { 
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        } 
      }),
      db.clinic.count({ 
        where: { 
          tenantId,
          isActive: true 
        } 
      }),
      db.visit.count({ 
        where: { 
          tenantId,
          scheduledAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        } 
      })
    ])

    // Mock revenue data for demo
    const revenue = 5000

    const stats = {
      totalUsers,
      activeUsers,
      totalClinics,
      appointmentsToday: appointments,
      revenue
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching tenant stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}