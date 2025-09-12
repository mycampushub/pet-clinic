import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

interface ClinicWithUserCount {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  isActive: boolean
  userCount: number
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId

    // Get all clinics for this tenant with user counts
    const clinics = await db.clinic.findMany({
      where: { 
        tenantId,
        isActive: true 
      },
      include: {
        _count: {
          select: {
            users: { where: { isActive: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform data to include user counts
    const clinicsWithUserCount: ClinicWithUserCount[] = clinics.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      state: clinic.state,
      phone: clinic.phone,
      isActive: clinic.isActive,
      userCount: clinic._count.users
    }))

    return NextResponse.json(clinicsWithUserCount)
  } catch (error) {
    console.error('Error fetching tenant clinics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}