import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, clinicName, phone, address, subscriptionPlan } = body

    // Validate required fields
    if (!email || !password || !name || !clinicName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: `${clinicName} Tenant`,
        settings: {
          currency: 'USD',
          timezone: 'UTC',
          language: 'en',
          subscriptionPlan
        }
      }
    })

    // Create clinic
    const clinic = await prisma.clinic.create({
      data: {
        tenantId: tenant.id,
        name: clinicName,
        address,
        phone,
        timezone: 'America/New_York',
        hours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '9:00 AM - 2:00 PM',
          sunday: 'Closed'
        }
      }
    })

    // Create user (first user is always a manager)
    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        clinicId: clinic.id,
        email,
        name,
        password: hashedPassword,
        role: 'MANAGER',
        isActive: true,
        permissions: []
      }
    })

    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}