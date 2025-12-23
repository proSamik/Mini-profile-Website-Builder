'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { UIEditor } from '@/components/editor/ui-editor';
import { JSONEditor } from '@/components/editor/json-editor';
import { LivePreview } from '@/components/preview/live-preview';
import { Button, ThemeToggle } from '@/components/ui';
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
      <div className="h-screen bg-background flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-foreground" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-muted flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-none z-50 border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-card-foreground">
                Mini Profile Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Design your personal profile website in real-time
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Editor Mode Toggle (only visible in editor/split view) */}
              {(viewMode === 'split' || viewMode === 'editor') && (
                <div className="flex gap-1 bg-muted rounded-lg p-1 border border-border">
                  <button
                    onClick={() => setEditorMode('ui')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      editorMode === 'ui'
                        ? 'bg-primary text-primary-foreground ring-1 ring-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Paintbrush className="w-4 h-4" />
                    UI
                  </button>
                  <button
                    onClick={() => setEditorMode('json')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      editorMode === 'json'
                        ? 'bg-primary text-primary-foreground ring-1 ring-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-muted rounded-lg p-1 border border-border">
                {(['split', 'editor', 'preview'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1.5 rounded-md capitalize text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-primary text-primary-foreground ring-1 ring-primary/50'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

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

              {/* Theme Toggle */}
              <ThemeToggle />
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
    </div>
  );
}
