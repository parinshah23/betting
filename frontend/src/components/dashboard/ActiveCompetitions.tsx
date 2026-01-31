'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Clock, Ticket } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ActiveCompetition {
  id: string;
  title: string;
  slug: string;
  image: string;
  ticketCount: number;
  endDate: string;
}

interface ActiveCompetitionsProps {
  competitions: ActiveCompetition[];
}

export function ActiveCompetitions({ competitions }: ActiveCompetitionsProps) {
  if (competitions.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Competitions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven&apos;t entered any live competitions yet.</p>
            <Link href="/competitions">
              <Button>Browse Competitions</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Competitions</CardTitle>
        <Link href="/my-tickets">
          <Button variant="ghost" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitions.map((comp) => (
            <div key={comp.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-200 transition-colors">
              <div className="relative h-32 bg-gray-100">
                 {/* Placeholder for image if needed, or real image */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                   {comp.image ? (
                      <Image 
                        src={comp.image} 
                        alt={comp.title}
                        fill
                        className="object-cover"
                      />
                   ) : (
                      <Ticket className="w-8 h-8" />
                   )}
                 </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 truncate mb-2" title={comp.title}>
                  {comp.title}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Ticket className="w-4 h-4" />
                    <span>{comp.ticketCount} tickets</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDistanceToNow(new Date(comp.endDate), { addSuffix: true })}</span>
                  </div>
                </div>
                <Link href={`/competitions/${comp.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
