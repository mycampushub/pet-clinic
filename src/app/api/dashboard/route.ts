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

    // Get dashboard stats using real database
    const [
      totalPets,
      totalOwners,
      totalVisits,
      upcomingAppointments
    ] = await Promise.all([
      db.pet.count({ where: { tenantId } }),
      db.owner.count({ where: { tenantId } }),
      db.visit.count({ where: { tenantId } }),
      db.visit.count({ 
        where: { 
          tenantId,
          scheduledAt: { gte: new Date() }
        }
      })
    ])

    const stats = {
      totalPets,
      totalOwners,
      totalVisits,
      upcomingAppointments
    }

    // Get recent appointments using real database
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

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
      orderBy: { scheduledAt: 'asc' }
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