'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Copy, Download, Upload, Check, AlertCircle } from 'lucide-react';

interface JSONEditorProps {
  profileData: ProfileData;
  onChange: (updates: ProfileData) => void;
}

export function JSONEditor({ profileData, onChange }: JSONEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);

  // Sync jsonText with profileData only when not manually editing
  useEffect(() => {
    if (!isManualEdit) {
      setJsonText(JSON.stringify(profileData, null, 2));
    }
  }, [profileData, isManualEdit]);

  // Auto-update preview as user types (debounced)
  useEffect(() => {
    if (!isManualEdit) return;

    const timeout = setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonText);
        onChange(parsed);
        setError(null);
      } catch (err) {
        // Don't show error while typing, only set it
        setError('Invalid JSON format');
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeout);
  }, [jsonText, isManualEdit, onChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    setIsManualEdit(true);
    setError(null);
  };

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChange(parsed);
      setError(null);
      setIsManualEdit(false);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(profileData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(profileData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${profileData.username}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>JSON Data</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <textarea
          value={jsonText}
          onChange={handleTextChange}
          className="w-full h-[400px] p-3 font-mono text-sm border border-input-border rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          spellCheck={false}
          placeholder="Edit JSON to see live preview..."
        />

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={handleLoad}
            variant="secondary"
          >
            <Upload className="w-4 h-4 mr-2" />
            Validate & Apply
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setJsonText(JSON.stringify(profileData, null, 2));
              setIsManualEdit(false);
              setError(null);
            }}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          {isManualEdit ? '✨ Live preview active - changes update automatically' : '📝 Ready to edit'}
        </p>
      </CardContent>
    </Card>
  );
}
