'use client';

import { Highlight } from '@/types/profile';
import { ExternalLink } from 'lucide-react';

interface HighlightsGridProps {
  highlights: Highlight[];
}

export function HighlightsGrid({ highlights }: HighlightsGridProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight) => (
          <div
            key={highlight.id}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
          >
            {highlight.image && (
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-600">
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                {highlight.title}
              </h3>
              {highlight.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                  {highlight.description}
                </p>
              )}
              {highlight.url && (
                <a
                  href={highlight.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                  style={{
                    color: 'var(--accent-color, #60A5FA)',
                  }}
                >
                  View Project
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
