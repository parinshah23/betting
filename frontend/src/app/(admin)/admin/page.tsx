'use client';

import React from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  Users,
  Trophy,
  ShoppingCart,
  Ticket,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Plus,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import useSWR from 'swr';

interface AdminStats {
  totalUsers: number;
  totalCompetitions: number;
  liveCompetitions: number;
  totalOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  pendingOrders: number;
  recentUsers: number;
  recentTickets: number;
  userGrowth: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'ticket' | 'competition';
  description: string;
  amount?: number;
  createdAt: string;
  status?: string;
}

interface TopCompetition {
  id: string;
  title: string;
  soldTickets: number;
  totalTickets: number;
  revenue: number;
  endDate: string;
}

const fetchStats = () => api.get<{ stats: AdminStats }>('/api/admin/stats').then(res => res.data?.stats);
const fetchActivity = () => api.get<{ activities: RecentActivity[] }>('/api/admin/activity').then(res => res.data?.activities);
const fetchTopCompetitions = () => api.get<{ competitions: TopCompetition[] }>('/api/admin/top-competitions').then(res => res.data?.competitions);

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useSWR('admin-stats', fetchStats, { refreshInterval: 30000 });
  const { data: activities } = useSWR('admin-activity', fetchActivity, { refreshInterval: 60000 });
  const { data: topCompetitions } = useSWR('admin-top-competitions', fetchTopCompetitions, { refreshInterval: 60000 });

  if (statsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome to your admin panel</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/competitions/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Competition
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          href="/admin/competitions"
          icon={Trophy}
          label="Competitions"
          count={stats?.liveCompetitions || 0}
          sublabel="Live now"
        />
        <QuickActionCard
          href="/admin/users"
          icon={Users}
          label="Users"
          count={stats?.totalUsers || 0}
          sublabel="Total"
        />
        <QuickActionCard
          href="/admin/orders"
          icon={ShoppingCart}
          label="Orders"
          count={stats?.pendingOrders || 0}
          sublabel="Pending"
          highlight
        />
        <QuickActionCard
          href="/admin/draws"
          icon={Ticket}
          label="Ready to Draw"
          count={0}
          sublabel="Competitions"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change={stats?.revenueGrowth}
          icon={DollarSign}
          trend={stats?.revenueGrowth && stats.revenueGrowth > 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats?.todayRevenue || 0)}
          icon={TrendingUp}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders?.toString() || '0'}
          icon={ShoppingCart}
        />
        <StatCard
          title="New Users (7d)"
          value={stats?.recentUsers?.toString() || '0'}
          change={stats?.userGrowth}
          icon={Users}
          trend={stats?.userGrowth && stats.userGrowth > 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                Recent Activity
              </h2>
              <Link href="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {activities && activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No recent activity
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Top Competitions */}
        <div>
          <Card>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary-600" />
                Top Competitions
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {topCompetitions && topCompetitions.length > 0 ? (
                topCompetitions.map((comp) => (
                  <div key={comp.id} className="p-4">
                    <p className="font-medium text-gray-900 truncate">{comp.title}</p>
                    <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                      <span>{comp.soldTickets}/{comp.totalTickets} tickets</span>
                      <span className="font-medium text-green-600">{formatCurrency(comp.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(comp.soldTickets / comp.totalTickets) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No competitions yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Alerts Section */}
      <Card className="border-yellow-300 bg-yellow-50">
        <div className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Action Required</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You have {stats?.pendingOrders || 0} pending orders that need processing.
              <Link href="/admin/orders" className="font-medium underline ml-1">
                Review now
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface QuickActionCardProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  sublabel: string;
  highlight?: boolean;
}

function QuickActionCard({ href, icon: Icon, label, count, sublabel, highlight }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={`block p-4 rounded-xl border transition-all hover:shadow-md ${highlight
          ? 'bg-red-50 border-red-200 hover:border-red-300'
          : 'bg-white border-gray-200 hover:border-primary-300'
        }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
          }`}>
          <Icon className="w-5 h-5" />
        </div>
        {highlight && count > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full">
            {count}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
    </Link>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
}

function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </Card>
  );
}

interface ActivityItemProps {
  activity: RecentActivity;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const typeConfig = {
    order: { icon: ShoppingCart, color: 'bg-blue-100 text-blue-600', label: 'Order' },
    user: { icon: Users, color: 'bg-green-100 text-green-600', label: 'User' },
    ticket: { icon: Ticket, color: 'bg-purple-100 text-purple-600', label: 'Ticket' },
    competition: { icon: Trophy, color: 'bg-yellow-100 text-yellow-600', label: 'Competition' },
  };

  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500">{formatDate(activity.createdAt)}</p>
      </div>
      {activity.amount && (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(activity.amount)}
        </span>
      )}
      {activity.status && (
        <Badge
          variant={
            activity.status === 'completed' ? 'success' :
              activity.status === 'pending' ? 'warning' : 'default'
          }
          size="sm"
        >
          {activity.status}
        </Badge>
      )}
    </div>
  );
}
