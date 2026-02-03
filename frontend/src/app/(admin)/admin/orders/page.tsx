'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
  ShoppingCart,
  Search,
  RefreshCcw
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import useSWR from 'swr';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  wallet_amount_used: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  items: Array<{
    competition_title: string;
    quantity: number;
    unit_price: number;
  }>;
}

const fetchOrders = () => api.get<{ data: Order[] }>('/api/admin/orders').then(res => res.data?.data);

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: orders, isLoading, mutate } = useSWR('admin-orders', fetchOrders);

  const filteredOrders = orders?.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRefund = async () => {
    if (!selectedOrder) return;

    try {
      const response = await api.post(`/api/admin/orders/${selectedOrder.id}/refund`, {
        reason: refundReason
      });
      if (response.success) {
        await mutate();
        setIsRefundModalOpen(false);
        setSelectedOrder(null);
        setRefundReason('');
      }
    } catch (err) {
      setActionError('Failed to process refund');
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Orders
          </h1>
          <p className="text-gray-500 mt-1">View and manage orders</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
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
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">#{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.first_name} {order.last_name}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        order.status === 'paid' ? 'success' :
                          order.status === 'refunded' ? 'info' : 'warning'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{formatCurrency(Number(order.total_amount))}</p>
                    {order.wallet_amount_used > 0 && (
                      <p className="text-xs text-gray-500">
                        {formatCurrency(order.wallet_amount_used)} from wallet
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {order.status === 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsRefundModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Refund order"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setRefundReason('');
        }}
        title="Refund Order"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Refund order <strong>#{selectedOrder?.order_number}</strong> for{' '}
            <strong>{formatCurrency(Number(selectedOrder?.total_amount))}</strong>?
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for refund
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter refund reason..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
          </div>
          {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsRefundModalOpen(false);
                setRefundReason('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRefund}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Refund
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
