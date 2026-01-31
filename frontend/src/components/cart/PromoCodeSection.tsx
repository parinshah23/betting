'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tag, X, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PromoCodeSectionProps {
  appliedCode?: {
    code: string;
    savings: number;
  };
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => Promise<void>;
}

export function PromoCodeSection({ appliedCode, onApply, onRemove }: PromoCodeSectionProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await onApply(code);
      if (success) {
        setCode('');
      } else {
        setError('Invalid promo code');
      }
    } catch {
      setError('Failed to apply code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await onRemove();
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-700">
          <Tag className="w-4 h-4" />
          <span className="font-medium">{appliedCode.code}</span>
          <span className="text-sm">(-{formatCurrency(appliedCode.savings)})</span>
        </div>
        <button 
          onClick={handleRemove}
          disabled={isLoading}
          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Promo code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          error={error}
        />
        <Button 
          variant="secondary" 
          onClick={handleApply}
          isLoading={isLoading}
          disabled={!code.trim()}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
