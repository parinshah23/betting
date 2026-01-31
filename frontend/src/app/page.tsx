'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CompetitionGrid } from '@/components/competition';
import { Badge } from '@/components/ui/Badge';
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
  Award
} from 'lucide-react';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

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
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="info" className="mb-6">Trusted by 50,000+ players</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Win Amazing Prizes Every Day
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Enter our exciting online raffles and stand a chance to win incredible prizes. 
              From luxury cars to tech gadgets, your dream prize is just a ticket away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/competitions">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Browse Competitions
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Competitions</h2>
            <p className="text-gray-600 mt-2">Check out our hottest prizes this week</p>
          </div>
          
          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((comp, index) => {
                const shortDesc = comp.short_description || comp.shortDescription || '';
                const prizeVal = Number(comp.prize_value || comp.prizeValue || 0);
                const ticketPrice = Number(comp.ticket_price || comp.ticketPrice || 0);
                const endDt = comp.end_date || comp.endDate || new Date().toISOString();
                
                return (
                  <div
                    key={comp.id}
                    className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
                      index === 1 ? 'ring-2 ring-primary-500 scale-105 z-10' : ''
                    }`}
                  >
                    {index === 0 && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="warning">Top Pick</Badge>
                      </div>
                    )}
                    <div className="relative h-56 bg-gray-200">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <Gift className="w-16 h-16" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{comp.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{shortDesc}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Prize Value</p>
                          <p className="text-2xl font-bold text-primary-600">£{prizeVal.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Ticket</p>
                          <p className="text-xl font-semibold text-gray-900">£{ticketPrice}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <CountdownTimer endDate={endDt} showLabels />
                      </div>
                      <Link href={`/competitions/${comp.slug}`}>
                        <Button className="w-full">Enter Now</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No featured competitions at the moment</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Live Competitions</h2>
              <p className="text-gray-600 mt-1">Enter now before they end!</p>
            </div>
            <Link href="/competitions" className="hidden sm:flex items-center text-primary-600 hover:text-primary-700 font-medium">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <CompetitionGrid competitions={liveCompetitions || []} />
          <div className="mt-8 text-center sm:hidden">
            <Link href="/competitions">
              <Button variant="outline">View All Competitions</Button>
            </Link>
          </div>
        </div>
      </section>

      {endingSoon && endingSoon.length > 0 && (
        <section className="py-16 bg-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Trophy className="w-8 h-8 text-red-600" />
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Ending Soon</h2>
                <p className="text-gray-600">Don&apos;t miss your chance to win!</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {endingSoon.map((comp) => {
                const sold = comp.sold_tickets ?? comp.soldTickets ?? 0;
                const total = comp.total_tickets ?? comp.totalTickets ?? 1;
                const endDt = comp.end_date || comp.endDate || new Date().toISOString();
                const ticketPrice = Number(comp.ticket_price || comp.ticketPrice || 0);
                
                return (
                  <Card key={comp.id} variant="bordered" className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-red-600 mb-3">
                        <ClockIcon />
                        <span className="text-sm font-medium">Ends Soon</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{comp.title}</h3>
                      <div className="mb-3">
                        <CountdownTimer endDate={endDt} variant="compact" showLabels={false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">£{ticketPrice}</span>
                        <span className="text-sm text-gray-500">
                          {Math.round((sold / total) * 100)}% sold
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Recent Winners</h2>
            <p className="text-gray-600 mt-2">Congratulations to our latest winners!</p>
          </div>
          
          {winners && winners.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {winners.map((winner) => (
                <div key={winner.id} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-3">
                    <Award className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="font-medium text-gray-900 text-sm">{winner.displayName}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">{winner.prizeName}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Be our first winner!</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/winners">
              <Button variant="outline">
                View All Winners
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-400 mt-2">Three simple steps to win your dream prize</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-600 flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Browse Competitions</h3>
              <p className="text-gray-400">Explore our wide range of competitions and find your perfect prize</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-600 flex items-center justify-center mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Answer & Buy</h3>
              <p className="text-gray-400">Answer a simple skill-testing question and purchase your tickets</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-600 flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Win!</h3>
              <p className="text-gray-400">Wait for the draw and cross your fingers - you could be our next winner!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure & Fair</h3>
                <p className="text-sm text-gray-600 mt-1">All competitions are regulated and draws are completely random</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free UK Delivery</h3>
                <p className="text-sm text-gray-600 mt-1">All prizes are delivered completely free of charge</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">50,000+ Players</h3>
                <p className="text-sm text-gray-600 mt-1">Join our growing community of lucky winners</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}
