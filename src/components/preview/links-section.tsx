'use client';

import { Link } from '@/types/profile';
import { ExternalLink } from 'lucide-react';

interface LinksSectionProps {
  links: Link[];
}

export function LinksSection({ links }: LinksSectionProps) {
  if (links.length === 0) return null;

  return (
    <div className="p-8 border-b border-border">
      <div className="flex flex-wrap gap-3 justify-center">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium bg-primary text-primary-foreground transition-all hover:shadow-lg hover:scale-105"
          >
            {link.label}
            <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}
