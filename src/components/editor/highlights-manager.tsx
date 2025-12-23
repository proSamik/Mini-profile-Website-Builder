'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Highlight } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Button } from '@/components/ui';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface HighlightsManagerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
}

export function HighlightsManager({ profileData, onChange }: HighlightsManagerProps) {
  const [showForm, setShowForm] = useState(false);

  const addHighlight = (highlightData: Omit<Highlight, 'id' | 'displayOrder'>) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: nanoid(),
      displayOrder: profileData.highlights.length,
    };

    onChange({
      highlights: [...profileData.highlights, newHighlight],
    });
  };

  const updateHighlight = (highlightId: string, updates: Partial<Highlight>) => {
    onChange({
      highlights: profileData.highlights.map((highlight) =>
        highlight.id === highlightId ? { ...highlight, ...updates } : highlight
      ),
    });
  };

  const deleteHighlight = (highlightId: string) => {
    onChange({
      highlights: profileData.highlights.filter((highlight) => highlight.id !== highlightId),
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(profileData.highlights);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order
    const updatedHighlights = items.map((highlight, index) => ({
      ...highlight,
      displayOrder: index,
    }));

    onChange({ highlights: updatedHighlights });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Highlights</CardTitle>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Highlight
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <HighlightForm
            onSubmit={(highlight) => {
              addHighlight(highlight);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId="highlights-list"
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-gray-50 dark:bg-gray-900/20' : ''}`}
              >
                {profileData.highlights.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                    No highlights added yet
                  </p>
                ) : (
                  profileData.highlights.map((highlight, index) => (
                    <Draggable key={highlight.id} draggableId={highlight.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 bg-gray-100 dark:bg-gray-700 rounded-lg ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            <div {...provided.dragHandleProps} className="flex items-center">
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>

                            <Input
                              value={highlight.title}
                              onChange={(e) =>
                                updateHighlight(highlight.id, { title: e.target.value })
                              }
                              placeholder="Title"
                              className="!mb-0 flex-1"
                            />

                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => deleteHighlight(highlight.id)}
                              className="shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <Textarea
                            value={highlight.description || ''}
                            onChange={(e) =>
                              updateHighlight(highlight.id, { description: e.target.value })
                            }
                            placeholder="Description"
                            className="!mb-2"
                            rows={2}
                          />

                          <Input
                            value={highlight.image || ''}
                            onChange={(e) =>
                              updateHighlight(highlight.id, { image: e.target.value })
                            }
                            placeholder="Image URL (optional)"
                            className="!mb-2"
                          />

                          <Input
                            value={highlight.url || ''}
                            onChange={(e) =>
                              updateHighlight(highlight.id, { url: e.target.value })
                            }
                            placeholder="Project URL (optional)"
                            className="!mb-0"
                          />
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

function HighlightForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (highlight: Omit<Highlight, 'id' | 'displayOrder'>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onSubmit({
        title,
        description: description || undefined,
        image: image || undefined,
        url: url || undefined,
      });
      setTitle('');
      setDescription('');
      setImage('');
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Project title"
        required
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Tell us about this highlight..."
        rows={3}
      />
      <Input
        label="Image URL"
        type="url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://..."
      />
      <Input
        label="Project URL"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
      />
      <div className="flex gap-2 mt-4">
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
