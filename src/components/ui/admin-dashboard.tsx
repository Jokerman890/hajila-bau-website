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
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface CarouselImage {
  id: string
  url: string
  title: string
  description?: string
  alt: string
  order: number
  isActive: boolean
  uploadedAt: Date
  size: number
  dimensions: {
    width: number
    height: number
  }
}

interface AdminDashboardProps {
  images?: CarouselImage[]
  isLoading?: boolean
  hasError?: boolean
  onRetry?: () => void
  onImageUpload?: (files: FileList) => void
  onImageDelete?: (id: string) => void
  onImageUpdate?: (id: string, updates: Partial<CarouselImage>) => void
  onImageReorder?: (imageIds: string[]) => Promise<void> // Temporarily commented out to fix ESLint error
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

// Simple Button Component
const Button: React.FC<{ 
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  disabled?: boolean
}> = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  className = '',
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
  }
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    default: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

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
const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'secondary' }> = ({ children, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
  }
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

// Simple Alert Component
const Alert: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative w-full rounded-lg border p-4 ${className}`}>
    {children}
  </div>
)

const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
)

const ImageUploadZone: React.FC<{
  onFileUpload: (files: FileList) => void
  maxFiles?: number
  allowedFormats?: string[]
  maxFileSize?: number
}> = ({ onFileUpload, maxFiles = 10, allowedFormats = ['image/jpeg', 'image/png', 'image/webp'], maxFileSize = 5 * 1024 * 1024 }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
          isDragOver ? 'text-blue-500' : 'text-slate-400'
        }`} />
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Upload Reference Images</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
          <p>Maximum {maxFiles} images</p>
          <p>Supported formats: JPEG, PNG, WebP</p>
          <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  )
}

const ImageCard: React.FC<{
  image: CarouselImage
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<CarouselImage>) => void
  onPreview: (image: CarouselImage) => void
}> = ({ image, onDelete, onUpdate, onPreview }) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Image
          src={image.url}
          alt={image.alt}
          width={800}
          height={600}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPreview(image)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(image.id)}
            className="h-8 w-8 p-0"
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
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
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
                size="sm"
                variant="outline"
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

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <div className="w-full h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  </div>
)

const ErrorState: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
    <AlertCircle className="h-4 w-4 text-red-600" />
    <AlertDescription className="text-red-800 dark:text-red-200">
      Failed to load dashboard data. Please try again.
      {onRetry && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry}
          className="ml-2"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      )}
    </AlertDescription>
  </Alert>
)

const EmptyState: React.FC<{ onUpload: () => void }> = ({ onUpload }) => (
  <Card className="p-12 text-center">
    <ImageIcon className="w-16 h-16 mx-auto text-slate-400 mb-4" />
    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Images Uploaded</h3>
    <p className="text-slate-600 dark:text-slate-400 mb-4">
      Start building your carousel by uploading reference images.
    </p>
    <Button onClick={onUpload}>
      <Plus className="w-4 h-4 mr-2" />
      Upload Images
    </Button>
  </Card>
)

const AdminDashboard: React.FC<AdminDashboardProps> = ({
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
}) => {
  const [activeTab, setActiveTab] = useState('gallery')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (files: FileList) => {
    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 3000)
    onImageUpload?.(files)
  }

  const handleImageDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      onImageDelete?.(id)
    }
  }

  const handleImagePreview = (image: CarouselImage) => {
    window.open(image.url, '_blank')
  }

  const activeImages = images.filter(img => img.isActive)
  const inactiveImages = images.filter(img => !img.isActive)
  const totalSize = images.reduce((sum, img) => sum + img.size, 0)

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (hasError) {
    return <ErrorState onRetry={onRetry} />
  }

  return (
    <div className="space-y-6 p-6 bg-transparent">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Carousel Admin</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your reference images for the carousel</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={() => fileInputRef.current?.click()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedFormats.join(',')}
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Images</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{images.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Active Images</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeImages.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Storage Used</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{(totalSize / 1024 / 1024).toFixed(1)}MB</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Available Slots</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{maxImages - images.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {uploadSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Images uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="border-t border-slate-200 dark:border-slate-700" />

      {/* Simple Tab Navigation */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {images.length === 0 ? (
              <EmptyState onUpload={() => setActiveTab('upload')} />
            ) : (
              <div className="space-y-6">
                {/* Active Images */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Active Images ({activeImages.length})</h2>
                    <Badge variant="default">Visible in Carousel</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeImages.map(image => (
                      <ImageCard
                        key={image.id}
                        image={image}
                        onDelete={handleImageDelete}
                        onUpdate={onImageUpdate!}
                        onPreview={handleImagePreview}
                      />
                    ))}
                  </div>
                </div>

                {/* Inactive Images */}
                {inactiveImages.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Inactive Images ({inactiveImages.length})</h2>
                      <Badge variant="secondary">Hidden from Carousel</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {inactiveImages.map(image => (
                        <ImageCard
                          key={image.id}
                          image={image}
                          onDelete={handleImageDelete}
                          onUpdate={onImageUpdate!}
                          onPreview={handleImagePreview}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <ImageUploadZone
              onFileUpload={handleFileUpload}
              maxFiles={maxImages}
              allowedFormats={allowedFormats}
              maxFileSize={maxFileSize}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Carousel Preview</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                This is how your active images will appear in the carousel
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeImages.slice(0, 6).map(image => (
                  <div key={image.id} className="relative group">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={800}
                      height={600}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Order: {image.order}</span>
                    </div>
                  </div>
                ))}
              </div>
              {activeImages.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No active images to preview. Activate some images to see them here.
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
