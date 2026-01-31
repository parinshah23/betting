'use client';

import { Wallet } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Wallet as WalletIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/Select';

interface WalletSectionProps {
  wallet: Wallet | null;
  useWallet: boolean;
  onToggle: (use: boolean) => void;
  maxUsable: number;
}

export function WalletSection({ wallet, useWallet, onToggle, maxUsable }: WalletSectionProps) {
  if (!wallet || wallet.balance <= 0) return null;

  return (
    <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
          <WalletIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-neutral-900">Wallet Balance</h3>
          <p className="text-sm text-neutral-500 mb-2">
            Available: {formatCurrency(wallet.balance)}
          </p>
          
          <div className="mt-2">
            <Checkbox 
              label={`Use ${formatCurrency(Math.min(wallet.balance, maxUsable))} from wallet`}
              checked={useWallet}
              onChange={(e) => onToggle(e.target.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
