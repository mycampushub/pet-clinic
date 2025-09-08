import Stripe from 'stripe';
import { db } from './db';

// Use demo keys if not provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  invoiceId: string;
  metadata?: Record<string, string>;
}

export class PaymentService {
  static async createPaymentIntent(data: PaymentIntentData) {
    try {
      // For demo purposes, create a mock payment intent
      if (stripeSecretKey === 'sk_test_demo_key') {
        return {
          id: `pi_demo_${Date.now()}`,
          client_secret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
          amount: Math.round(data.amount * 100),
          currency: data.currency || 'usd',
          metadata: {
            invoiceId: data.invoiceId,
            ...data.metadata,
          },
          status: 'requires_payment_method'
        };
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        metadata: {
          invoiceId: data.invoiceId,
          ...data.metadata,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  static async confirmPayment(paymentIntentId: string) {
    try {
      // For demo purposes, simulate payment confirmation
      if (stripeSecretKey === 'sk_test_demo_key') {
        // Update invoice status in database
        const invoiceId = paymentIntentId.split('_')[2]; // Extract from demo format
        if (invoiceId) {
          await db.invoice.update({
            where: { id: invoiceId },
            data: { status: 'PAID' },
          });

          // Record payment
          await db.payment.create({
            data: {
              invoiceId,
              amount: 100, // Demo amount
              method: 'ONLINE',
              status: 'COMPLETED',
              transactionRef: paymentIntentId,
            },
          });
        }

        return {
          id: paymentIntentId,
          status: 'succeeded',
          amount: 100,
          metadata: { invoiceId }
        };
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update invoice status in database
        const invoiceId = paymentIntent.metadata.invoiceId;
        await db.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' },
        });

        // Record payment
        await db.payment.create({
          data: {
            invoiceId,
            amount: paymentIntent.amount / 100,
            method: 'ONLINE',
            status: 'COMPLETED',
            transactionRef: paymentIntent.id,
          },
        });
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  static async createRefund(paymentIntentId: string, amount?: number) {
    try {
      // For demo purposes, simulate refund creation
      if (stripeSecretKey === 'sk_test_demo_key') {
        return {
          id: `re_demo_${Date.now()}`,
          payment_intent: paymentIntentId,
          amount: amount ? Math.round(amount * 100) : 100,
          status: 'succeeded'
        };
      }

      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Failed to create refund');
    }
  }

  static async handleWebhook(signature: string, payload: Buffer) {
    try {
      // For demo purposes, simulate webhook handling
      if (stripeSecretKey === 'sk_test_demo_key') {
        console.log('Demo webhook received:', payload.toString());
        return { received: true };
      }

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;
        case 'charge.refunded':
          await this.handleRefund(event.data.object as Stripe.Charge);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw new Error('Webhook signature verification failed');
    }
  }

  private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const invoiceId = paymentIntent.metadata.invoiceId;
    
    await db.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' },
    });

    await db.payment.create({
      data: {
        invoiceId,
        amount: paymentIntent.amount / 100,
        method: 'ONLINE',
        status: 'COMPLETED',
        transactionRef: paymentIntent.id,
      },
    });
  }

  private static async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const invoiceId = paymentIntent.metadata.invoiceId;
    
    await db.payment.create({
      data: {
        invoiceId,
        amount: paymentIntent.amount / 100,
        method: 'ONLINE',
        status: 'FAILED',
        transactionRef: paymentIntent.id,
      },
    });
  }

  private static async handleRefund(charge: Stripe.Charge) {
    const paymentIntentId = charge.payment_intent as string;
    
    // Find the payment and update it
    const payment = await db.payment.findFirst({
      where: { transactionRef: paymentIntentId },
    });

    if (payment) {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      });
    }
  }
}