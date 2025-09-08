import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, invoiceId, metadata } = body;

    if (!amount || !invoiceId) {
      return NextResponse.json(
        { error: 'Amount and invoice ID are required' },
        { status: 400 }
      );
    }

    const paymentIntent = await PaymentService.createPaymentIntent({
      amount,
      currency: currency || 'usd',
      invoiceId,
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}