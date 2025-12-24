'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Link } from '@/types/profile';
import { ExternalLink } from 'lucide-react';

interface LinksSectionProps {
  links: Link[];
}

export const LinksSection = memo(function LinksSection({ links }: LinksSectionProps) {
  if (links.length === 0) return null;

  // Sort links by displayOrder
  const sortedLinks = [...links].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="p-8 border-b border-border">
      <div className="flex flex-wrap gap-3 justify-center">
        {sortedLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-white text-foreground border-2 border-transparent transition-all hover:border-border hover:shadow-lg hover:scale-105"
          >
            {link.favicon ? (
              <Image
                src={link.favicon}
                alt={link.label}
                width={24}
                height={24}
                className="w-6 h-6 object-contain flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              link.label
            )}
          </a>
        ))}
      </div>
    </div>
  );
});
