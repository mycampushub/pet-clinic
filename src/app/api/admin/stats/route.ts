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

    // Get current month revenue from all paid invoices
    const currentMonth = new Date()
    currentMonth.setDate(1) // First day of current month
    currentMonth.setHours(0, 0, 0, 0)
    
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    const revenueResult = await db.invoice.aggregate({
      where: {
        paymentStatus: 'PAID',
        invoiceDate: {
          gte: currentMonth,
          lt: nextMonth
        }
      },
      _sum: {
        total: true
      }
    })
    
    // Get new tenants this month
    const newTenantsThisMonth = await db.tenant.count({
      where: {
        createdAt: {
          gte: currentMonth,
          lt: nextMonth
        }
      }
    })

    const stats = {
      totalTenants,
      activeTenants,
      totalUsers,
      totalClinics,
      systemRevenue: revenueResult._sum.total || 0,
      newTenantsThisMonth
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}