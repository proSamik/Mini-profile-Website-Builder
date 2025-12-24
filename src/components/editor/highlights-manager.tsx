'use client';

import { useState, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { ProfileData, Highlight } from '@/types/profile';
import { Card, CardHeader, CardTitle, CardContent, Input, Textarea, Button, Modal } from '@/components/ui';
import { ImageCropper } from '@/components/ui/image-cropper';
import { Plus, Trash2, GripVertical, Upload, Edit } from 'lucide-react';
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
  const [imageToCrop, setImageToCrop] = useState<{ 
    highlightId: string; 
    imageData: string; 
    existingImageUrl?: string; // Track if we're editing an existing image
  } | null>(null);

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

  const handleCropComplete = async (highlightId: string, croppedBlob: Blob, existingImageUrl?: string) => {
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

      // Find the highlight and update images
      const highlight = profileData.highlights.find((h) => h.id === highlightId);
      if (highlight) {
        const existingImages = highlight.images ?? [];
        let newImages: string[];
        
        if (existingImageUrl) {
          // Replace the existing image
          newImages = existingImages.map((img) => img === existingImageUrl ? publicUrl : img);
        } else {
          // Add new image
          newImages = [...existingImages, publicUrl];
        }
        
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
                    onImageEdit={(imageData, existingImageUrl) => {
                      console.log('onImageEdit called:', { imageData: imageData.substring(0, 20), existingImageUrl });
                      if (imageData === 'loading') {
                        // Show modal with loading state
                        console.log('Setting modal to loading state');
                        setImageToCrop({ highlightId: highlight.id, imageData: '', existingImageUrl });
                      } else if (imageData === '') {
                        // Close modal
                        console.log('Closing modal');
                        setImageToCrop(null);
                      } else {
                        // Update with actual image data
                        console.log('Setting modal with image data');
                        setImageToCrop({ highlightId: highlight.id, imageData, existingImageUrl });
                      }
                    }}
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
        {imageToCrop.imageData ? (
          <ImageCropper
            image={imageToCrop.imageData}
            onCropComplete={(blob) => handleCropComplete(imageToCrop.highlightId, blob, imageToCrop.existingImageUrl)}
            onCancel={() => setImageToCrop(null)}
            aspect={16 / 9}
            cropShape="rect"
          />
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading image...</p>
            </div>
          </div>
        )}
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
  onImageEdit,
}: {
  highlight: Highlight;
  uploadingIds: Set<string>;
  onUpdate: (highlightId: string, updates: Partial<Highlight>) => void;
  onDelete: (highlightId: string) => void;
  onFileSelect: (highlightId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (highlightId: string, imageUrl: string) => void;
  onImageDragEnd: (highlightId: string, event: DragEndEvent) => void;
  onImageEdit: (imageData: string, existingImageUrl: string) => void;
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
      className={`relative p-4 bg-accent rounded-lg border-2 border-border ${
        isDragging ? 'shadow-lg opacity-50 z-50' : ''
      }`}
    >
      {/* Close button in top right */}
      <button
        type="button"
        onClick={() => onDelete(highlight.id)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Drag handle and title */}
      <div className="flex gap-3 mb-3 pr-10">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center cursor-grab active:cursor-grabbing pt-2"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>

        <Input
          value={highlight.title}
          onChange={(e) => onUpdate(highlight.id, { title: e.target.value })}
          placeholder="Title"
          className="!mb-0 flex-1"
        />
      </div>

      <div className="pl-8">
        <Textarea
          value={highlight.description || ''}
          onChange={(e) => onUpdate(highlight.id, { description: e.target.value })}
          placeholder="Description"
          className="!mb-3"
          rows={2}
        />

        <div className="space-y-2 mb-3">
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
                      onEdit={(imageData, existingUrl) => {
                        console.log('SortableImageItem onEdit called');
                        onImageEdit(imageData, existingUrl);
                      }}
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
    </div>
  );
}

function SortableImageItem({
  imageUrl,
  highlightTitle,
  onRemove,
  onEdit,
}: {
  imageUrl: string;
  highlightTitle: string;
  onRemove: () => void;
  onEdit: (imageData: string, existingImageUrl: string) => void;
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
    >
      {/* Image container */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={highlightTitle}
          className="w-32 h-18 object-cover rounded border-2 border-gray-300 dark:border-gray-600"
          style={{ aspectRatio: '16/9' }}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/128x72';
          }}
        />
        
        {/* Drag handle overlay */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1 left-1 p-1 bg-black/30 rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>
        
        {/* Edit overlay */}
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            console.log('Edit button clicked for image:', imageUrl);
            
            // Open modal immediately with a loading placeholder
            onEdit('loading', imageUrl);
            console.log('Modal should be open now');
            
            try {
              // Use proxy to avoid CORS issues
              const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
              console.log('Fetching image via proxy:', proxyUrl);
              const response = await fetch(proxyUrl);
              
              if (!response.ok) {
                throw new Error('Failed to fetch image');
              }
              
              const blob = await response.blob();
              console.log('Image blob received, size:', blob.size);
              const reader = new FileReader();
              reader.onload = () => {
                console.log('Image converted to data URL, updating modal');
                // Update the modal with the actual image data
                onEdit(reader.result as string, imageUrl);
              };
              reader.onerror = () => {
                throw new Error('Failed to read image');
              };
              reader.readAsDataURL(blob);
            } catch (error) {
              console.error('Failed to load image for editing:', error);
              alert('Unable to edit this image. Please delete it and upload a new one.');
              // Close the modal
              onEdit('', '');
            }
          }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Edit className="w-5 h-5 text-white" />
        </button>
      </div>
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
