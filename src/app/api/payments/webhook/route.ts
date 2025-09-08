import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')!;
    const payload = await request.text();

    await PaymentService.handleWebhook(signature, Buffer.from(payload));

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}