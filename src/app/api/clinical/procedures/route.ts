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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get recent procedures with related data
    const procedures = await db.procedure.findMany({
      where: {
        visit: {
          tenantId
        }
      },
      include: {
        visit: {
          include: {
            pet: {
              include: {
                owner: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(procedures)
  } catch (error) {
    console.error('Error fetching procedures:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      visitId,
      code,
      description,
      procedureType,
      anesthesiaUsed,
      anesthesiaNotes,
      notes
    } = body

    // Validate required fields
    if (!visitId || !description || !procedureType) {
      return NextResponse.json({ 
        error: 'Missing required fields: visitId, description, procedureType are required' 
      }, { status: 400 })
    }

    // Verify the visit belongs to the user's tenant
    const visit = await db.visit.findUnique({
      where: { id: visitId }
    })

    if (!visit || visit.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Visit not found or access denied' }, { status: 404 })
    }

    // Create procedure
    const procedure = await db.procedure.create({
      data: {
        visitId,
        code,
        description,
        procedureType,
        anesthesiaUsed: anesthesiaUsed || false,
        anesthesiaNotes,
        notes
      }
    })

    return NextResponse.json(procedure, { status: 201 })
  } catch (error) {
    console.error('Error creating procedure:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}