'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  Wallet, 
  User, 
  Trophy, 
  History,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/my-tickets', label: 'Active Tickets', icon: Ticket },
    { href: '/my-tickets/history', label: 'Ticket History', icon: History },
    { href: '/my-wins', label: 'My Wins', icon: Trophy },
    { href: '/wallet', label: 'Wallet', icon: Wallet },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-100 min-h-full">
      <nav className="flex flex-col p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
              {link.label}
            </Link>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
