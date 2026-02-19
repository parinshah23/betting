'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Wallet } from '@/types';
import { Button } from '@/components/ui/Button';
import { OrderSummaryPanel } from '@/components/checkout/OrderSummaryPanel';
import { WalletSection } from '@/components/checkout/WalletSection';
import { StripeCardSection } from '@/components/checkout/StripeCardSection';
import { formatCurrency } from '@/lib/utils';
import { Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Fetchers
const fetchWallet = () => api.get<Wallet>('/wallet').then(res => res.data);

export default function CheckoutClient() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const { cart, isLoading: isCartLoading } = useCart();
  const { data: wallet, isLoading: isWalletLoading } = useSWR('/wallet', fetchWallet);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login?redirect=%2Fcheckout');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const [useWallet, setUseWallet] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isCartLoading || isWalletLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const walletBalance = wallet?.balance || 0;
  const walletAmountToUse = useWallet ? Math.min(walletBalance, cart.total) : 0;
  const remainingToPay = Math.max(0, cart.total - walletAmountToUse);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create Order (use snake_case for backend)
      interface CreateOrderResponse {
        order?: {
          id: string;
          order_number: string;
          total_amount: number;
        };
        requires_payment?: boolean;
        amount_to_charge?: number;
        // If wallet covers everything, order is returned directly
        id?: string;
        order_number?: string;
        total_amount?: number;
      }

      const createOrderRes = await api.post<CreateOrderResponse>('/orders/create', {
        use_wallet_balance: useWallet
      });

      if (!createOrderRes.success || !createOrderRes.data) {
        throw new Error(createOrderRes.error?.message || 'Failed to create order');
      }

      const data = createOrderRes.data;

      // Check if payment with card is required
      const requiresPayment = data.requires_payment && (data.amount_to_charge || 0) > 0;
      const orderId = data.order?.id || data.id;
      const orderNumber = data.order?.order_number || data.order_number;

      if (!orderId) {
        throw new Error('Order ID not received');
      }

      // 2. Handle Stripe Payment if needed
      if (requiresPayment) {
        // Get payment intent
        const intentRes = await api.post<{ client_secret: string; payment_intent_id: string }>('/orders/payment-intent', {
          order_id: orderId
        });

        if (!intentRes.success || !intentRes.data?.client_secret) {
          throw new Error(intentRes.error?.message || 'Failed to create payment intent');
        }

        const clientSecret = intentRes.data.client_secret;
        const paymentIntentId = intentRes.data.payment_intent_id;

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              // We could collect this, but keeping it simple for now
            }
          }
        });

        if (stripeError) {
          throw new Error(stripeError.message || 'Payment failed');
        }

        if (paymentIntent.status !== 'succeeded') {
          throw new Error(`Payment status: ${paymentIntent.status}`);
        }

        // 3. Confirm Order
        const confirmRes = await api.post<{ id: string; status: string }>('/orders/confirm', {
          order_id: orderId,
          payment_intent_id: paymentIntentId
        });

        if (!confirmRes.success) {
          throw new Error(confirmRes.error?.message || 'Order confirmation failed');
        }
      }

      // 4. Success (order was paid with wallet or Stripe payment succeeded)
      showSuccess('Order placed successfully!');
      router.push(`/checkout/success?order=${orderNumber}`);

    } catch (err: unknown) {
      console.error('Checkout error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(msg);
      showError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-semibold text-lg text-neutral-900 mb-6">Payment Method</h2>

            {/* Wallet Section */}
            <WalletSection
              wallet={wallet || null}
              useWallet={useWallet}
              onToggle={setUseWallet}
              maxUsable={cart.total}
            />

            {/* Card Section */}
            {remainingToPay > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-neutral-700">Card Details</label>
                  <span className="text-sm font-medium text-primary-600">
                    Pay {formatCurrency(remainingToPay)}
                  </span>
                </div>
                <StripeCardSection />
              </div>
            ) : (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="font-medium">Fully covered by wallet balance</p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Pay Button */}
            <Button
              size="lg"
              className="w-full mt-8"
              onClick={handlePayment}
              isLoading={isProcessing}
              disabled={isProcessing}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(remainingToPay > 0 ? remainingToPay : 0)}`}
            </Button>

            <p className="text-center text-xs text-neutral-500 mt-4">
              By placing this order, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <OrderSummaryPanel
            cart={cart}
            walletAmount={walletAmountToUse}
          />
        </div>
      </div>
    </div>
  );
}
