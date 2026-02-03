'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import {
  ArrowLeft,
  Save,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface CompetitionFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  prize_value: number;
  ticket_price: number;
  total_tickets: number;
  max_tickets_per_user: number;
  category: string;
  status: 'draft' | 'live' | 'ended' | 'completed';
  featured: boolean;
  end_date: string;
  skill_question: string;
  skill_answer: string;
}

const categories = [
  { value: '', label: 'Select Category' },
  { value: 'tech', label: 'Tech & Gadgets' },
  { value: 'cars', label: 'Cars & Vehicles' },
  { value: 'travel', label: 'Travel & Experiences' },
  { value: 'cash', label: 'Cash Prizes' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'home', label: 'Home & Garden' },
];

export default function EditCompetitionPage() {
  const router = useRouter();
  const params = useParams();
  const competitionId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CompetitionFormData>({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    prize_value: 0,
    ticket_price: 0,
    total_tickets: 100,
    max_tickets_per_user: 10,
    category: '',
    status: 'draft',
    featured: false,
    end_date: '',
    skill_question: '',
    skill_answer: '',
  });

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const response = await api.get(`/api/admin/competitions/${competitionId}`);
        if (response.success && response.data) {
          const data = response.data as CompetitionFormData;
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            short_description: data.short_description || '',
            prize_value: data.prize_value || 0,
            ticket_price: data.ticket_price || 0,
            total_tickets: data.total_tickets || 100,
            max_tickets_per_user: data.max_tickets_per_user || 10,
            category: data.category || '',
            status: data.status || 'draft',
            featured: data.featured || false,
            end_date: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : '',
            skill_question: data.skill_question || '',
            skill_answer: data.skill_answer || '',
          });
        } else {
          setError('Failed to load competition');
        }
      } catch (err) {
        setError('Error loading competition data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetition();
  }, [competitionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.put(`/api/admin/competitions/${competitionId}`, formData);

      if (response.success) {
        router.push('/admin/competitions');
      } else {
        setError(response.error?.message || 'Failed to update competition');
      }
    } catch (err) {
      setError('An error occurred while updating the competition');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/competitions"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Competition</h1>
          <p className="text-gray-500">Update competition details</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (£) *</label>
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Feature on homepage</span>
            </label>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/competitions"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </Link>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Spinner size="sm" className="mr-2" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Save Changes</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
