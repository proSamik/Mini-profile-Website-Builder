'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Link } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Button } from '@/components/ui';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface LinksManagerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function LinksManager({ profileData, onChange }: LinksManagerProps) {
  const [showForm, setShowForm] = useState(false);

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

  const updateLink = (linkId: string, updates: Partial<Link>) => {
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(profileData.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order
    const updatedLinks = items.map((link, index) => ({
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="links-list"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-muted' : ''}`}
              >
                {profileData.links.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No links added yet
                  </p>
                ) : (
                  profileData.links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex gap-2 p-3 bg-accent rounded-lg ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="flex items-center">
                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                          </div>

                          <Input
                            value={link.label}
                            onChange={(e) => updateLink(link.id, { label: e.target.value })}
                            placeholder="Label"
                            className="!mb-0 flex-1"
                          />

                          <Input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, { url: e.target.value })}
                            placeholder="URL"
                            className="!mb-0 flex-1"
                          />

                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => deleteLink(link.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (label && url) {
      onSubmit({
        label,
        url,
        icon: label.toLowerCase(),
      });
      setLabel('');
      setUrl('');
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
        <Button type="submit" size="sm">
          Add
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
