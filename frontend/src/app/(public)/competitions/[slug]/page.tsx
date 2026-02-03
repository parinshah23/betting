import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { CompetitionDetail } from '@/types/competition';
import CompetitionClient from './CompetitionClient';

interface PageProps {
  params: {
    slug: string;
  };
}

// Fetch data on the server
async function getCompetition(slug: string): Promise<CompetitionDetail | null> {
  // Use absolute URL for server-side fetch if API_BASE_URL is relative or needs Docker networking
  // Assuming API_BASE_URL in api.ts is correct for server-side (http://localhost:3001)
  const response = await api.get<CompetitionDetail>(`/competitions/${slug}`);

  if (response.success && response.data) {
    return response.data;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const competition = await getCompetition(params.slug);

  if (!competition) {
    return {
      title: 'Competition Not Found | Premium Competitions',
    };
  }

  const primaryImage = competition.images.find(img => img.isPrimary)?.url || competition.images[0]?.url;

  return {
    title: `${competition.title} - Win Now | Premium Competitions`,
    description: competition.shortDescription,
    openGraph: {
      title: `${competition.title} - Win Now!`,
      description: competition.shortDescription,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function CompetitionPage({ params }: PageProps) {
  const competition = await getCompetition(params.slug);

  if (!competition) {
    notFound();
  }

  return <CompetitionClient initialData={competition} slug={params.slug} />;
}
