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

    // Get recent SOAP notes with related data
    const soapNotes = await db.sOAPNote.findMany({
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
            },
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json(soapNotes)
  } catch (error) {
    console.error('Error fetching SOAP notes:', error)
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
      subjective,
      objective,
      assessment,
      plan,
      weight,
      temperature,
      heartRate,
      respiratoryRate,
      notes,
      attachments
    } = body

    // Validate required fields
    if (!visitId || !subjective || !objective || !assessment || !plan) {
      return NextResponse.json({ 
        error: 'Missing required fields: visitId, subjective, objective, assessment, plan are required' 
      }, { status: 400 })
    }

    // Verify the visit belongs to the user's tenant
    const visit = await db.visit.findUnique({
      where: { id: visitId },
      include: {
        pet: {
          include: {
            owner: true
          }
        }
      }
    })

    if (!visit || visit.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: 'Visit not found or access denied' }, { status: 404 })
    }

    // Create SOAP note
    const soapNote = await db.sOAPNote.create({
      data: {
        visitId,
        subjective,
        objective,
        assessment,
        plan,
        weight: weight ? parseFloat(weight) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        heartRate: heartRate ? parseInt(heartRate) : null,
        respiratoryRate: respiratoryRate ? parseInt(respiratoryRate) : null,
        notes,
        attachments: attachments || {}
      }
    })

    return NextResponse.json(soapNote, { status: 201 })
  } catch (error) {
    console.error('Error creating SOAP note:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}