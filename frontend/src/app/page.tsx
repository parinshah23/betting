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
    <div className="min-h-screen bg-black">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
        {/* Ambient glows */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0160C9]/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3ACBE8]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#0041C7]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8">
              <Sparkles className="w-4 h-4 text-[#3ACBE8]" />
              <span className="text-white/80 text-sm font-medium">UK&apos;s biggest competition platform</span>
              <Crown className="w-4 h-4 text-[#3ACBE8]" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Win </span>
              <span className="bg-gradient-to-r from-[#3ACBE8] via-[#1CA3DE] to-[#0D85D8] bg-clip-text text-transparent">Life-Changing</span>
              <br />
              <span className="text-white">Prizes Today</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
              From luxury cars to dream holidays, your next big win is just
              <span className="text-[#3ACBE8] font-semibold"> one ticket </span>
              away. Enter now and change your life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/competitions">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0D85D8] to-[#0041C7] hover:from-[#1CA3DE] hover:to-[#0160C9] text-white px-8 py-4 text-lg font-semibold shadow-[0_0_30px_rgba(13,133,216,0.4)] hover:shadow-[0_0_40px_rgba(28,163,222,0.5)] hover:scale-105 transition-all duration-300 border-0"
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
                  className="w-full sm:w-auto border-2 border-white/20 text-white hover:bg-white/5 hover:border-[#1CA3DE]/50 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300"
                >
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#3ACBE8]" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#1CA3DE]" />
                <span className="text-sm">Licensed & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#0D85D8]" />
                <span className="text-sm">Guaranteed Winners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Featured Competitions */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0160C9]/10 border border-[#0160C9]/20 text-[#3ACBE8] mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">FEATURED</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              This Week&apos;s <span className="bg-gradient-to-r from-[#3ACBE8] to-[#0D85D8] bg-clip-text text-transparent">Hottest</span> Prizes
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
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
                  <div key={comp.id} className={`relative group ${isHighlight ? 'lg:-mt-4 lg:mb-4' : ''}`}>
                    {isHighlight && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#0D85D8] via-[#3ACBE8] to-[#0D85D8] rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                    )}

                    <div className={`relative bg-white/5 border rounded-2xl overflow-hidden transition-all duration-500 backdrop-blur-sm
                      ${isHighlight ? 'border-[#1CA3DE]/40 shadow-[0_0_30px_rgba(13,133,216,0.2)]' : 'border-white/10 hover:border-white/20'}
                      group-hover:-translate-y-2`}
                    >
                      {index === 0 && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0160C9] text-white text-sm font-semibold">
                            <Crown className="w-3 h-3" /> Top Pick
                          </span>
                        </div>
                      )}
                      {isHighlight && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#0D85D8] to-[#0041C7] text-white text-sm font-semibold">
                            <Sparkles className="w-3 h-3" /> Most Popular
                          </span>
                        </div>
                      )}

                      <div className="relative h-56 bg-gradient-to-br from-[#0041C7]/20 to-[#3ACBE8]/10 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                            <Gift className="w-12 h-12 text-[#3ACBE8]" />
                          </div>
                        </div>
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#0160C9]/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#3ACBE8]/10 rounded-full blur-2xl" />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#3ACBE8] transition-colors">
                          {comp.title}
                        </h3>
                        <p className="text-white/50 text-sm mb-4 line-clamp-2">{shortDesc}</p>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Prize Value</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-[#3ACBE8] to-[#0D85D8] bg-clip-text text-transparent">
                              £{prizeVal.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/40 uppercase tracking-wider font-medium">Per Ticket</p>
                            <p className="text-xl font-bold text-white">£{ticketPrice}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <CountdownTimer endDate={endDt} showLabels />
                        </div>

                        <Link href={`/competitions/${comp.slug}`}>
                          <Button className={`w-full py-3 text-base font-semibold transition-all duration-300 border-0
                            ${isHighlight
                              ? 'bg-gradient-to-r from-[#0D85D8] to-[#0041C7] hover:from-[#1CA3DE] hover:to-[#0160C9] shadow-[0_0_20px_rgba(13,133,216,0.3)]'
                              : 'bg-gradient-to-r from-[#0160C9] to-[#0041C7] hover:from-[#0D85D8] hover:to-[#0160C9]'
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
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Gift className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/40 text-lg">No featured competitions at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Live Competitions */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Live Competitions</h2>
              <p className="text-white/50 mt-2 text-lg">Enter now before they end!</p>
            </div>
            <Link href="/competitions" className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0160C9]/10 border border-[#0160C9]/20 text-[#3ACBE8] hover:bg-[#0160C9]/20 font-semibold transition-colors">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <CompetitionGrid competitions={liveCompetitions || []} />
          <div className="mt-10 text-center sm:hidden">
            <Link href="/competitions">
              <Button variant="outline" className="px-8 border-white/20 text-white hover:bg-white/5">View All Competitions</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ending Soon */}
      {endingSoon && endingSoon.length > 0 && (
        <section className="py-20 bg-black border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(1,96,201,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(1,96,201,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D85D8] to-[#0041C7] flex items-center justify-center shadow-[0_0_20px_rgba(13,133,216,0.3)]">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ending Soon</h2>
                <p className="text-white/50 text-lg">Last chance to enter — don&apos;t miss out!</p>
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
                  <Card key={comp.id} variant="bordered" className="border-[#0160C9]/20 bg-white/5 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(13,133,216,0.2)] hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-[#3ACBE8] mb-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3ACBE8] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1CA3DE]"></span>
                        </span>
                        <span className="text-sm font-bold uppercase tracking-wider">Ends Soon</span>
                      </div>
                      <h3 className="font-bold text-white mb-3 text-lg">{comp.title}</h3>
                      <div className="mb-4">
                        <CountdownTimer endDate={endDt} variant="compact" showLabels={false} />
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/40">Tickets sold</span>
                          <span className="font-semibold text-[#3ACBE8]">{percentSold}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#0D85D8] to-[#3ACBE8] rounded-full transition-all duration-500"
                            style={{ width: `${percentSold}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#3ACBE8]">£{ticketPrice}</span>
                        <Link href={`/competitions/${comp.slug}`}>
                          <Button size="sm" className="bg-gradient-to-r from-[#0D85D8] to-[#0041C7] hover:from-[#1CA3DE] hover:to-[#0160C9] border-0 shadow-[0_0_12px_rgba(13,133,216,0.3)]">
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
      <section className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0160C9]/10 border border-[#0160C9]/20 text-[#3ACBE8] mb-4">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">REAL WINNERS</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Latest <span className="bg-gradient-to-r from-[#3ACBE8] to-[#0D85D8] bg-clip-text text-transparent">Champions</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Congratulations to all our amazing winners!
            </p>
          </div>

          {winners && winners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {winners.map((winner, index) => (
                <div key={winner.id} className="text-center group">
                  <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3
                    ${index === 0 ? 'bg-gradient-to-br from-[#3ACBE8] to-[#0D85D8]' :
                      index === 1 ? 'bg-gradient-to-br from-[#1CA3DE] to-[#0160C9]' :
                        index === 2 ? 'bg-gradient-to-br from-[#0D85D8] to-[#0041C7]' :
                          'bg-gradient-to-br from-[#0160C9] to-[#0041C7]'}`}
                  >
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <p className="font-semibold text-white text-sm">{winner.displayName ?? winner.display_name}</p>
                  <p className="text-xs text-white/40 line-clamp-1">{winner.prizeName ?? winner.prize_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#0160C9]/10 border border-[#0160C9]/20 flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-[#3ACBE8]" />
              </div>
              <p className="text-white/40 text-lg">Be our first winner!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/winners">
              <Button variant="outline" size="lg" className="px-8 border-2 border-white/20 text-white hover:bg-white/5 hover:border-[#1CA3DE]/40">
                View All Winners
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#0D85D8]/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white/50">Three simple steps to win your dream prize</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#0D85D8]/40 to-transparent" />

            {[
              { icon: Search, title: 'Browse', desc: 'Explore our wide range of competitions and find your perfect prize', color: 'from-[#3ACBE8] to-[#1CA3DE]' },
              { icon: Gift, title: 'Enter', desc: 'Answer a simple question and purchase your tickets securely', color: 'from-[#1CA3DE] to-[#0D85D8]' },
              { icon: Trophy, title: 'Win', desc: 'Wait for the draw and you could be our next lucky winner!', color: 'from-[#0D85D8] to-[#0041C7]' }
            ].map((step, index) => (
              <div key={step.title} className="text-center relative group">
                <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(13,133,216,0.3)] transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 left-1/2 ml-8 w-10 h-10 rounded-full bg-[#0160C9] text-white font-bold text-lg flex items-center justify-center shadow-[0_0_12px_rgba(1,96,201,0.5)]">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/competitions">
              <Button size="lg" className="bg-gradient-to-r from-[#0D85D8] to-[#0041C7] hover:from-[#1CA3DE] hover:to-[#0160C9] px-10 py-4 text-lg font-semibold shadow-[0_0_30px_rgba(13,133,216,0.4)] border-0 hover:scale-105 transition-all duration-300">
                Start Winning Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure & Fair', desc: 'All competitions are regulated and draws are completely random', color: 'from-[#3ACBE8] to-[#1CA3DE]' },
              { icon: Truck, title: 'Free UK Delivery', desc: 'All prizes are delivered completely free of charge', color: 'from-[#1CA3DE] to-[#0D85D8]' },
              { icon: Users, title: '50,000+ Players', desc: 'Join our growing community of lucky winners', color: 'from-[#0D85D8] to-[#0041C7]' }
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#0D85D8]/30 hover:bg-white/8 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(13,133,216,0.2)]`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-b from-[#0160C9]/5 to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3ACBE8]/5 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#0041C7]/5 rounded-full blur-3xl animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to Change Your Life?</h2>
          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto">
            Join thousands of winners who&apos;ve already won amazing prizes. Your luck starts here!
          </p>
          <Link href="/competitions">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#0D85D8] to-[#0041C7] hover:from-[#1CA3DE] hover:to-[#0160C9] text-white px-10 py-5 text-lg font-bold shadow-[0_0_40px_rgba(13,133,216,0.4)] hover:shadow-[0_0_60px_rgba(28,163,222,0.5)] hover:scale-105 transition-all duration-300 border-0"
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
