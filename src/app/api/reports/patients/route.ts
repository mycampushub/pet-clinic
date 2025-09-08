import { NextRequest, NextResponse } from 'next/server';
import { reportingService } from '@/lib/reporting';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const dateRange = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    const patientData = await reportingService.getPatientMetrics(dateRange);

    return NextResponse.json(patientData);
  } catch (error) {
    console.error('Patients report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}