import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      accountType,
      clinicName,
      clinicAddress,
      clinicCity,
      clinicState,
      clinicZip,
      clinicPhone,
      clinicType,
      clinicCode,
      role
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    let tenant, clinic

    if (accountType === 'clinic') {
      // Create new tenant and clinic
      tenant = await db.tenant.create({
        data: {
          name: clinicName || `${firstName} ${lastName}'s Clinic`,
          slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9-]/g, '-') + '-clinic',
          isActive: true
        }
      })

      clinic = await db.clinic.create({
        data: {
          tenantId: tenant.id,
          name: clinicName || `${firstName} ${lastName}'s Clinic`,
          address: clinicAddress || '',
          city: clinicCity || '',
          state: clinicState || '',
          zipCode: clinicZip || '',
          phone: clinicPhone || '',
          isActive: true
        }
      })
    } else {
      // Find existing clinic by code (for demo, we'll use the first clinic)
      clinic = await db.clinic.findFirst()
      
      if (!clinic) {
        return NextResponse.json({ error: 'No clinics found. Please create a clinic first.' }, { status: 404 })
      }

      tenant = await db.tenant.findUnique({
        where: { id: clinic.tenantId }
      })
    }

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        tenantId: tenant.id,
        clinicId: clinic?.id,
        role: accountType === 'clinic' ? UserRole.CLINIC_ADMIN : (role === 'VETERINARIAN' ? UserRole.VETERINARIAN : UserRole.STAFF),
        isActive: true
      }
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}