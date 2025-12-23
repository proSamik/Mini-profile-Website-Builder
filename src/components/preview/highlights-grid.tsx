'use client';

import { memo } from 'react';
import { Highlight } from '@/types/profile';
import { ExternalLink, Sparkles } from 'lucide-react';

interface HighlightsGridProps {
  highlights: Highlight[];
  forceSingleColumn?: boolean;
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

export const HighlightsGrid = memo(function HighlightsGrid({ highlights, forceSingleColumn = false }: HighlightsGridProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
        Highlights
      </h2>
      <div className={`grid gap-6 ${forceSingleColumn ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
        {highlights.map((highlight, index) => {
          const CardWrapper = highlight.url ? 'a' : 'div';
          const cardProps = highlight.url
            ? {
                href: highlight.url,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
            : {};

          return (
            <CardWrapper
              key={highlight.id}
              {...cardProps}
              className={`group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all bg-card border border-card-border ${
                highlight.url ? 'cursor-pointer hover:scale-[1.02]' : ''
              }`}
            >
              {/* Arrow indicator for clickable cards */}
              {highlight.url && (
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-background rounded-full p-2 shadow-lg">
                    <ExternalLink className="w-5 h-5 text-foreground" />
                  </div>
                </div>
              )}

              {highlight.image ? (
                <div className="relative w-full h-48 bg-muted">
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
                <h3 className="font-bold text-lg text-card-foreground mb-2">
                  {highlight.title}
                </h3>
                {highlight.description && (
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                    {highlight.description}
                  </p>
                )}
                {highlight.url && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                    View Project
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
});
