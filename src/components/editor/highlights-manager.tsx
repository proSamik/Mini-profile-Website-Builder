'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Highlight } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Button } from '@/components/ui';
import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface HighlightsManagerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
}

export function HighlightsManager({ profileData, onChange, userId }: HighlightsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

  // Sort highlights by displayOrder
  const sortedHighlights = [...profileData.highlights].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleImageUpload = async (highlightId: string, files: FileList) => {
    try {
      setUploadingIds((prev) => new Set(prev).add(highlightId));

      const uploadPromises = Array.from(files).map(async (file) => {
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
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Find the highlight and add the new images
      const highlight = profileData.highlights.find((h) => h.id === highlightId);
      if (highlight) {
        const existingImages = highlight.images ?? [];
        updateHighlight(highlightId, { images: [...existingImages, ...uploadedUrls] });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image(s)');
    } finally {
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(highlightId);
        return next;
      });
    }
  };

  const removeImage = (highlightId: string, imageUrl: string) => {
    const highlight = profileData.highlights.find((h) => h.id === highlightId);
    if (highlight?.images) {
      const updatedImages = highlight.images.filter((img) => img !== imageUrl);
      updateHighlight(highlightId, { images: updatedImages });
    }
  };

  const reorderImages = (highlightId: string, startIndex: number, endIndex: number) => {
    const highlight = profileData.highlights.find((h) => h.id === highlightId);
    if (highlight?.images) {
      const images = Array.from(highlight.images);
      const [removed] = images.splice(startIndex, 1);
      images.splice(endIndex, 0, removed);
      updateHighlight(highlightId, { images });
    }
  };

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

    const items = Array.from(sortedHighlights);
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
            userId={userId}
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
                className={`space-y-3 ${snapshot.isDraggingOver ? 'bg-muted' : ''}`}
              >
                {profileData.highlights.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    No highlights added yet
                  </p>
                ) : (
                  sortedHighlights.map((highlight, index) => (
                    <Draggable key={highlight.id} draggableId={highlight.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 bg-accent rounded-lg ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            <div {...provided.dragHandleProps} className="flex items-center">
                              <GripVertical className="w-5 h-5 text-muted-foreground" />
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

                          <div className="space-y-2 mb-2">
                            <div className="flex gap-2 items-center">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                  const files = e.target.files;
                                  if (files && files.length > 0) handleImageUpload(highlight.id, files);
                                }}
                                className="hidden"
                                id={`image-upload-${highlight.id}`}
                                disabled={uploadingIds.has(highlight.id)}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  document.getElementById(`image-upload-${highlight.id}`)?.click()
                                }
                                disabled={uploadingIds.has(highlight.id)}
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                {uploadingIds.has(highlight.id) ? 'Uploading...' : 'Upload Images'}
                              </Button>
                            </div>

                            {/* Display uploaded images */}
                            {highlight.images && highlight.images.length > 0 && (
                              <div className="flex gap-2 flex-wrap mt-2">
                                {(highlight.images ?? []).map((imageUrl, imgIndex) => (
                                  <div key={imageUrl} className="relative group">
                                    <img
                                      src={imageUrl}
                                      alt={`${highlight.title} ${imgIndex + 1}`}
                                      className="w-20 h-20 object-cover rounded border-2 border-gray-300 dark:border-gray-600"
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/80';
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(highlight.id, imageUrl)}
                                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

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
  userId,
}: {
  onSubmit: (highlight: Omit<Highlight, 'id' | 'displayOrder'>) => void;
  onCancel: () => void;
  userId: string;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (files: FileList) => {
    try {
      setUploading(true);

      const uploadPromises = Array.from(files).map(async (file) => {
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
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image(s)');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (imageUrl: string) => {
    setImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title) {
      onSubmit({
        title,
        description: description || undefined,
        images: images.length > 0 ? images : undefined,
        url: url || undefined,
      });
      setTitle('');
      setDescription('');
      setImages([]);
      setUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-accent rounded-lg mb-4">
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
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Images</label>
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) handleImageUpload(files);
            }}
            className="hidden"
            id="form-image-upload"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('form-image-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-1" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((imageUrl, index) => (
              <div key={imageUrl} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border-2 border-gray-300 dark:border-gray-600"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/80';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(imageUrl)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
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
