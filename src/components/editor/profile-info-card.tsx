'use client';

import { useState, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Button, Modal } from '@/components/ui';
import { CheckCircle2, XCircle, Loader2, Edit, Upload, Trash2 } from 'lucide-react';
import { ImageCropper } from '@/components/ui/image-cropper';

interface ProfileInfoCardProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
  onUsernameValidChange?: (isValid: boolean) => void;
}

export function ProfileInfoCard({ profileData, onChange, userId, onUsernameValidChange }: ProfileInfoCardProps) {
  const [checking, setChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(true);
  const [originalUsername] = useState(profileData.username);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  useEffect(() => {
    const username = profileData.username.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (username !== profileData.username) {
      onChange({ username });
      return;
    }

    if (username.length < 3) {
      setUsernameAvailable(false);
      onUsernameValidChange?.(false);
      return;
    }

    if (username === originalUsername) {
      setUsernameAvailable(true);
      onUsernameValidChange?.(true);
      return;
    }

    const timeout = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/profiles/check-username?username=${encodeURIComponent(username)}&excludeUserId=${encodeURIComponent(userId)}`
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
        onUsernameValidChange?.(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(false);
        onUsernameValidChange?.(false);
      } finally {
        setChecking(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [profileData.username, originalUsername, onChange, onUsernameValidChange, userId]);

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

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: croppedBlob,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

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
          <CardTitle>Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Row 1: Profile Photo (left) | Username (right) */}
            <div className="grid grid-cols-2 gap-4 items-start">
              {/* Left: Profile Photo */}
              <div className="flex flex-col items-center gap-3">
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

              {/* Right: Username */}
              <div className="relative">
                <Input
                  label="Username"
                  value={profileData.username}
                  onChange={(e) => onChange({ username: e.target.value.toLowerCase() })}
                  placeholder="username"
                  error={usernameAvailable === false && profileData.username.length >= 3 ? 'Username taken' : undefined}
                />
                <div className="absolute right-3 top-[44px]">
                  {checking && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
                  {!checking && usernameAvailable === true && profileData.username.length >= 3 && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {!checking && usernameAvailable === false && profileData.username.length >= 3 && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Row 2: Display Name (full width) */}
            <div>
              <Input
                label="Display Name"
                value={profileData.displayName}
                onChange={(e) => onChange({ displayName: e.target.value })}
                placeholder="Your Name"
              />
            </div>

            {/* Row 3: Bio (full width) */}
            <div>
              <Textarea
                label={`Bio (${profileData.bio.length}/160)`}
                value={profileData.bio}
                onChange={(e) => onChange({ bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength={160}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Edit Modal */}
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
                <div className="relative w-32 h-32 group">
                  {hasPhoto ? (
                    <>
                      <img
                        src={profileData.profilePhoto.value}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setUploading(true);
                            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(profileData.profilePhoto.value)}`;
                            const response = await fetch(proxyUrl);

                            if (!response.ok) {
                              throw new Error('Failed to fetch image');
                            }

                            const blob = await response.blob();
                            const reader = new FileReader();
                            reader.onload = () => {
                              setImageToCrop(reader.result as string);
                              setUploading(false);
                            };
                            reader.onerror = () => {
                              throw new Error('Failed to read image');
                            };
                            reader.readAsDataURL(blob);
                          } catch (error) {
                            console.error('Failed to load image for editing:', error);
                            setUploading(false);
                            alert('Unable to edit this image. Please remove it and upload a new one.');
                          }
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-6 h-6 text-white" />
                      </button>
                    </>
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
