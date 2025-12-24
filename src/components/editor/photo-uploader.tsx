'use client';

import { useState } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Button, Modal, Input } from '@/components/ui';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Edit, Upload, Trash2 } from 'lucide-react';

interface PhotoUploaderProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
}

export function PhotoUploader({ profileData, onChange, userId }: PhotoUploaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getGradient = () => {
    const gradients = [
      'from-purple-400 via-pink-500 to-red-500',
      'from-blue-400 via-cyan-500 to-teal-500',
      'from-orange-400 via-red-500 to-pink-500',
      'from-green-400 via-emerald-500 to-cyan-500',
      'from-indigo-400 via-purple-500 to-pink-500',
      'from-yellow-400 via-orange-500 to-red-500',
    ];
    const index = profileData.displayName.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setUploading(true);

      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fileName: `profile-${Date.now()}.jpg`,
          contentType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = await response.json();

      // Upload to R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
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
      setImageToCrop(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (photoUrl) {
      onChange({
        profilePhoto: {
          type: 'url',
          value: photoUrl,
        },
      });
      setPhotoUrl('');
      setIsModalOpen(false);
    }
  };

  const handleRemovePhoto = () => {
    onChange({
      profilePhoto: {
        type: 'placeholder',
        value: '',
      },
    });
    setIsModalOpen(false);
  };

  const hasPhoto = profileData.profilePhoto.value && profileData.profilePhoto.type !== 'placeholder';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {/* Profile Photo Display */}
            <div className="relative w-32 h-32 flex-shrink-0">
              {hasPhoto ? (
                <img
                  src={profileData.profilePhoto.value}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const initials = getInitials(profileData.displayName);
                      const gradient = getGradient();
                      parent.innerHTML = `<div class="w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border-4 border-gray-200 dark:border-gray-700"><span class="text-white text-3xl font-bold">${initials}</span></div>`;
                    }
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center border-4 border-gray-200 dark:border-gray-700`}
                >
                  <span className="text-white text-3xl font-bold">
                    {getInitials(profileData.displayName)}
                  </span>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setImageToCrop(null);
        }}
        title="Edit Profile Photo"
        size="md"
      >
        <div className="space-y-6">
          {imageToCrop ? (
            <ImageCropper
              image={imageToCrop}
              onCropComplete={handleCropComplete}
              onCancel={() => setImageToCrop(null)}
            />
          ) : (
            <>
          {/* Current Photo Preview */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              {hasPhoto ? (
                <img
                  src={profileData.profilePhoto.value}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div
                  className={`w-full h-full rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center border-4 border-gray-200 dark:border-gray-700`}
                >
                  <span className="text-white text-3xl font-bold">
                    {getInitials(profileData.displayName)}
                  </span>
                </div>
              )}
            </div>
          </div>

              {/* Upload from System */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Upload from System
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="photo-upload-modal"
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => document.getElementById('photo-upload-modal')?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>

          {/* Or Use URL */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Or Use Image URL
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="!mb-0"
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleUrlSubmit}
                disabled={!photoUrl}
              >
                Save
              </Button>
            </div>
          </div>

              {/* Remove Photo */}
              {hasPhoto && (
                <div className="pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="danger"
                    size="md"
                    onClick={handleRemovePhoto}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
