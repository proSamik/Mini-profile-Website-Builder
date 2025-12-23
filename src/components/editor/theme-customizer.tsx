'use client';

import { ProfileData, Theme } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

interface ThemeCustomizerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function ThemeCustomizer({ profileData, onChange }: ThemeCustomizerProps) {
  const updateTheme = (themeUpdates: Partial<Theme>) => {
    onChange({
      theme: {
        ...profileData.theme,
        ...themeUpdates,
      },
    });
  };

  const layouts: Array<Theme['layout']> = ['centered', 'sidebar-left', 'sidebar-right'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Layout */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Layout
          </label>
          <div className="grid grid-cols-3 gap-2">
            {layouts.map((layout) => (
              <button
                key={layout}
                onClick={() => updateTheme({ layout })}
                className={`px-4 py-2 rounded-lg capitalize transition-colors text-sm ${
                  profileData.theme.layout === layout
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {layout.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'custom'] as const).map((scheme) => (
              <button
                key={scheme}
                onClick={() => updateTheme({ colorScheme: scheme })}
                className={`px-4 py-2 rounded-lg capitalize transition-colors text-sm ${
                  profileData.theme.colorScheme === scheme
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {scheme}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <ColorPicker
          label="Primary Color"
          value={profileData.theme.primaryColor}
          onChange={(color) => updateTheme({ primaryColor: color })}
        />

        <ColorPicker
          label="Secondary Color"
          value={profileData.theme.secondaryColor}
          onChange={(color) => updateTheme({ secondaryColor: color })}
        />

        <ColorPicker
          label="Accent Color"
          value={profileData.theme.accentColor}
          onChange={(color) => updateTheme({ accentColor: color })}
        />
      </CardContent>
    </Card>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
