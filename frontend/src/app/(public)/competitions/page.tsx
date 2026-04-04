'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import useSWR from 'swr';
import { api } from '@/lib/api';
import { CompetitionCard } from '@/components/competition';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import type { Competition } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Backend returns flat array directly in data, not wrapped in competitions object
interface CompetitionsApiResponse extends Array<Competition> {}

const fetcher = (url: string) => api.get<CompetitionsApiResponse>(url);

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'tech', label: 'Tech & Gadgets' },
  { value: 'cars', label: 'Cars & Vehicles' },
  { value: 'travel', label: 'Travel & Experiences' },
  { value: 'cash', label: 'Cash Prizes' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'home', label: 'Home & Garden' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'ending_soon', label: 'Ending Soon' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const statusTabs = [
  { value: 'live', label: 'Live' },
  { value: 'ending_soon', label: 'Ending Soon' },
  { value: 'sold_out', label: 'Sold Out' },
  { value: 'completed', label: 'Completed' },
];

function CompetitionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const status = searchParams.get('status') || 'live';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (page > 1) params.set('page', page.toString());
    if (search) params.set('search', search);
    return params.toString();
  };

  const queryString = buildQueryString();
  const { data, isLoading, error } = useSWR(
    `/competitions?${queryString}`,
    fetcher
  );

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    if (key !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set('search', searchInput);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const competitions = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#0160C9]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#3ACBE8]/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">All </span>
              <span className="bg-gradient-to-r from-[#3ACBE8] to-[#0D85D8] bg-clip-text text-transparent">Competitions</span>
            </h1>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Browse our exciting raffles and enter for your chance to win incredible prizes
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch}>
                <Input
                  placeholder="Search competitions..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="bg-black/40 border-white/10 text-white placeholder:text-white/30"
                />
              </form>
            </div>
            <div className="flex gap-3">
              <Select
                options={categories}
                value={category}
                onChange={(value) => updateFilter('category', value)}
                className="w-48"
              />
              <Select
                options={sortOptions}
                value={sort}
                onChange={(value) => updateFilter('sort', value)}
                className="w-44"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateFilter('status', tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${status === tab.value
                ? 'bg-gradient-to-r from-[#0D85D8] to-[#0041C7] text-white shadow-[0_0_12px_rgba(13,133,216,0.3)]'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40">
            {meta && (
              <span>Showing {competitions.length} of {meta.total} competitions</span>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="relative h-48 bg-white/5 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-white/10 rounded w-20 mb-3 animate-pulse" />
                  <div className="h-5 bg-white/10 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-4 animate-pulse" />
                  <div className="h-2 bg-white/10 rounded w-full mb-2 animate-pulse" />
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-white/10 rounded w-20 animate-pulse" />
                    <div className="h-6 bg-white/10 rounded w-24 animate-pulse" />
                  </div>
                  <div className="h-10 bg-white/10 rounded w-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load competitions. Please try again.</p>
            <Button onClick={() => router.refresh()} className="mt-4">
              Retry
            </Button>
          </div>
        ) : competitions.length === 0 ? (
          <Card className="text-center py-12 bg-white/5 border-white/10">
            <p className="text-white/50 mb-4">No competitions found matching your criteria.</p>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
              onClick={() => {
                router.push('/competitions');
                setSearchInput('');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(competitions as Competition[]).map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>

            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/5"
                  disabled={page === 1}
                  onClick={() => updateFilter('page', (page - 1).toString())}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(meta.totalPages || 1, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => updateFilter('page', pageNum.toString())}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === pageNum
                          ? 'bg-gradient-to-r from-[#0D85D8] to-[#0041C7] text-white'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/5"
                  disabled={page === meta.totalPages}
                  onClick={() => updateFilter('page', (page + 1).toString())}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function CompetitionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <CompetitionsContent />
    </Suspense>
  );
}
