'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  amount: number;
  invoiceId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function PaymentFormComponent({ amount, invoiceId, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          invoiceId,
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        setIsProcessing(false);
        return;
      }

      // Confirm payment
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      onError?.('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-2xl font-semibold">
            Amount: ${amount.toFixed(2)}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Details</label>
            <div className="p-3 border rounded-md">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormComponent {...props} />
    </Elements>
  );
}