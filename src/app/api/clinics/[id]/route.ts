import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinic = await db.clinic.findUnique({
      where: { id: params.id }
    })
    
    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Check permissions - users can view clinics from their tenant
    // Admin and Clinic Admin users can view clinics from any tenant
    if (clinic.tenantId !== session.user.tenantId && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'CLINIC_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error('Error fetching clinic:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin and clinic admin users can update clinics
    if (session.user.role !== 'ADMIN' && session.user.role !== 'CLINIC_ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      website,
      timezone,
      settings,
      isActive
    } = body

    // Check if clinic exists
    const existingClinic = await db.clinic.findUnique({
      where: { id: params.id }
    })
    
    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Check permissions - users can update clinics from their tenant
    // Admin users can update clinics from any tenant
    if (existingClinic.tenantId !== session.user.tenantId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (address !== undefined) updateData.address = address
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (zipCode !== undefined) updateData.zipCode = zipCode
    if (country !== undefined) updateData.country = country
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    if (website !== undefined) updateData.website = website
    if (timezone !== undefined) updateData.timezone = timezone
    if (settings !== undefined) updateData.settings = settings
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedClinic = await db.clinic.update({
      where: { id: params.id },
      data: updateData
    })
    
    return NextResponse.json(updatedClinic)
  } catch (error) {
    console.error('Error updating clinic:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin users can delete clinics
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if clinic exists
    const existingClinic = await db.clinic.findUnique({
      where: { id: params.id }
    })
    
    if (!existingClinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    await db.clinic.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Clinic deleted successfully' })
  } catch (error) {
    console.error('Error deleting clinic:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}