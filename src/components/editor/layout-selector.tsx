'use client';

import { ProfileData, ProfileLayout } from '@/types/profile';

interface LayoutSelectorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

const layoutOptions: { value: ProfileLayout; label: string; skeleton: React.ReactNode }[] = [
  {
    value: 'default',
    label: 'Default',
    skeleton: (
      <div className="space-y-2.5 p-3 w-full">
        {/* Photo */}
        <div className="w-14 h-14 border-2 border-foreground/30 rounded-full mx-auto" />
        {/* Name */}
        <div className="h-3 bg-foreground/30 rounded w-3/4 mx-auto" />
        {/* Username */}
        <div className="h-2 bg-foreground/20 rounded w-1/2 mx-auto" />
        {/* Bio lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 bg-foreground/15 rounded w-full" />
          <div className="h-1.5 bg-foreground/15 rounded w-5/6 mx-auto" />
        </div>
      </div>
    ),
  },
  {
    value: 'layout1',
    label: 'Layout 1',
    skeleton: (
      <div className="flex gap-2.5 p-3 w-full">
        {/* Left column */}
        <div className="flex flex-col items-center gap-1.5 w-16">
          <div className="w-12 h-12 border-2 border-foreground/30 rounded-full" />
          <div className="h-1.5 bg-foreground/20 rounded w-10" />
        </div>
        {/* Right column - combined box */}
        <div className="flex-1 border border-foreground/25 rounded-md">
          <div className="p-2 border-b border-foreground/20">
            <div className="h-2.5 bg-foreground/30 rounded w-3/4" />
          </div>
          <div className="p-2 space-y-1">
            <div className="h-1.5 bg-foreground/15 rounded w-full" />
            <div className="h-1.5 bg-foreground/15 rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
  },
  {
    value: 'layout2',
    label: 'Layout 2',
    skeleton: (
      <div className="flex gap-2.5 p-3 w-full">
        {/* Left column - combined box */}
        <div className="flex-1 border border-foreground/25 rounded-md">
          <div className="p-2 border-b border-foreground/20">
            <div className="h-2.5 bg-foreground/30 rounded w-3/4" />
          </div>
          <div className="p-2 space-y-1">
            <div className="h-1.5 bg-foreground/15 rounded w-full" />
            <div className="h-1.5 bg-foreground/15 rounded w-4/5" />
          </div>
        </div>
        {/* Right column */}
        <div className="flex flex-col items-center gap-1.5 w-16">
          <div className="w-12 h-12 border-2 border-foreground/30 rounded-full" />
          <div className="h-1.5 bg-foreground/20 rounded w-10" />
        </div>
      </div>
    ),
  },
  {
    value: 'layout3',
    label: 'Layout 3',
    skeleton: (
      <div className="space-y-2 p-3 w-full">
        {/* Top row */}
        <div className="flex gap-2.5">
          <div className="w-12 h-12 border-2 border-foreground/30 rounded-full" />
          <div className="flex-1 border border-foreground/25 rounded-md">
            <div className="p-2 border-b border-foreground/20">
              <div className="h-2.5 bg-foreground/30 rounded w-3/4" />
            </div>
            <div className="p-1.5">
              <div className="h-1.5 bg-foreground/15 rounded w-1/2" />
            </div>
          </div>
        </div>
        {/* Bio lines centered */}
        <div className="space-y-1 pt-1">
          <div className="h-1.5 bg-foreground/15 rounded w-4/5 mx-auto" />
          <div className="h-1.5 bg-foreground/15 rounded w-3/4 mx-auto" />
        </div>
      </div>
    ),
  },
  {
    value: 'layout4',
    label: 'Layout 4',
    skeleton: (
      <div className="flex gap-2.5 p-3 w-full">
        {/* Left column */}
        <div className="flex flex-col gap-1.5 w-16">
          <div className="w-12 h-12 border-2 border-foreground/30 rounded-full mx-auto" />
          <div className="h-1.5 bg-foreground/20 rounded w-10 mx-auto" />
        </div>
        {/* Right column - combined box */}
        <div className="flex-1 border border-foreground/25 rounded-md">
          <div className="p-2 border-b border-foreground/20">
            <div className="h-2.5 bg-foreground/30 rounded w-3/4" />
          </div>
          <div className="p-2 space-y-1">
            <div className="h-1.5 bg-foreground/15 rounded w-full" />
            <div className="h-1.5 bg-foreground/15 rounded w-4/5" />
          </div>
        </div>
      </div>
    ),
  },
];

export function LayoutSelector({ profileData, onChange }: LayoutSelectorProps) {
  const currentLayout = profileData.layout || 'default';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-4">Profile Layout</h2>

      <div className="grid grid-cols-2 gap-3">
        {layoutOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ layout: option.value })}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              currentLayout === option.value
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-card-foreground text-sm">{option.label}</h3>
              {currentLayout === option.value && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  Active
                </span>
              )}
            </div>

            {/* Skeleton Preview */}
            <div className="bg-background rounded-md border border-border/50 min-h-[100px] flex items-center justify-center">
              {option.skeleton}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Changes will be reflected in the live preview. Choose a layout that best presents your profile.
      </p>
    </div>
  );
}
