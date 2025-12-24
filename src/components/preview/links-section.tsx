'use client';

import { memo } from 'react';
import { Link } from '@/types/profile';
import { ExternalLink } from 'lucide-react';

interface LinksSectionProps {
  links: Link[];
}

export const LinksSection = memo(function LinksSection({ links }: LinksSectionProps) {
  if (links.length === 0) return null;

  // Sort links by displayOrder
  const sortedLinks = [...links].sort((a, b) => a.displayOrder - b.displayOrder);

  console.log('Links in preview:', sortedLinks.map(l => ({ label: l.label, favicon: l.favicon })));

  return (
    <div className="p-8 border-b border-border">
      <div className="flex flex-wrap gap-3 justify-center">
        {sortedLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium bg-primary text-primary-foreground transition-all hover:shadow-lg hover:scale-105"
          >
            {link.favicon && (
              <img
                src={link.favicon}
                alt=""
                className="w-4 h-4 object-contain flex-shrink-0"
                onError={(e) => {
                  console.error('Failed to load favicon:', link.favicon);
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            {link.label}
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
});
