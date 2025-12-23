'use client';

import { useState, useCallback, useEffect } from 'react';
import { ProfileData } from '@/types/profile';
import { getDefaultProfileData } from '@/lib/utils/defaults';

export function useProfile(userId: string) {
  const [profileData, setProfileData] = useState<ProfileData>(getDefaultProfileData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load profile from database
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const response = await fetch(`/api/profiles?userId=${userId}`);

        if (response.ok) {
          const data = await response.json();
          setProfileData(data.profileData);
        } else if (response.status === 404) {
          // Profile doesn't exist yet, use default
          setProfileData(getDefaultProfileData());
        } else {
          throw new Error('Failed to load profile');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Use default on error
        setProfileData(getDefaultProfileData());
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  // Update profile data
  const updateProfileData = useCallback((updates: Partial<ProfileData>) => {
    setProfileData((prev) => ({
      ...prev,
      ...updates,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Replace entire profile data (for JSON editor)
  const replaceProfileData = useCallback((newData: ProfileData) => {
    setProfileData(newData);
    setHasUnsavedChanges(true);
  }, []);

  // Save profile to database
  const saveProfile = useCallback(async () => {
    try {
      setSaving(true);

      // Check if profile exists first
      const checkResponse = await fetch(`/api/profiles?userId=${userId}`);
      const exists = checkResponse.ok;

      let response;
      if (exists) {
        // Update existing profile
        response = await fetch('/api/profiles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            profileData,
          }),
        });
      } else {
        // Create new profile
        response = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            username: profileData.username,
            profileData,
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save profile');
      }

      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to save profile');
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, profileData]);

  // Auto-save on changes (debounced)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeout = setTimeout(() => {
      saveProfile();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeout);
  }, [profileData, hasUnsavedChanges, saveProfile]);

  return {
    profileData,
    updateProfileData,
    replaceProfileData,
    saveProfile,
    loading,
    saving,
    hasUnsavedChanges,
  };
}
