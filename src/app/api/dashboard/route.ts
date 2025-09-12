import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get dashboard stats using real database
    const [
      todayAppointments,
      completedAppointments,
      pendingInvoices,
      lowInventoryItems,
      upcomingReminders,
      newPatients,
      totalRevenue
    ] = await Promise.all([
      // Today's appointments
      db.visit.count({ 
        where: { 
          tenantId,
          scheduledAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Completed appointments today
      db.visit.count({ 
        where: { 
          tenantId,
          scheduledAt: {
            gte: today,
            lt: tomorrow
          },
          status: 'COMPLETED'
        }
      }),
      
      // Pending invoices
      db.invoice.count({ 
        where: { 
          tenantId,
          paymentStatus: 'UNPAID'
        }
      }),
      
      // Low inventory items
      db.inventoryItem.count({ 
        where: { 
          tenantId,
          quantity: { lte: 10 }
        }
      }),
      
      // Upcoming reminders
      db.reminder.count({ 
        where: { 
          tenantId,
          triggerDate: { gte: new Date() },
          status: 'PENDING'
        }
      }),
      
      // New patients (pets created in last 30 days)
      db.pet.count({ 
        where: { 
          tenantId,
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Today's revenue (sum of paid invoices today)
      db.invoice.aggregate({
        where: {
          tenantId,
          paymentStatus: 'PAID',
          invoiceDate: {
            gte: today,
            lt: tomorrow
          }
        },
        _sum: {
          total: true
        }
      })
    ])

    const stats = {
      todayAppointments,
      completedAppointments,
      pendingInvoices,
      lowInventoryItems,
      upcomingReminders,
      newPatients,
      revenueToday: totalRevenue._sum.total || 0
    }

    // Get recent appointments using real database
    const appointments = await db.visit.findMany({
      where: {
        tenantId,
        scheduledAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        pet: {
          include: {
            owner: true
          }
        }
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10
    })
    
    const recentAppointments = appointments.map(apt => ({
      id: apt.id,
      petName: apt.pet.name,
      ownerName: `${apt.pet.owner.firstName} ${apt.pet.owner.lastName}`,
      time: apt.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: apt.visitType,
      status: apt.status
    }))

    return NextResponse.json({
      stats,
      recentAppointments
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}