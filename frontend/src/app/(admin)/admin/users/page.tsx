'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
  Users,
  Search,
  Ban,
  Wallet
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import useSWR from 'swr';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: string;
  email_verified: boolean;
  is_banned: boolean;
  created_at: string;
}

const fetchUsers = () => api.get<{ data: User[] }>('/api/admin/users').then(res => res.data?.data);

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: users, isLoading, mutate } = useSWR('admin-users', fetchUsers);

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleBan = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.post(`/api/admin/users/${selectedUser.id}/ban`, {
        is_banned: !selectedUser.is_banned
      });
      if (response.success) {
        await mutate();
        setIsBanModalOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      setActionError('Failed to update user status');
    }
  };

  const handleAdjustWallet = async () => {
    if (!selectedUser || !walletAmount) return;

    try {
      const response = await api.post(`/api/admin/users/${selectedUser.id}/wallet`, {
        amount: parseFloat(walletAmount),
        description: 'Admin adjustment'
      });
      if (response.success) {
        await mutate();
        setIsWalletModalOpen(false);
        setWalletAmount('');
        setSelectedUser(null);
      }
    } catch (err) {
      setActionError('Failed to adjust wallet');
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
            <Users className="w-6 h-6" />
            Users
          </h1>
          <p className="text-gray-500 mt-1">Manage user accounts and wallets</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_banned ? (
                      <Badge variant="danger">Banned</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsWalletModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Adjust wallet"
                      >
                        <Wallet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsBanModalOpen(true);
                        }}
                        className={`p-2 rounded-lg transition-colors ${user.is_banned
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-red-600 hover:bg-red-50'
                          }`}
                        title={user.is_banned ? 'Unban user' : 'Ban user'}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ban Modal */}
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        title={selectedUser?.is_banned ? 'Unban User' : 'Ban User'}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to {selectedUser?.is_banned ? 'unban' : 'ban'}{' '}
            <strong>{selectedUser?.email}</strong>?
          </p>
          {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsBanModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleToggleBan}
              className={`flex-1 px-4 py-2 rounded-lg text-white ${selectedUser?.is_banned
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
                }`}
            >
              {selectedUser?.is_banned ? 'Unban' : 'Ban'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Wallet Modal */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => {
          setIsWalletModalOpen(false);
          setWalletAmount('');
        }}
        title="Adjust Wallet Balance"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Adjusting wallet for <strong>{selectedUser?.email}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (use negative for debit)
            </label>
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setIsWalletModalOpen(false);
                setWalletAmount('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdjustWallet}
              disabled={!walletAmount}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              Adjust
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
