'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Trophy, Ticket } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900">Payment Successful!</h1>
          <p className="text-neutral-600">
            Thank you for your purchase. Your order has been confirmed and your tickets have been allocated.
          </p>
          {orderNumber && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 inline-block">
              <span className="text-neutral-500 text-sm block mb-1">Order Reference</span>
              <span className="font-mono font-medium text-lg">{orderNumber}</span>
            </div>
          )}
        </div>

        <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 text-left space-y-4">
          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-lg text-primary-600 shadow-sm">
               <Ticket className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-semibold text-neutral-900">View Your Tickets</h3>
               <p className="text-sm text-neutral-600">
                 Your ticket numbers are available in your dashboard and have been emailed to you.
               </p>
             </div>
          </div>

          <div className="flex items-start gap-3">
             <div className="p-2 bg-white rounded-lg text-amber-500 shadow-sm">
               <Trophy className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-semibold text-neutral-900">Instant Wins</h3>
               <p className="text-sm text-neutral-600">
                 If you won any instant prizes, they will appear in your &quot;My Wins&quot; section immediately.
               </p>
             </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button href="/dashboard" size="lg" className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
          <Button href="/competitions" variant="outline" size="lg" className="w-full sm:w-auto">
            Browse More
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
