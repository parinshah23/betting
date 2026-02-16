'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { WalletTransaction } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  CreditCard,
  PiggyBank,
  Gift,
  History,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDate, formatCurrency, cn, formatDistanceToNow } from '@/lib/utils';
import useSWR from 'swr';
import toast from 'react-hot-toast';

// Backend returns snake_case, frontend expects camelCase
interface BackendWallet {
  id: string;
  balance: number;
  created_at?: string;
  updated_at?: string;
}

interface BackendTransaction {
  id: string;
  type: 'deposit' | 'spend' | 'cashback' | 'refund' | 'admin_credit' | 'admin_debit';
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

const walletFetcher = (url: string) => api.get<BackendWallet>(url).then(res => {
  if (res.success && res.data) {
    return res.data;
  }
  throw new Error('Failed to fetch wallet');
});

const transactionsFetcher = (url: string) => api.get<BackendTransaction[]>(url).then(res => {
  if (res.success && res.data) {
    // Map snake_case to camelCase
    return res.data.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      balanceAfter: t.balance_after,
      description: t.description,
      createdAt: t.created_at,
    })) as WalletTransaction[];
  }
  throw new Error('Failed to fetch transactions');
});

const DEPOSIT_AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function WalletPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const { data: wallet, error: walletError, isLoading: walletLoading, mutate: mutateWallet } = useSWR(
    '/wallet',
    walletFetcher,
    {
      refreshInterval: 30000,
    }
  );

  const { data: transactions, error: transactionsError, isLoading: transactionsLoading, mutate: mutateTransactions } = useSWR(
    '/wallet/transactions',
    transactionsFetcher,
    {
      refreshInterval: 30000,
    }
  );

  const isLoading = walletLoading || transactionsLoading;
  const error = walletError || transactionsError;

  const mutate = () => {
    mutateWallet();
    mutateTransactions();
  };

  const handleDeposit = async () => {
    const amount = selectedAmount || parseFloat(customAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > 10000) {
      toast.error('Maximum deposit amount is £10,000');
      return;
    }

    setIsDepositing(true);

    try {
      const response = await api.post<{ clientSecret: string; publishableKey: string }>('/wallet/deposit', {
        amount,
      });

      if (response.success && response.data) {
        const { clientSecret, publishableKey } = response.data;

        const { loadStripe } = await import('@stripe/stripe-js');
        const stripe = await loadStripe(
          publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
        );

        if (!stripe) {
          toast.error('Payment system failed to load. Please try again.');
          return;
        }

        // Use Stripe's confirmCardPayment with redirect
        // For a simpler flow, we redirect to a payment confirmation page
        toast.success('Payment initiated! Redirecting to payment...');

        // Redirect to Stripe's hosted payment page
        const { error: confirmError } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/wallet?deposit=success`,
          },
        });

        if (confirmError) {
          // Will only reach here if there's an immediate error
          // (e.g., if the PaymentIntent is already confirmed)
          toast.error(confirmError.message || 'Payment failed. Please try again.');
        } else {
          // User will not reach here - they'll be redirected
          toast.success('Deposit successful! Your wallet has been credited.');
          await mutate();
          setSelectedAmount(null);
          setCustomAmount('');
        }
      } else {
        toast.error(response.error?.message || 'Failed to initiate deposit');
      }
    } catch (err) {
      console.error('Deposit failed:', err);
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsDepositing(false);
    }
  };

  // Calculate stats
  const totalDeposited = transactions
    ?.filter((t: WalletTransaction) => t.type === 'deposit')
    .reduce((acc: number, t: WalletTransaction) => acc + t.amount, 0) || 0;

  const totalSpent = transactions
    ?.filter((t: WalletTransaction) => t.type === 'spend')
    .reduce((acc: number, t: WalletTransaction) => acc + Math.abs(t.amount), 0) || 0;

  const totalCashback = transactions
    ?.filter((t: WalletTransaction) => t.type === 'cashback')
    .reduce((acc: number, t: WalletTransaction) => acc + t.amount, 0) || 0;

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions?.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load wallet</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          My Wallet
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your funds and view transaction history
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-primary-100 text-sm font-medium mb-1">Available Balance</p>
            <p className="text-4xl md:text-5xl font-bold">
              {formatCurrency(wallet?.balance || 0)}
            </p>
            <p className="text-primary-200 text-sm mt-2">
              Last updated {formatDistanceToNow(new Date().toISOString())}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="bg-white text-primary-700 hover:bg-primary-50"
              onClick={() => document.getElementById('deposit-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-primary-600"
              onClick={() => mutate()}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Deposited</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalDeposited)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cashback Earned</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(totalCashback)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <div id="deposit-section" className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Add Funds
          </h2>

          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Choose an amount to deposit into your wallet
            </p>

            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {DEPOSIT_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount('');
                  }}
                  className={cn(
                    'px-4 py-3 rounded-lg border-2 font-semibold transition-all',
                    selectedAmount === amount
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 text-gray-700'
                  )}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or enter custom amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={(!selectedAmount && !customAmount) || isDepositing}
              onClick={handleDeposit}
            >
              {isDepositing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Deposit {selectedAmount ? formatCurrency(selectedAmount) : customAmount ? formatCurrency(parseFloat(customAmount)) : ''}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Secure payments powered by Stripe
            </p>
          </Card>

          {/* Cashback Info */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">Cashback Program</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Earn 5% cashback on every ticket purchase! Cashback is automatically added to your wallet.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </h2>
            {transactions && transactions.length > 5 && (
              <button
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                {showAllTransactions ? (
                  <>
                    Show Less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View All <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          <Card className="divide-y divide-gray-100">
            {displayedTransactions && displayedTransactions.length > 0 ? (
              displayedTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="p-8 text-center">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your transaction history will appear here
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

interface TransactionItemProps {
  transaction: WalletTransaction;
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const isPositive = transaction.amount > 0;

  const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    deposit: { icon: <Plus className="w-4 h-4" />, label: 'Deposit', color: 'text-green-600' },
    spend: { icon: <ArrowUpRight className="w-4 h-4" />, label: 'Purchase', color: 'text-red-600' },
    cashback: { icon: <Gift className="w-4 h-4" />, label: 'Cashback', color: 'text-yellow-600' },
    refund: { icon: <ArrowDownRight className="w-4 h-4" />, label: 'Refund', color: 'text-blue-600' },
    admin_credit: { icon: <Plus className="w-4 h-4" />, label: 'Credit', color: 'text-green-600' },
    admin_debit: { icon: <ArrowUpRight className="w-4 h-4" />, label: 'Debit', color: 'text-red-600' },
  };

  const config = typeConfig[transaction.type] || typeConfig.deposit;

  return (
    <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center bg-gray-100', config.color)}>
          {config.icon}
        </div>
        <div>
          <p className="font-medium text-gray-900">{config.label}</p>
          <p className="text-sm text-gray-500">{transaction.description}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn('font-semibold', isPositive ? 'text-green-600' : 'text-gray-900')}>
          {isPositive ? '+' : ''}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-500">
          Balance: {formatCurrency(transaction.balanceAfter)}
        </p>
      </div>
    </div>
  );
}
