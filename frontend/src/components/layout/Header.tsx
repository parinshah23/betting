'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Ticket,
  Wallet,
  ChevronDown
} from 'lucide-react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { href: '/competitions', label: 'Competitions' },
    { href: '/winners', label: 'Winners' },
    { href: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="bg-black/95 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[5rem] py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/Logo-removebg-preview.png"
              alt="Premium Competitions Logo"
              width={250}
              height={64}
              className="h-20 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(13,133,216,0.3)]"
              priority
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xl font-bold text-white">Premium</span>
              <span className="text-sm font-semibold text-[#3ACBE8] -mt-0.5">Competitions</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-white/60 hover:text-white transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <Badge variant="danger" className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0">
                  {itemCount > 9 ? '9+' : itemCount}
                </Badge>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-white/60 hover:text-white transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden sm:block font-medium">{user?.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-black border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="font-medium text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-white/40">{user?.email}</p>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/my-tickets" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <Ticket className="w-4 h-4" /> My Tickets
                    </Link>
                    <Link href="/wallet" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <Wallet className="w-4 h-4" /> Wallet
                    </Link>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button
                        onClick={() => { logout(); setIsUserMenuOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">Login</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-[#0D85D8] to-[#0041C7] border-0 shadow-[0_0_12px_rgba(13,133,216,0.3)]">Sign Up</Button>
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/60 hover:text-white font-medium py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#0D85D8] to-[#0041C7] border-0">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
