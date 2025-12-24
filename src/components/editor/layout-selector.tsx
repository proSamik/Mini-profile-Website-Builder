'use client';

import { ProfileData, ProfileLayout } from '@/types/profile';

interface LayoutSelectorProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

const layoutOptions: { value: ProfileLayout; label: string; description: string }[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Centered vertical layout with photo, name, username, and bio',
  },
  {
    value: 'layout1',
    label: 'Layout 1',
    description: 'Photo & username on left, display name & bio on right',
  },
  {
    value: 'layout2',
    label: 'Layout 2',
    description: 'Display name & bio on left, photo & username on right',
  },
  {
    value: 'layout3',
    label: 'Layout 3',
    description: 'Photo on left, name & username on right, centered bio below',
  },
  {
    value: 'layout4',
    label: 'Layout 4',
    description: 'Photo & username stacked on left, name & bio on right, highlights then links',
  },
];

export function LayoutSelector({ profileData, onChange }: LayoutSelectorProps) {
  const currentLayout = profileData.layout || 'default';

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-card-foreground mb-4">Profile Layout</h2>

      <div className="space-y-3">
        {layoutOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ layout: option.value })}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              currentLayout === option.value
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-card-foreground">{option.label}</h3>
                  {currentLayout === option.value && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
              </div>

              {/* Visual indicator */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ml-3 ${
                currentLayout === option.value
                  ? 'border-primary bg-primary'
                  : 'border-border'
              }`}>
                {currentLayout === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
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
