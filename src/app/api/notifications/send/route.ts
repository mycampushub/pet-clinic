import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message, type, template, data } = body;

    if (!to || !message || !type) {
      return NextResponse.json(
        { error: 'Recipient, message, and type are required' },
        { status: 400 }
      );
    }

    if (!['EMAIL', 'SMS'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be EMAIL or SMS' },
        { status: 400 }
      );
    }

    const result = await notificationService.sendNotification({
      to,
      subject: subject || '',
      message,
      type: type as 'EMAIL' | 'SMS',
      template,
      data,
    });

    if (result) {
      return NextResponse.json({ success: true, message: 'Notification sent successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Notification send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}