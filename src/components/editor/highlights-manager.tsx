'use client';

import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Highlight } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Button, Modal } from '@/components/ui';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Plus, Trash2, GripVertical, Upload } from 'lucide-react';
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface HighlightsManagerProps {
  profileData: ProfileData;
  onChange: (updates: Partial<ProfileData>) => void;
  userId: string;
}

export function HighlightsManager({ profileData, onChange, userId }: HighlightsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());
  const [imageToCrop, setImageToCrop] = useState<{ highlightId: string; imageData: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort highlights by displayOrder
  const sortedHighlights = useMemo(
    () => [...profileData.highlights].sort((a, b) => a.displayOrder - b.displayOrder),
    [profileData.highlights]
  );

  const handleFileSelect = (highlightId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop({ highlightId, imageData: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (highlightId: string, croppedBlob: Blob) => {
    try {
      setUploadingIds((prev) => new Set(prev).add(highlightId));

      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fileName: `highlight-${Date.now()}.jpg`,
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

      // Find the highlight and add the new image
      const highlight = profileData.highlights.find((h) => h.id === highlightId);
      if (highlight) {
        const existingImages = highlight.images ?? [];
        const newImages = [...existingImages, publicUrl];
        updateHighlight(highlightId, { images: newImages });
      }

      setImageToCrop(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
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

  const handleImageDragEnd = (highlightId: string, event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const highlight = profileData.highlights.find((h) => h.id === highlightId);
    if (!highlight?.images) return;

    const oldIndex = highlight.images.findIndex((img) => img === active.id);
    const newIndex = highlight.images.findIndex((img) => img === over.id);

    const reorderedImages = arrayMove(highlight.images, oldIndex, newIndex);
    updateHighlight(highlightId, { images: reorderedImages });
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sortedHighlights.findIndex((h) => h.id === active.id);
    const newIndex = sortedHighlights.findIndex((h) => h.id === over.id);

    const reorderedHighlights = arrayMove(sortedHighlights, oldIndex, newIndex);

    // Update display order
    const updatedHighlights = reorderedHighlights.map((highlight, index) => ({
      ...highlight,
      displayOrder: index,
    }));

    onChange({ highlights: updatedHighlights });
  };

  return (
    <>
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedHighlights.map((h) => h.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {sortedHighlights.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No highlights added yet
                </p>
              ) : (
                sortedHighlights.map((highlight) => (
                  <SortableHighlightItem
                    key={highlight.id}
                    highlight={highlight}
                    uploadingIds={uploadingIds}
                    onUpdate={updateHighlight}
                    onDelete={deleteHighlight}
                    onFileSelect={handleFileSelect}
                    onRemoveImage={removeImage}
                    onImageDragEnd={handleImageDragEnd}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>

    {/* Image Cropper Modal */}
    {imageToCrop && (
      <Modal
        isOpen={true}
        onClose={() => setImageToCrop(null)}
        title="Crop Image"
        size="lg"
      >
        <ImageCropper
          image={imageToCrop.imageData}
          onCropComplete={(blob) => handleCropComplete(imageToCrop.highlightId, blob)}
          onCancel={() => setImageToCrop(null)}
          aspect={16 / 9}
          cropShape="rect"
        />
      </Modal>
    )}
  </>
  );
}

function SortableHighlightItem({
  highlight,
  uploadingIds,
  onUpdate,
  onDelete,
  onFileSelect,
  onRemoveImage,
  onImageDragEnd,
}: {
  highlight: Highlight;
  uploadingIds: Set<string>;
  onUpdate: (highlightId: string, updates: Partial<Highlight>) => void;
  onDelete: (highlightId: string) => void;
  onFileSelect: (highlightId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (highlightId: string, imageUrl: string) => void;
  onImageDragEnd: (highlightId: string, event: DragEndEvent) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: highlight.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 bg-accent rounded-lg ${
        isDragging ? 'shadow-lg opacity-50 z-50' : ''
      }`}
    >
      <div className="flex gap-2 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <Input
          value={highlight.title}
          onChange={(e) => onUpdate(highlight.id, { title: e.target.value })}
          placeholder="Title"
          className="!mb-0 flex-1"
        />

        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(highlight.id)}
          className="shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <Textarea
        value={highlight.description || ''}
        onChange={(e) => onUpdate(highlight.id, { description: e.target.value })}
        placeholder="Description"
        className="!mb-2"
        rows={2}
      />

      <div className="space-y-2 mb-2">
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileSelect(highlight.id, e)}
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
            {uploadingIds.has(highlight.id) ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>

        {/* Display uploaded images with drag-and-drop reordering */}
        {highlight.images && highlight.images.length > 0 && (
          <DndContext
            sensors={[useSensor(PointerSensor)]}
            collisionDetection={closestCenter}
            onDragEnd={(event) => onImageDragEnd(highlight.id, event)}
          >
            <SortableContext
              items={highlight.images}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-2 flex-wrap mt-2">
                {highlight.images.map((imageUrl) => (
                  <SortableImageItem
                    key={imageUrl}
                    imageUrl={imageUrl}
                    highlightTitle={highlight.title}
                    onRemove={() => onRemoveImage(highlight.id, imageUrl)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Input
        value={highlight.url || ''}
        onChange={(e) => onUpdate(highlight.id, { url: e.target.value })}
        placeholder="Project URL (optional)"
        className="!mb-0"
      />
    </div>
  );
}

function SortableImageItem({
  imageUrl,
  highlightTitle,
  onRemove,
}: {
  imageUrl: string;
  highlightTitle: string;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: imageUrl });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'z-50 opacity-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      <img
        src={imageUrl}
        alt={highlightTitle}
        className="w-20 h-20 object-cover rounded border-2 border-gray-300 dark:border-gray-600 cursor-grab active:cursor-grabbing"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/80';
        }}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
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
