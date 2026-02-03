'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Competition } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
  Trophy,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  Download,
  Play,
  Eye
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface CompetitionWithStats extends Competition {
  stats: {
    total_tickets: number;
    sold_tickets: number;
    available_tickets: number;
    progress_percentage: number;
  };
}

interface DrawResult {
  winner?: {
    ticket_number?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  total_entries?: number;
}

const fetchCompetitions = () => api.get<{ competitions: CompetitionWithStats[] }>('/api/admin/competitions').then(res => res.data?.competitions);

export default function AdminCompetitionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionWithStats | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExecutingDraw, setIsExecutingDraw] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: competitions, isLoading, mutate } = useSWR('admin-competitions', fetchCompetitions, {
    refreshInterval: 30000,
  });

  // Filter competitions
  const filteredCompetitions = competitions?.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!selectedCompetition) return;

    try {
      const response = await api.delete(`/api/admin/competitions/${selectedCompetition.id}`);
      if (response.success) {
        await mutate();
        setIsDeleteModalOpen(false);
        setSelectedCompetition(null);
      } else {
        setActionError(response.error?.message || 'Failed to delete competition');
      }
    } catch (err) {
      setActionError('An error occurred while deleting');
    }
  };

  const handleDuplicate = async (comp: CompetitionWithStats) => {
    try {
      const response = await api.post(`/api/admin/competitions/${comp.id}/duplicate`, {});
      if (response.success) {
        await mutate();
      } else {
        setActionError(response.error?.message || 'Failed to duplicate competition');
      }
    } catch (err) {
      setActionError('An error occurred while duplicating');
    }
  };

  const handleExecuteDraw = async (comp: CompetitionWithStats) => {
    setIsExecutingDraw(true);
    setSelectedCompetition(comp);

    try {
      const response = await api.post<DrawResult>(`/api/admin/competitions/${comp.id}/draw`, {});
      if (response.success && response.data) {
        await mutate();
        alert(`Winner selected! Ticket #${response.data.winner?.ticket_number}`);
      } else {
        setActionError(response.error?.message || 'Failed to execute draw');
      }
    } catch (err) {
      setActionError('An error occurred during draw');
    } finally {
      setIsExecutingDraw(false);
      setSelectedCompetition(null);
    }
  };

  const handleExportEntries = (comp: CompetitionWithStats) => {
    window.open(`/api/admin/competitions/${comp.id}/entries`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Competitions
          </h1>
          <p className="text-gray-500 mt-1">Manage all competitions and draws</p>
        </div>
        <Link
          href="/admin/competitions/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Competition
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="live">Live</option>
            <option value="ended">Ended</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {/* Competitions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Competition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCompetitions?.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{comp.title}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(Number(comp.ticketPrice))} per ticket</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        comp.status === 'live' ? 'success' :
                          comp.status === 'completed' ? 'info' :
                            comp.status === 'ended' ? 'warning' : 'default'
                      }
                    >
                      {comp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{comp.stats.sold_tickets}</span>
                        <span className="text-gray-500">/ {comp.stats.total_tickets}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${comp.stats.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(comp.stats.sold_tickets * Number(comp.ticketPrice))}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {comp.endDate ? formatDate(comp.endDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/competitions/${comp.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View on site"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/competitions/${comp.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(comp)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportEntries(comp)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Export entries"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {comp.status === 'ended' && (
                        <button
                          onClick={() => handleExecuteDraw(comp)}
                          disabled={isExecutingDraw}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Execute draw"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedCompetition(comp);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCompetitions?.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No competitions found</p>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCompetition(null);
          setActionError(null);
        }}
        title="Delete Competition"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedCompetition?.title}</strong>?
          </p>
          <p className="text-sm text-red-600">
            This action cannot be undone. All tickets and entries will be permanently removed.
          </p>
          {actionError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{actionError}</p>
          )}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCompetition(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
