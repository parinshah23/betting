'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { VerifyAnswerResponse } from '@/types/competition';

interface SkillQuestionProps {
  question: string;
  competitionId: string;
  onVerified: (answer: string) => void;
  disabled?: boolean;
}

export function SkillQuestion({ 
  question, 
  competitionId, 
  onVerified,
  disabled = false 
}: SkillQuestionProps) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'correct' | 'incorrect'>('idle');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!answer.trim()) return;

    setStatus('verifying');
    setMessage('');

    try {
      const response = await api.post<VerifyAnswerResponse>('/competitions/verify-answer', {
        competition_id: competitionId,
        answer: answer.trim()
      });

      if (response.success && (response.data?.correct || response.data?.is_correct)) {
        setStatus('correct');
        setMessage(response.data.message || 'Correct! You can now select your tickets.');
        onVerified(answer.trim());
      } else {
        setStatus('incorrect');
        setMessage(response.data?.message || 'Incorrect answer. Please try again.');
      }
    } catch (error) {
      setStatus('incorrect');
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setAnswer('');
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary-50 rounded-full shrink-0">
          <HelpCircle className="w-6 h-6 text-primary-600" />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-neutral-900">Skill Question</h3>
            <p className="text-neutral-500 text-sm mt-1">
              Answer correctly to enter the competition.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="font-medium text-neutral-900 text-lg">{question}</p>
          </div>

          {status === 'correct' ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p className="font-medium">{message}</p>
            </div>
          ) : status === 'incorrect' ? (
            <div className="space-y-3">
               <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                <XCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{message}</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="flex-1"
                disabled={disabled || status === 'verifying'}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
              <Button
                onClick={handleVerify}
                isLoading={status === 'verifying'}
                disabled={disabled || !answer.trim()}
                className="w-full sm:w-auto min-w-[120px]"
              >
                Verify Answer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
