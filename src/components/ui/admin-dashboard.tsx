"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Eye,
  GripVertical,
  Plus,
  Save,
  X,
  AlertCircle,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react'
import { Button } from './button'
// Simple drag and drop implementation using HTML5 API

// Import the CarouselImage type from useAdminImages
import type { CarouselImage } from '@/hooks/useAdminImages';

interface AdminDashboardProps {
  images?: CarouselImage[]
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
  onImageUpload?: (files: FileList) => void
  onImageDelete?: (id: string) => void
  onImageUpdate?: (id: string, updates: Partial<CarouselImage>) => void
  onImageReorder?: (imageIds: string[]) => void
  maxImages?: number
  allowedFormats?: string[]
  maxFileSize?: number
}

// Simple Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm ${className}`}>
    {children}
  </div>
)

// Simple Input Component
const Input: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  id?: string
}> = ({ value, onChange, placeholder, className = '', id }) => (
  <input
    id={id}
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:placeholder:text-slate-400 ${className}`}
  />
)

// Simple Textarea Component
const Textarea: React.FC<{
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  id?: string
  rows?: number
}> = ({ value, onChange, placeholder, className = '', id, rows = 3 }) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`flex min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:placeholder:text-slate-400 ${className}`}
  />
)

// Simple Label Component
const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
)

// Simple Badge Component
const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' }> = ({ children, variant = 'default' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === 'default' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
      : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
  }`}>
    {children}
  </span>
)

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ImageCard Component
interface ImageCardProps {
  image: CarouselImage
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<CarouselImage>) => void
  onPreview: (image: CarouselImage) => void
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete, onUpdate, onPreview }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: image.title,
    description: image.description || '',
    alt: image.alt
  })

  const handleSave = () => {
    onUpdate(image.id, editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      title: image.title,
      description: image.description || '',
      alt: image.alt
    })
    setIsEditing(false)
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Image
          src={image.url}
          alt={image.alt}
          width={300}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 transition-transform duration-150 hover:scale-105"
            onClick={() => onPreview(image)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 transition-transform duration-150 hover:scale-105"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 transition-transform duration-150 hover:scale-105"
            onClick={() => onDelete(image.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant={image.isActive ? "default" : "secondary"}>
            {image.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <GripVertical className="w-5 h-5 text-white/70 cursor-grab active:cursor-grabbing" />
        </div>
      </div>
      
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <Label htmlFor={`title-${image.id}`} className="text-sm font-medium">
                Title
              </Label>
              <Input
                id={`title-${image.id}`}
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`description-${image.id}`} className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id={`description-${image.id}`}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor={`alt-${image.id}`} className="text-sm font-medium">
                Alt Text
              </Label>
              <Input
                id={`alt-${image.id}`}
                value={editForm.alt}
                onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="w-full"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{image.title}</h3>
            {image.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {image.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{image.dimensions.width} × {image.dimensions.height}</span>
              <span>{formatFileSize(image.size)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Order: {image.order}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onUpdate(image.id, { isActive: !image.isActive })}
              >
                {image.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

// ImageUploadZone Component
interface ImageUploadZoneProps {
  onFileUpload: (files: FileList) => void
  maxFiles?: number
  allowedFormats?: string[]
  maxFileSize?: number
}

const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({ 
  onFileUpload, 
  maxFiles = 10, 
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp'], 
  maxFileSize = 5 * 1024 * 1024 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files)
    }
  }

  return (
    <Card className="p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105' 
            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Drop images here or click to browse
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Supports: {allowedFormats.join(', ')} • Max: {formatFileSize(maxFileSize)} • Limit: {maxFiles} files
        </p>
        <Button 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Images
        </Button>
      </div>
    </Card>
  )
}

// Main AdminDashboard Component
export default function AdminDashboard({
  images = [],
  isLoading = false,
  hasError = false,
  onRetry,
  onImageUpload,
  onImageDelete,
  onImageUpdate,
  onImageReorder,
  maxImages = 20,
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize = 5 * 1024 * 1024
}: AdminDashboardProps) {
  const [selectedImage, setSelectedImage] = useState<CarouselImage | null>(null)
  const [localImages, setLocalImages] = useState<CarouselImage[]>(images)
  const [isReordering, setIsReordering] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Update local images when props change
  React.useEffect(() => {
    setLocalImages(images)
  }, [images])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isReordering) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    if (!isReordering || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedIndex === index) return;
    
    const newImages = [...localImages];
    const [movedImage] = newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, movedImage);
    
    setLocalImages(newImages);
    setDraggedIndex(index);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isReordering || draggedIndex === null) return;
    
    try {
      // Update the order in the parent component
      if (onImageReorder) {
        await onImageReorder(localImages.map(img => img.id));
        // Show success feedback
        alert('Die neue Reihenfolge wurde erfolgreich gespeichert.');
      }
    } catch (error) {
      console.error('Fehler beim Speichern der neuen Reihenfolge:', error);
      alert('Es gab ein Problem beim Speichern der neuen Reihenfolge. Bitte versuchen Sie es erneut.');
      // Reset to original order on error
      setLocalImages(images);
    } finally {
      setDraggedIndex(null);
    }
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Failed to load dashboard data. Please try again.
        </h3>
        {onRetry && (
          <Button onClick={onRetry} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center p-8">
        <ImageIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No images uploaded yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Start building your carousel by uploading reference images.
        </p>
        {onImageUpload && (
          <ImageUploadZone
            onFileUpload={onImageUpload}
            maxFiles={maxImages}
            allowedFormats={allowedFormats}
            maxFileSize={maxFileSize}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {onImageUpload && images.length < maxImages && (
        <ImageUploadZone
          onFileUpload={onImageUpload}
          maxFiles={maxImages - images.length}
          allowedFormats={allowedFormats}
          maxFileSize={maxFileSize}
        />
      )}

      {/* Reorder Controls */}
      <div className="flex justify-end mb-4">
        <Button
          variant={isReordering ? 'default' : 'outline'}
          onClick={() => setIsReordering(!isReordering)}
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowUpDown className="w-4 h-4" />
          {isReordering ? 'Done Reordering' : 'Reorder Images'}
        </Button>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {localImages.map((image, index) => (
          <div
            key={image.id}
            draggable={isReordering}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            className={`relative transition-all duration-200 transform ${isReordering ? 'cursor-move hover:scale-[1.02]' : ''} ${
              draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-lg'
            }`}
          >
            <ImageCard
              image={image}
              onDelete={onImageDelete || (() => {})}
              onUpdate={onImageUpdate || (() => {})}
              onPreview={setSelectedImage}
            />
            {isReordering && (
              <div className="absolute -left-2 -top-2 bg-blue-500 text-white p-1 rounded-full">
                <GripVertical className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedImage.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              <Image
                src={selectedImage.url}
                alt={selectedImage.alt}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg mb-4"
              />
              {selectedImage.description && (
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {selectedImage.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Dimensions:</span>
                  <br />
                  {selectedImage.dimensions.width} × {selectedImage.dimensions.height}
                </div>
                <div>
                  <span className="font-medium">File Size:</span>
                  <br />
                  {formatFileSize(selectedImage.size)}
                </div>
                <div>
                  <span className="font-medium">Order:</span>
                  <br />
                  {selectedImage.order}
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <br />
                  <Badge variant={selectedImage.isActive ? "default" : "secondary"}>
                    {selectedImage.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
