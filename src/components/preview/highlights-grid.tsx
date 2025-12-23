'use client';

import { Highlight } from '@/types/profile';
import { ExternalLink, Sparkles } from 'lucide-react';

interface HighlightsGridProps {
  highlights: Highlight[];
}

// Generate a gradient based on the index for variety
const getGradient = (index: number) => {
  const gradients = [
    'from-purple-400 via-pink-500 to-red-500',
    'from-blue-400 via-cyan-500 to-teal-500',
    'from-orange-400 via-red-500 to-pink-500',
    'from-green-400 via-emerald-500 to-cyan-500',
    'from-indigo-400 via-purple-500 to-pink-500',
    'from-yellow-400 via-orange-500 to-red-500',
  ];
  return gradients[index % gradients.length];
};

export function HighlightsGrid({ highlights }: HighlightsGridProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Highlights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight, index) => (
          <div
            key={highlight.id}
            className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
          >
            {highlight.image ? (
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
            ) : (
              <div className={`relative w-full h-48 bg-gradient-to-br ${getGradient(index)} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <Sparkles className="w-16 h-16 text-white/90 relative z-10 animate-pulse" />
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
