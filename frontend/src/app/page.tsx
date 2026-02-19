'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CompetitionGrid } from '@/components/competition';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { api } from '@/lib/api';
import type { Competition } from '@/types';
import {
  Trophy,
  Gift,
  Users,
  ArrowRight,
  Search,
  Shield,
  Truck,
  Award,
  Sparkles,
  Crown,
  Star,
  Zap,
  CheckCircle2
} from 'lucide-react';

const fetcher = <T,>(url: string): Promise<T> => api.get<T>(url).then((res) => res.data as T);

interface FeaturedCompetition {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  shortDescription?: string;
  prize_value?: number | string;
  prizeValue?: number | string;
  ticket_price?: number | string;
  ticketPrice?: number | string;
  primary_image?: string;
  primaryImage?: string;
  end_date?: string;
  endDate?: string;
}

interface Winner {
  id: string;
  display_name?: string;
  displayName?: string;
  prize_name?: string;
  prizeName?: string;
  prize_image?: string;
  prizeImage?: string;
  won_date?: string;
  wonDate?: string;
}

export default function HomePage() {
  const { data: featured } = useSWR<FeaturedCompetition[]>('/competitions/featured', fetcher);
  const { data: liveCompetitions } = useSWR<Competition[]>('/competitions?status=live&limit=8', fetcher);
  const { data: endingSoon } = useSWR<Competition[]>('/competitions?status=live&ending_soon=true&limit=4', fetcher);
  const { data: winners } = useSWR<Winner[]>('/winners/recent?limit=8', fetcher);

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900" />

        {/* Animated particles/orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">Trusted by 50,000+ winners across the UK</span>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>

            {/* Main heading with gradient */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Win </span>
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Life-Changing</span>
              <br />
              <span className="text-white">Prizes Today</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              From luxury cars to dream holidays, your next big win is just
              <span className="text-accent-400 font-semibold"> one ticket </span>
              away. Enter now and change your life.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/competitions">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-8 py-4 text-lg font-semibold shadow-xl shadow-accent-500/25 hover:shadow-accent-500/40 transition-all duration-300 hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Enter Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
                >
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Licensed & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-sm">Guaranteed Winners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Featured Competitions - Premium Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">FEATURED</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              This Week&apos;s <span className="text-primary-600">Hottest</span> Prizes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don&apos;t miss out on these incredible opportunities to win big
            </p>
          </div>

          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featured.slice(0, 3).map((comp, index) => {
                const shortDesc = comp.short_description || comp.shortDescription || '';
                const prizeVal = Number(comp.prize_value || comp.prizeValue || 0);
                const ticketPrice = Number(comp.ticket_price || comp.ticketPrice || 0);
                const endDt = comp.end_date || comp.endDate || new Date().toISOString();
                const isHighlight = index === 1;

                return (
                  <div
                    key={comp.id}
                    className={`relative group ${isHighlight ? 'lg:-mt-4 lg:mb-4' : ''}`}
                  >
                    {/* Glow effect for highlighted card */}
                    {isHighlight && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                    )}

                    <div className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500
                      ${isHighlight
                        ? 'ring-2 ring-accent-500 shadow-2xl shadow-accent-500/20'
                        : 'shadow-xl hover:shadow-2xl'
                      } group-hover:-translate-y-2`}
                    >
                      {/* Badge */}
                      {index === 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-sm font-semibold shadow-lg">
                            <Crown className="w-3 h-3" /> Top Pick
                          </span>
                        </div>
                      )}
                      {isHighlight && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-semibold shadow-lg">
                            <Sparkles className="w-3 h-3" /> Most Popular
                          </span>
                        </div>
                      )}

                      {/* Image placeholder with gradient */}
                      <div className="relative h-56 bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                            <Gift className="w-12 h-12 text-primary-400" />
                          </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary-200/50 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-200/50 rounded-full blur-2xl" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {comp.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shortDesc}</p>

                        {/* Price section with gradient background */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Prize Value</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                              £{prizeVal.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Per Ticket</p>
                            <p className="text-xl font-bold text-gray-900">£{ticketPrice}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <CountdownTimer endDate={endDt} showLabels />
                        </div>

                        <Link href={`/competitions/${comp.slug}`}>
                          <Button className={`w-full py-3 text-base font-semibold transition-all duration-300
                            ${isHighlight
                              ? 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/25'
                              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/25'
                            }`}
                          >
                            Enter Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Gift className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No featured competitions at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Competitions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Live Competitions</h2>
              <p className="text-gray-600 mt-2 text-lg">Enter now before they end!</p>
            </div>
            <Link href="/competitions" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 font-semibold transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CompetitionGrid competitions={liveCompetitions || []} />
          <div className="mt-10 text-center sm:hidden">
            <Link href="/competitions">
              <Button variant="outline" className="px-8">View All Competitions</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ending Soon - Urgency Section */}
      {endingSoon && endingSoon.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ending Soon</h2>
                <p className="text-gray-600 text-lg">Last chance to enter - don&apos;t miss out!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {endingSoon.map((comp) => {
                const sold = comp.sold_tickets ?? comp.soldTickets ?? 0;
                const total = comp.total_tickets ?? comp.totalTickets ?? 1;
                const endDt = comp.end_date || comp.endDate || new Date().toISOString();
                const ticketPrice = Number(comp.ticket_price || comp.ticketPrice || 0);
                const percentSold = Math.round((sold / total) * 100);

                return (
                  <Card key={comp.id} variant="bordered" className="border-red-200 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-red-600 mb-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wider">Ends Soon</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{comp.title}</h3>
                      <div className="mb-4">
                        <CountdownTimer endDate={endDt} variant="compact" showLabels={false} />
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Tickets sold</span>
                          <span className="font-semibold text-red-600">{percentSold}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentSold}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">£{ticketPrice}</span>
                        <Link href={`/competitions/${comp.slug}`}>
                          <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25">
                            Enter Now
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Recent Winners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">REAL WINNERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Latest <span className="text-amber-500">Champions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Congratulations to all our amazing winners!
            </p>
          </div>

          {winners && winners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {winners.map((winner, index) => (
                <div key={winner.id} className="text-center group">
                  <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3
                    ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                          'bg-gradient-to-br from-primary-400 to-primary-600'}`}
                  >
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{winner.displayName ?? winner.display_name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{winner.prizeName ?? winner.prize_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <p className="text-gray-500 text-lg">Be our first winner!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/winners">
              <Button variant="outline" size="lg" className="px-8 border-2">
                View All Winners
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works - Premium Design */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-300">Three simple steps to win your dream prize</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />

            {[
              { icon: Search, title: 'Browse', desc: 'Explore our wide range of competitions and find your perfect prize', color: 'from-blue-500 to-cyan-400' },
              { icon: Gift, title: 'Enter', desc: 'Answer a simple question and purchase your tickets securely', color: 'from-primary-500 to-primary-400' },
              { icon: Trophy, title: 'Win', desc: 'Wait for the draw and you could be our next lucky winner!', color: 'from-amber-500 to-orange-400' }
            ].map((step, index) => (
              <div key={step.title} className="text-center relative group">
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white text-primary-600 font-bold text-lg flex items-center justify-center shadow-lg md:-right-0 md:left-1/2 md:ml-8">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/competitions">
              <Button size="lg" className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 px-10 py-4 text-lg font-semibold shadow-xl shadow-accent-500/25">
                Start Winning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure & Fair', desc: 'All competitions are regulated and draws are completely random', color: 'bg-green-500' },
              { icon: Truck, title: 'Free UK Delivery', desc: 'All prizes are delivered completely free of charge', color: 'bg-primary-500' },
              { icon: Users, title: '50,000+ Players', desc: 'Join our growing community of lucky winners', color: 'bg-accent-500' }
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5 p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary-950 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-b from-primary-900/20 to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to Change Your Life?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of winners who&apos;ve already won amazing prizes. Your luck starts here!
          </p>
          <Link href="/competitions">
            <Button
              size="lg"
              className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-10 py-5 text-lg font-bold shadow-glow-red hover:shadow-glow-red/80 hover:scale-105 transition-all duration-300"
            >
              Browse All Competitions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
