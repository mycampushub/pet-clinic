import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { mockDb } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const stats = await mockDb.getDashboardStats(tenantId)

    // Get recent appointments
    const today = new Date().toISOString().split('T')[0]
    const appointments = await mockDb.findVisits(tenantId, today)
    
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