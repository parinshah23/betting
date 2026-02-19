'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
  Ticket,
  Play,
  Download,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface Competition {
  id: string;
  title: string;
  status: string;
  end_date: string;
  total_tickets: number;
  sold_tickets: number;
  ticket_price: number;
}

const fetchReadyCompetitions = () => api.get<{ competitions: Competition[] }>('/admin/competitions?status=ended').then(res => res.data?.competitions);

interface DrawResult {
  winner?: {
    ticket_number?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  total_entries?: number;
}

export default function AdminDrawsPage() {
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);

  const { data: competitions, isLoading, mutate } = useSWR('admin-ready-draws', fetchReadyCompetitions);

  const handleExecuteDraw = async () => {
    if (!selectedCompetition) return;

    setIsExecuting(true);
    try {
      const response = await api.post(`/admin/competitions/${selectedCompetition.id}/draw`, {});
      if (response.success) {
        setDrawResult(response.data as DrawResult);
        await mutate();
      }
    } catch (err) {
      console.error('Draw failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExport = async (comp: Competition) => {
    try {
      const response = await api.get(`/admin/competitions/${comp.id}/entries`);
      if (response.success && response.data) {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${comp.title.replace(/\s+/g, '-')}-entries.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      console.error('Failed to export entries');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const readyCompetitions = competitions?.filter(c => c.status === 'ended') || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Draws
          </h1>
          <p className="text-gray-500 mt-1">Execute draws and export entries</p>
        </div>
      </div>

      {readyCompetitions.length === 0 ? (
        <Card className="p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No draws ready</h3>
          <p className="text-gray-500">There are no competitions ready for drawing at this time.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {readyCompetitions.map((comp) => (
            <Card key={comp.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{comp.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{comp.sold_tickets} / {comp.total_tickets} tickets sold</span>
                    <span>Ended: {formatDate(comp.end_date)}</span>
                    <span>Revenue: {formatCurrency(Number(comp.ticket_price) * comp.sold_tickets)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(comp)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Entries
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCompetition(comp);
                      setIsDrawModalOpen(true);
                      setDrawResult(null);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute Draw
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Draw Modal */}
      <Modal
        isOpen={isDrawModalOpen}
        onClose={() => {
          setIsDrawModalOpen(false);
          setSelectedCompetition(null);
          setDrawResult(null);
        }}
        title="Execute Draw"
      >
        <div className="space-y-4">
          {!drawResult ? (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Important</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      You are about to execute the draw for <strong>{selectedCompetition?.title}</strong>.
                      This will randomly select a winner from {selectedCompetition?.sold_tickets} entries.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDrawModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isExecuting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteDraw}
                  disabled={isExecuting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isExecuting ? 'Drawing...' : 'Execute Draw'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-bold text-green-900 text-lg">Winner Selected!</p>
                    <p className="text-sm text-green-700">
                      Ticket #{drawResult?.winner?.ticket_number?.toString().padStart(6, '0')}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Winner:</strong> {drawResult?.winner?.first_name} {drawResult?.winner?.last_name}</p>
                  <p><strong>Email:</strong> {drawResult?.winner?.email}</p>
                  <p><strong>Total Entries:</strong> {drawResult?.total_entries}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDrawModalOpen(false);
                  setSelectedCompetition(null);
                  setDrawResult(null);
                }}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Close
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
