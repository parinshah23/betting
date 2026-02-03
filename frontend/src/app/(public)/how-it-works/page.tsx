'use client';

import React from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  Ticket,
  CheckCircle,
  CreditCard,
  Trophy,
  Gift,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users
} from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Choose a Competition',
    description: 'Browse our wide selection of competitions featuring amazing prizes like cars, tech, holidays, and cash. Each competition has detailed information about the prize, ticket price, and odds of winning.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Ticket,
    title: '2. Buy Tickets',
    description: 'Select how many tickets you want to purchase. The more tickets you buy, the better your chances of winning! Each competition has a maximum ticket limit per person to ensure fairness.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: CheckCircle,
    title: '3. Answer the Skill Question',
    description: 'To comply with competition regulations, you\'ll need to answer a simple skill question correctly. This validates your entry and ensures our competitions are skill-based.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: CreditCard,
    title: '4. Complete Payment',
    description: 'Pay securely using your credit/debit card or wallet funds. We use Stripe for secure payment processing. You\'ll receive an email confirmation with your ticket numbers.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Clock,
    title: '5. Wait for the Draw',
    description: 'Once all tickets are sold or the competition timer ends, we\'ll conduct the draw using a certified random number generator. Watch live or check back for results!',
    color: 'bg-accent-100 text-accent-600',
  },
  {
    icon: Trophy,
    title: '6. Win Amazing Prizes!',
    description: 'If you\'re the lucky winner, we\'ll notify you immediately via email. Claim your prize within 30 days and we\'ll arrange delivery or transfer of your winnings.',
    color: 'bg-red-100 text-red-600',
  },
];

const features = [
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'We use bank-level encryption and secure payment processing to protect your data and transactions.',
  },
  {
    icon: Users,
    title: 'Fair Draws',
    description: 'All winners are selected using certified random number generators, ensuring complete fairness and transparency.',
  },
  {
    icon: Gift,
    title: '5% Cashback',
    description: 'Earn 5% cashback on every ticket purchase! Use your cashback to enter more competitions for free.',
  },
  {
    icon: Star,
    title: 'Amazing Prizes',
    description: 'From luxury cars and dream holidays to the latest tech and cash jackpots, our prizes are life-changing.',
  },
];

const faqs = [
  {
    question: 'Is this gambling?',
    answer: 'No, our competitions are skill-based contests. You must answer a skill question correctly to validate your entry, which makes them games of skill rather than gambling.',
  },
  {
    question: 'How are winners chosen?',
    answer: 'Winners are selected using a certified random number generator after the competition ends or sells out. The process is completely random and fair, selecting from all valid entries.',
  },
  {
    question: 'What happens if a competition doesn\'t sell out?',
    answer: 'Each competition has an end date. Whether it sells out or reaches the end date, the draw will still take place. Your chances of winning remain the same regardless of total ticket sales.',
  },
  {
    question: 'How do I receive my prize?',
    answer: 'Physical prizes are delivered to your registered address. Cash prizes are transferred to your wallet or bank account. You\'ll receive detailed instructions when you win.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-accent-400" />
              <span className="text-sm font-medium">Simple & Fair</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">How It </span>
              <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">Works</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Entering our competitions is quick, easy, and secure.
              Follow these simple steps for your chance to win amazing prizes!
            </p>
            <Link
              href="/competitions"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-accent-500/25 transition-all hover:scale-105"
            >
              Browse Competitions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Steps Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              6 Simple Steps to Win
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our process is designed to be straightforward and transparent.
              From choosing your competition to claiming your prize, we&apos;ve made it easy.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing the best competition experience with
              fairness, security, and amazing prizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We&apos;ve got answers!
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    Q
                  </span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All FAQs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Premium CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Ready to </span>
              <span className="bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">Win?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of winners and get your chance to win life-changing prizes today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/competitions"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-accent-500/25 transition-all hover:scale-105"
              >
                Start Winning
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 rounded-xl font-bold text-lg backdrop-blur-sm transition-all"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="text-sm">10,000+ Winners</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">Verified Draws</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
