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

    const dashboardData = await reportingService.getDashboardSummary(dateRange);

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}