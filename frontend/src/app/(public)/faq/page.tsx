'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do competitions work?',
    answer: 'Our competitions are skill-based contests where you purchase tickets for a chance to win amazing prizes. Each competition has a limited number of tickets available. Once all tickets are sold or the competition ends, a winner is randomly selected from all valid entries.',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'How do I enter a competition?',
    answer: 'Simply browse our live competitions, select the one you want to enter, choose how many tickets you\'d like to purchase, answer the skill question correctly, and proceed to checkout. Once your payment is confirmed, your tickets are allocated.',
  },
  {
    id: '3',
    category: 'Getting Started',
    question: 'Is there an age requirement?',
    answer: 'Yes, you must be at least 18 years old to enter our competitions. We may request age verification for winners before prizes are awarded.',
  },
  {
    id: '4',
    category: 'Tickets & Entries',
    question: 'How many tickets can I buy?',
    answer: 'Each competition has a maximum ticket limit per user, which is clearly displayed on the competition page. This ensures fair chances for all participants.',
  },
  {
    id: '5',
    category: 'Tickets & Entries',
    question: 'What is a skill question?',
    answer: 'A skill question is a simple question that must be answered correctly to validate your entry. This ensures our competitions comply with gambling regulations and require an element of skill.',
  },
  {
    id: '6',
    category: 'Tickets & Entries',
    question: 'Can I get a refund on my tickets?',
    answer: 'Generally, ticket purchases are final once the competition draw has taken place. However, if a competition is cancelled by us, you will receive a full refund to your wallet or original payment method.',
  },
  {
    id: '7',
    category: 'Payment & Wallet',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe payment processor. You can also use funds from your wallet.',
  },
  {
    id: '8',
    category: 'Payment & Wallet',
    question: 'How does the wallet work?',
    answer: 'Your wallet is a secure account balance that you can use to purchase tickets. You can add funds via card payment, receive cashback from purchases, and get refunds if competitions are cancelled.',
  },
  {
    id: '9',
    category: 'Payment & Wallet',
    question: 'Is there a cashback program?',
    answer: 'Yes! We offer 5% cashback on every ticket purchase. The cashback is automatically added to your wallet and can be used for future ticket purchases.',
  },
  {
    id: '10',
    category: 'Winners & Prizes',
    question: 'How are winners selected?',
    answer: 'Winners are selected using a certified random number generator after the competition ends or sells out. The draw is fair and completely random from all valid entries.',
  },
  {
    id: '11',
    category: 'Winners & Prizes',
    question: 'How do I know if I\'ve won?',
    answer: 'Winners are notified via email immediately after the draw. You can also check the Winners Gallery page and your "My Wins" section in your account dashboard.',
  },
  {
    id: '12',
    category: 'Winners & Prizes',
    question: 'How do I claim my prize?',
    answer: 'If you win, you\'ll receive instructions via email on how to claim your prize. You must claim within 30 days of winning. Physical prizes are shipped to your registered address.',
  },
  {
    id: '13',
    category: 'Winners & Prizes',
    question: 'Are prizes transferable?',
    answer: 'Most prizes can be transferred to friends or family. However, some specific prizes (like personalized items or travel experiences) may not be transferable. Check the competition terms for details.',
  },
  {
    id: '14',
    category: 'Account & Security',
    question: 'Is my personal information secure?',
    answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. We never share your information with third parties without your consent.',
  },
  {
    id: '15',
    category: 'Account & Security',
    question: 'How do I close my account?',
    answer: 'To close your account, please contact our support team. Note that you must have no active tickets or pending withdrawals before we can process your account closure.',
  },
];

const categories = Array.from(new Set(faqData.map(item => item.category)));

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // Filter FAQs
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Group by category
  const groupedFAQs = filteredFAQs.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Help Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about our competitions, tickets, and prizes.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'w-full text-left px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedCategory === null
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  All Questions
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      'w-full text-left px-4 py-2 rounded-lg font-medium transition-colors',
                      selectedCategory === category
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                <h4 className="font-semibold text-primary-900 mb-2">Still have questions?</h4>
                <p className="text-sm text-primary-700 mb-4">
                  Can&apos;t find what you&apos;re looking for? Contact our support team.
                </p>
                <Link
                  href="mailto:support@example.com"
                  className="inline-flex items-center text-primary-700 hover:text-primary-800 font-medium text-sm"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {Object.keys(groupedFAQs).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedFAQs).map(([category, items]) => (
                  <div key={category}>
                    {selectedCategory === null && (
                      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary-600" />
                        {category}
                      </h2>
                    )}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">
                              {item.question}
                            </span>
                            {openItems.has(item.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {openItems.has(item.id) && (
                            <div className="px-5 pb-5">
                              <p className="text-gray-600 leading-relaxed">
                                {item.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No questions found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or browse all categories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our friendly support team is here to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="mailto:support@example.com"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Support
            </Link>
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
