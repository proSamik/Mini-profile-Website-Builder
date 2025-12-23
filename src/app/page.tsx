'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { UIEditor } from '@/components/editor/ui-editor';
import { JSONEditor } from '@/components/editor/json-editor';
import { LivePreview } from '@/components/preview/live-preview';
import { Button } from '@/components/ui';
import { Code, Paintbrush, Save, Loader2 } from 'lucide-react';

// For demo purposes, we'll use a hardcoded userId
// In a real app, this would come from authentication
const DEMO_USER_ID = 'demo-user-123';

export default function Home() {
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [editorMode, setEditorMode] = useState<'ui' | 'json'>('ui');

  const {
    profileData,
    updateProfileData,
    replaceProfileData,
    saveProfile,
    loading,
    saving,
    hasUnsavedChanges,
  } = useProfile(DEMO_USER_ID);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-900 dark:text-white" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none z-50 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mini Profile Builder
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Design your personal profile website in real-time
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['split', 'editor', 'preview'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-md capitalize text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Editor Mode Toggle (only visible in editor/split view) */}
              {(viewMode === 'split' || viewMode === 'editor') && (
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setEditorMode('ui')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      editorMode === 'ui'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" />
                    UI
                  </button>
                  <button
                    onClick={() => setEditorMode('json')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      editorMode === 'json'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              )}

              {/* Save Button */}
              <Button
                onClick={saveProfile}
                disabled={saving || !hasUnsavedChanges}
                size="sm"
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {hasUnsavedChanges ? 'Save' : 'Saved'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div>
              {editorMode === 'ui' ? (
                <UIEditor
                  profileData={profileData}
                  onChange={updateProfileData}
                  userId={DEMO_USER_ID}
                />
              ) : (
                <JSONEditor
                  profileData={profileData}
                  onChange={replaceProfileData}
                />
              )}
            </div>

            {/* Preview Panel */}
            <div>
              <LivePreview profileData={profileData} />
            </div>
          </div>
        )}

        {viewMode === 'editor' && (
          <div className="max-w-4xl mx-auto">
            {editorMode === 'ui' ? (
              <UIEditor
                profileData={profileData}
                onChange={updateProfileData}
                userId={DEMO_USER_ID}
              />
            ) : (
              <JSONEditor
                profileData={profileData}
                onChange={replaceProfileData}
              />
            )}
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="max-w-4xl mx-auto">
            <LivePreview profileData={profileData} />
          </div>
        )}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-none border-t bg-white dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>
            Built with Next.js, React, Drizzle ORM, PostgreSQL & Cloudflare R2
          </p>
          <p className="mt-1">
            {hasUnsavedChanges && (
              <span className="text-yellow-600 dark:text-yellow-400">
                ● Unsaved changes - Auto-saving...
              </span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}
