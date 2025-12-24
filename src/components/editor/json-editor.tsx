'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { Copy, Download, Upload, Check, AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface JSONEditorProps {
  profileData: ProfileData;
  onChange: (updates: ProfileData) => void;
  userId: string;
  onUsernameValidChange?: (isValid: boolean) => void;
}

export function JSONEditor({ profileData, onChange, userId, onUsernameValidChange }: JSONEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);
  const [originalUsername] = useState(profileData.username);
  const [parsedUsername, setParsedUsername] = useState<string | null>(null);

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
        setParsedUsername(parsed.username);
        onChange(parsed);
        setError(null);
        setErrorLine(null);
      } catch (err: unknown) {
        // Extract line number from error message
        const match = (err as Error).message.match(/at position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const lineNumber = jsonText.substring(0, position).split('\n').length;
          setErrorLine(lineNumber);
          setError(`Invalid JSON at line ${lineNumber}: ${(err as Error).message}`);
        } else {
          setError(`Invalid JSON: ${(err as Error).message}`);
          setErrorLine(null);
        }
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeout);
  }, [jsonText, isManualEdit, onChange]);

  // Validate username from parsed JSON
  useEffect(() => {
    if (!parsedUsername) return;

    const username = parsedUsername.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (username.length < 3) {
      setUsernameAvailable(false);
      onUsernameValidChange?.(false);
      return;
    }

    // If username hasn't changed, it's valid
    if (username === originalUsername) {
      setUsernameAvailable(true);
      onUsernameValidChange?.(true);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/profiles/check-username?username=${encodeURIComponent(username)}`
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
        onUsernameValidChange?.(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(false);
        onUsernameValidChange?.(false);
      } finally {
        setChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [parsedUsername, originalUsername, onUsernameValidChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Replace smart quotes with regular quotes
    let value = e.target.value;
    value = value.replace(/[\u201C\u201D]/g, '"'); // Replace " and "
    value = value.replace(/[\u2018\u2019]/g, "'"); // Replace ' and '
    
    setJsonText(value);
    setIsManualEdit(true);
    setError(null);
    setErrorLine(null);
  };

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setParsedUsername(parsed.username);
      onChange(parsed);
      setError(null);
      setErrorLine(null);
      setIsManualEdit(false);
    } catch (err: unknown) {
      // Extract line number from error message
      const match = (err as Error).message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lineNumber = jsonText.substring(0, position).split('\n').length;
        setErrorLine(lineNumber);
        setError(`Invalid JSON at line ${lineNumber}: ${(err as Error).message}`);
      } else {
        setError(`Invalid JSON: ${(err as Error).message}`);
        setErrorLine(null);
      }
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
        <CardTitle className="flex items-center gap-2">
          JSON Data
          {parsedUsername && parsedUsername.length >= 3 && (
            <div className="flex items-center gap-1">
              {checking && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              {!checking && usernameAvailable === true && (
                <CheckCircle2 className="w-4 h-4 text-green-500" title="Username available" />
              )}
              {!checking && usernameAvailable === false && (
                <XCircle className="w-4 h-4 text-red-500" title="Username already taken" />
              )}
            </div>
          )}
        </CardTitle>
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
        <div className="relative">
          <textarea
            value={jsonText}
            onChange={handleTextChange}
            className={`w-full h-[400px] p-3 font-mono text-sm border rounded-lg bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              error ? 'border-red-500' : 'border-input-border'
            }`}
            spellCheck={false}
            placeholder="Edit JSON to see live preview..."
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-500 text-sm mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">JSON Syntax Error</div>
              <div className="mt-1">{error}</div>
              {errorLine && (
                <div className="mt-2 text-xs">
                  Check line <span className="font-bold">{errorLine}</span> in the editor above
                </div>
              )}
            </div>
          </div>
        )}

        {!error && usernameAvailable === false && parsedUsername && parsedUsername.length >= 3 && (
          <div className="flex items-start gap-2 text-red-500 text-sm mt-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Username Unavailable</div>
              <div className="mt-1">The username "{parsedUsername}" is already taken</div>
            </div>
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
              setErrorLine(null);
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
