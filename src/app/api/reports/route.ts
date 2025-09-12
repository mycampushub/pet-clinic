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

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'overview'
    const dateRange = searchParams.get('dateRange') || '30'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - parseInt(dateRange))

    const where = {
      tenantId: session.user.tenantId,
      ...(session.user.clinicId && { clinicId: session.user.clinicId }),
      ...(reportType !== 'overview' && {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      })
    }

    let reportData: any = {}

    switch (reportType) {
      case 'revenue':
        // Get revenue data
        const invoices = await db.invoice.findMany({
          where: {
            ...where,
            paymentStatus: 'PAID'
          }
        })

        const dailyRevenue = await db.$queryRaw`
          SELECT 
            DATE(scheduled_at) as date,
            SUM(total) as amount
          FROM visits
          WHERE tenant_id = ${session.user.tenantId}
            AND scheduled_at >= ${startDate.toISOString()}
            AND scheduled_at <= ${endDate.toISOString()}
          GROUP BY DATE(scheduled_at)
          ORDER BY DATE(scheduled_at)
        ` as Array<{ date: string; amount: number }>

        reportData = {
          daily: dailyRevenue,
          total: invoices.reduce((sum, inv) => sum + inv.total, 0),
          count: invoices.length
        }
        break

      case 'appointments':
        const appointments = await db.visit.findMany({
          where: {
            ...where,
            scheduledAt: {
              gte: startDate,
              lte: endDate
            }
          }
        })

        const statusCounts = appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        reportData = {
          total: appointments.length,
          byStatus: statusCounts,
          utilization: appointments.length / (parseInt(dateRange) * 10) * 100 // Assuming 10 slots per day
        }
        break

      case 'patients':
        const patients = await db.pet.findMany({
          where: {
            ...where,
            createdAt: {
              gte: startDate,
              lte: endDate
            }
          },
          include: {
            owner: true
          }
        })

        const speciesCounts = patients.reduce((acc, pet) => {
          acc[pet.species] = (acc[pet.species] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        reportData = {
          total: patients.length,
          new: patients.length,
          bySpecies: speciesCounts
        }
        break

      case 'inventory':
        const inventory = await db.inventoryItem.findMany({
          where: {
            ...where
          }
        })

        const lowStock = inventory.filter(item => item.quantity <= item.reorderPoint)
        const expiring = inventory.filter(item => 
          item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        )

        reportData = {
          totalItems: inventory.length,
          totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
          lowStock: lowStock.length,
          expiring: expiring.length,
          controlled: inventory.filter(item => item.isControlled).length
        }
        break

      default:
        // Overview report
        const [allAppointments, allPatients, allInvoices] = await Promise.all([
          db.visit.count({ where }),
          db.pet.count({ where }),
          db.invoice.count({ where })
        ])

        const [completedAppointments, paidInvoices] = await Promise.all([
          db.visit.count({ 
            where: { 
              ...where,
              status: 'COMPLETED'
            }
          }),
          db.invoice.count({ 
            where: { 
              ...where,
              paymentStatus: 'PAID'
            }
          })
        ])

        reportData = {
          appointments: {
            total: allAppointments,
            completed: completedAppointments
          },
          patients: {
            total: allPatients
          },
          revenue: {
            totalInvoices: paidInvoices
          },
          inventory: {
            totalItems: await db.inventoryItem.count({ where })
          }
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}