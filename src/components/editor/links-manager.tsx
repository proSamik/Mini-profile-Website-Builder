'use client';

import { useState, useMemo } from 'react';
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

  const addLink = (linkData: Omit<Link, 'id' | 'displayOrder'>) => {
    const newLink: Link = {
      ...linkData,
      id: nanoid(),
      displayOrder: profileData.links.length,
    };

    onChange({
      links: [...profileData.links, newLink],
    });
  };

  const updateLink = async (linkId: string, updates: Partial<Link>) => {
    // If URL is being updated, fetch the favicon
    if (updates.url) {
      try {
        const favicon = await getFaviconUrl(updates.url);
        if (favicon) {
          updates.favicon = favicon;
        }
      } catch (error) {
        console.error('Error fetching favicon:', error);
      }
    }

    onChange({
      links: profileData.links.map((link) =>
        link.id === linkId ? { ...link, ...updates } : link
      ),
    });
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
      className={`flex gap-2 p-3 bg-accent rounded-lg ${
        isDragging ? 'shadow-lg opacity-50 z-50' : ''
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>

      <Input
        value={link.label}
        onChange={(e) => onUpdate(link.id, { label: e.target.value })}
        placeholder="Label"
        className="!mb-0 flex-1"
      />

      <Input
        value={link.url}
        onChange={(e) => onUpdate(link.id, { url: e.target.value })}
        placeholder="URL"
        className="!mb-0 flex-1"
      />

      <Button
        size="sm"
        variant="danger"
        onClick={() => onDelete(link.id)}
        className="shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
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
