'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Link } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getFaviconUrl } from '@/lib/utils/favicon';

interface LinksManagerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function LinksManager({ profileData, onChange }: LinksManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const faviconTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const linksRef = useRef(profileData.links);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort links by displayOrder
  const sortedLinks = useMemo(
    () => [...profileData.links].sort((a, b) => a.displayOrder - b.displayOrder),
    [profileData.links]
  );

  // Keep ref updated with latest links
  useEffect(() => {
    linksRef.current = profileData.links;
  }, [profileData.links]);

  // Fetch favicons for links that don't have one
  useEffect(() => {
    const fetchMissingFavicons = async () => {
      const linksWithoutFavicons = profileData.links.filter(
        (link) => link.url && !link.favicon
      );

      for (const link of linksWithoutFavicons) {
        try {
          const favicon = await getFaviconUrl(link.url);
          if (favicon) {
            // Update this specific link with the favicon
            onChange({
              links: profileData.links.map((l) =>
                l.id === link.id ? { ...l, favicon } : l
              ),
            });
          }
        } catch (error) {
          console.error('Error fetching favicon:', error);
        }
      }
    };

    // Only fetch on initial mount or when links change
    if (profileData.links.length > 0) {
      fetchMissingFavicons();
    }
  }, [profileData.links.length]); // Only run when the number of links changes

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      faviconTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const addLink = async (linkData: Omit<Link, 'id' | 'displayOrder'>) => {
    // Fetch favicon for the new link
    let favicon: string | undefined = undefined;
    if (linkData.url) {
      try {
        const fetchedFavicon = await getFaviconUrl(linkData.url);
        if (fetchedFavicon) {
          favicon = fetchedFavicon;
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      }
    }

    const newLink: Link = {
      ...linkData,
      id: nanoid(),
      displayOrder: profileData.links.length,
      favicon,
    };

    onChange({
      links: [...profileData.links, newLink],
    });
  };

  const updateLink = (linkId: string, updates: Partial<Link>) => {
    // Update the link immediately with the provided updates
    onChange({
      links: profileData.links.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    });

    // If URL is being updated, fetch the favicon
    if (updates.url) {
      // Clear existing timeout for this link
      const existingTimeout = faviconTimeouts.current.get(linkId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new timeout to fetch favicon after 1 second of no changes
      const timeout = setTimeout(async () => {
        try {
          const favicon = await getFaviconUrl(updates.url!);
          if (favicon) {
            const updatedLinks = linksRef.current.map((link) =>
              link.id === linkId ? { ...link, favicon } : link
            );
            onChange({
              links: updatedLinks,
            });
          }
        } catch (error) {
          console.error('Error fetching favicon:', error);
        }
        faviconTimeouts.current.delete(linkId);
      }, 1000);

      faviconTimeouts.current.set(linkId, timeout);
    }
  };

  const deleteLink = (linkId: string) => {
    onChange({
      links: profileData.links.filter((link) => link.id !== linkId),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sortedLinks.findIndex((link) => link.id === active.id);
    const newIndex = sortedLinks.findIndex((link) => link.id === over.id);

    const reorderedLinks = arrayMove(sortedLinks, oldIndex, newIndex);

    // Update display order
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      displayOrder: index,
    }));

    onChange({ links: updatedLinks });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Links</CardTitle>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Link
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <LinkForm
            onSubmit={(link) => {
              addLink(link);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedLinks.map((link) => link.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sortedLinks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No links added yet
                </p>
              ) : (
                sortedLinks.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}

function SortableLinkItem({
  link,
  onUpdate,
  onDelete,
}: {
  link: Link;
  onUpdate: (linkId: string, updates: Partial<Link>) => void;
  onDelete: (linkId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 bg-accent rounded-lg border-2 border-border ${
        isDragging ? 'shadow-lg opacity-50 z-50' : ''
      }`}
    >
      {/* Close button in top right */}
      <button
        type="button"
        onClick={() => onDelete(link.id)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Drag handle and inputs */}
      <div className="flex gap-3 pr-10">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center cursor-grab active:cursor-grabbing pt-2"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-2">
          <Input
            value={link.label}
            onChange={(e) => onUpdate(link.id, { label: e.target.value })}
            placeholder="Label"
            className="!mb-0"
          />

          <Input
            value={link.url}
            onChange={(e) => onUpdate(link.id, { url: e.target.value })}
            placeholder="URL"
            className="!mb-0"
          />
        </div>
      </div>
    </div>
  );
}

function LinkForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (link: Omit<Link, 'id' | 'displayOrder'>) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (label && url) {
      setLoading(true);
      try {
        const favicon = await getFaviconUrl(url);
        onSubmit({
          label,
          url,
          icon: label.toLowerCase(),
          favicon: favicon || undefined,
        });
        setLabel('');
        setUrl('');
      } catch (error) {
        console.error('Error fetching favicon:', error);
        onSubmit({
          label,
          url,
          icon: label.toLowerCase(),
        });
        setLabel('');
        setUrl('');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-accent rounded-lg mb-4">
      <Input
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g., GitHub"
        required
      />
      <Input
        label="URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        required
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
