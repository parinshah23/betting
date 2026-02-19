import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    company: [
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/winners', label: 'Winners' },
      { href: '/competitions', label: 'All Competitions' },
    ],
    support: [
      { href: '/faq', label: 'FAQ' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
    categories: [
      { href: '/competitions?category=tech', label: 'Tech & Gadgets' },
      { href: '/competitions?category=cars', label: 'Cars' },
      { href: '/competitions?category=travel', label: 'Travel' },
      { href: '/competitions?category=cash', label: 'Cash Prizes' },
    ],
  };

  const socialLinks = [
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://youtube.com', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PC</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-white">Premium</span>
                <span className="text-sm font-semibold text-accent-400">Competitions</span>
              </div>
            </Link>
            <p className="mt-6 text-gray-400 max-w-md leading-relaxed">
              Enter our exciting online competitions and win incredible prizes!
              From tech gadgets to luxury cars, your dream prize could be just a ticket away.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Premium Competitions. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center md:text-left">
            Premium Competitions is a competition platform. 18+ only. Please play responsibly.
          </p>
        </div>
      </div>
    </footer>
  );
}
