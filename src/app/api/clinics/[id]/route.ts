import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicId = params.id

    // Check if clinic exists and belongs to tenant
    const clinic = await db.clinic.findFirst({
      where: { 
        id: clinicId,
        tenantId: session.user.tenantId
      },
      include: {
        _count: {
          select: {
            users: { where: { isActive: true } }
          }
        }
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
      state: clinic.state,
      zipCode: clinic.zipCode,
      country: clinic.country,
      phone: clinic.phone,
      email: clinic.email,
      website: clinic.website,
      timezone: clinic.timezone,
      isActive: clinic.isActive,
      settings: clinic.settings,
      userCount: clinic._count.users
    })
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
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicId = params.id
    const body = await request.json()
    const { name, address, city, state, zipCode, country, phone, email, website, timezone, isActive, settings } = body

    // Check if clinic exists and belongs to tenant
    const clinic = await db.clinic.findFirst({
      where: { 
        id: clinicId,
        tenantId: session.user.tenantId
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Update clinic
    const updatedClinic = await db.clinic.update({
      where: { id: clinicId },
      data: {
        name: name || clinic.name,
        address: address || clinic.address,
        city: city || clinic.city,
        state: state || clinic.state,
        zipCode: zipCode || clinic.zipCode,
        country: country || clinic.country,
        phone: phone || clinic.phone,
        email: email !== undefined ? email : clinic.email,
        website: website !== undefined ? website : clinic.website,
        timezone: timezone || clinic.timezone,
        isActive: isActive !== undefined ? isActive : clinic.isActive,
        settings: settings || clinic.settings
      }
    })

    return NextResponse.json({
      id: updatedClinic.id,
      name: updatedClinic.name,
      address: updatedClinic.address,
      city: updatedClinic.city,
      state: updatedClinic.state,
      phone: updatedClinic.phone,
      isActive: updatedClinic.isActive
    })
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
    
    if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clinicId = params.id

    // Check if clinic exists and belongs to tenant
    const clinic = await db.clinic.findFirst({
      where: { 
        id: clinicId,
        tenantId: session.user.tenantId
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: 'Clinic not found' }, { status: 404 })
    }

    // Check if clinic has users
    const userCount = await db.user.count({
      where: { 
        clinicId,
        isActive: true 
      }
    })

    if (userCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete clinic with active users. Please reassign or deactivate users first.' 
      }, { status: 400 })
    }

    // Delete the clinic
    await db.clinic.delete({
      where: { id: clinicId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting clinic:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}