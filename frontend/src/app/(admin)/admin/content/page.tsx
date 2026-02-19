'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import {
  FileText,
  Edit,
  Save,
  X,
  Globe
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import useSWR from 'swr';

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

const fetchContent = () => api.get<{ data: ContentPage[] }>('/admin/content').then(res => res.data?.data);

export default function AdminContentPage() {
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: pages, isLoading, mutate } = useSWR('admin-content', fetchContent);

  const handleEdit = (page: ContentPage) => {
    setEditingPage(page);
    setEditTitle(page.title);
    setEditContent(page.content);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!editingPage) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await api.put(`/admin/content/${editingPage.slug}`, {
        title: editTitle,
        content: editContent
      });

      if (response.success) {
        await mutate();
        setEditingPage(null);
      } else {
        setSaveError(response.error?.message || 'Failed to save');
      }
    } catch (err) {
      setSaveError('An error occurred while saving');
    } finally {
      setIsSaving(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Content Management
          </h1>
          <p className="text-gray-500 mt-1">Manage static pages and content</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pages?.map((page) => (
          <Card key={page.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                  <Badge variant="outline" size="sm">
                    <Globe className="w-3 h-3 mr-1" />
                    /{page.slug}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {formatDate(page.updated_at)}
                </p>
              </div>
              <button
                onClick={() => handleEdit(page)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPage}
        onClose={() => {
          setEditingPage(null);
          setSaveError(null);
        }}
        title={`Edit: ${editingPage?.title}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (HTML/Markdown)
            </label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
            />
          </div>
          {saveError && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{saveError}</p>
          )}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setEditingPage(null);
                setSaveError(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isSaving}
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
