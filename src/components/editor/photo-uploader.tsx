'use client';

import { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { Upload } from 'lucide-react';

interface PhotoUploaderProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
}

export function PhotoUploader({ profileData, onChange, userId }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await response.json();

      // Upload to R2
      // Note: Don't set Content-Type header - it's already included in the presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Update profile with new photo URL
      onChange({
        profilePhoto: {
          type: 'uploaded',
          value: publicUrl,
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <Input
              label="Photo URL"
              type="url"
              value={profileData.profilePhoto.value}
              onChange={(e) =>
                onChange({
                  profilePhoto: {
                    type: 'url',
                    value: e.target.value,
                  },
                })
              }
              placeholder="https://example.com/photo.jpg"
            />

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Or upload an image
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </div>
            </div>
          </div>

          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={profileData.profilePhoto.value}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/100';
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
