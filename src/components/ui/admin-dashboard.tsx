"use client"

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { translations, Language } from '@/lib/translations'
import { CarouselImage, formatFileSize } from '@/lib/api/admin'
import { useAdminDashboard, useDragAndDrop, useImagePreview, useAdminSettings } from '@/hooks/useAdminDashboard'
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
  RefreshCw,
  Languages
} from 'lucide-react'

const ImageUploadZone: React.FC<{
  onFileUpload: (files: FileList) => void
  maxFiles?: number
  allowedFormats?: string[]
  maxFileSize?: number
  language: Language
  isUploading?: boolean
}> = ({ onFileUpload, maxFiles = 10, allowedFormats = ['image/jpeg', 'image/png', 'image/webp'], maxFileSize = 5 * 1024 * 1024, language, isUploading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = translations[language]
  
  const { isDragOver, dragHandlers } = useDragAndDrop(onFileUpload)

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
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        {...dragHandlers}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-300 ${
          isDragOver ? 'text-primary' : 'text-muted-foreground'
        } ${isUploading ? 'animate-pulse' : ''}`} />
        <h3 className="text-lg font-semibold mb-2">
          {isUploading ? t.uploading || 'Uploading...' : t.uploadTitle}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isUploading ? t.uploadingDescription || 'Please wait...' : t.uploadDescription}
        </p>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{t.maxImages} {maxFiles} {t.images}</p>
          <p>{t.supportedFormats}</p>
          <p>{t.maxFileSize} {formatFileSize(maxFileSize)}</p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
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
  language: Language
}> = ({ image, onDelete, onUpdate, onPreview, language }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: image.title,
    description: image.description || '',
    alt: image.alt
  })
  const t = translations[language]

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
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={image.url}
          alt={image.alt}
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
            {image.isActive ? t.active : t.inactive}
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
                {t.title_label}
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
                {t.description_label}
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
                {t.altText}
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
                {t.save}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                {t.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-foreground mb-1">{image.title}</h3>
            {image.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {image.description}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{image.dimensions.width} × {image.dimensions.height}</span>
              <span>{formatFileSize(image.size)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t.order} {image.order}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdate(image.id, { isActive: !image.isActive })}
              >
                {image.isActive ? t.deactivate : t.activate}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

const ImagePreviewModal: React.FC<{
  image: CarouselImage | null
  isOpen: boolean
  onClose: () => void
  language: Language
}> = ({ image, isOpen, onClose, language }) => {
  const t = translations[language]
  
  if (!image) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{image.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={image.url}
            alt={image.alt}
            className="w-full max-h-96 object-contain rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>{t.dimensions}:</strong> {image.dimensions.width} × {image.dimensions.height}
            </div>
            <div>
              <strong>{t.fileSize}:</strong> {formatFileSize(image.size)}
            </div>
            <div>
              <strong>{t.uploadDate}:</strong> {image.uploadedAt.toLocaleDateString(language === 'de' ? 'de-DE' : 'sr-RS')}
            </div>
            <div>
              <strong>{t.status}:</strong> {image.isActive ? t.active : t.inactive}
            </div>
          </div>
          {image.description && (
            <div>
              <strong>{t.description}:</strong>
              <p className="mt-1 text-muted-foreground">{image.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Card className="p-6">
      <Skeleton className="w-full h-32" />
    </Card>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-2">
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-full h-3" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        </Card>
      ))}
    </div>
  </div>
)

const ErrorState: React.FC<{ onRetry?: () => void; language: Language }> = ({ onRetry, language }) => {
  const t = translations[language]
  
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800">
        {t.errorLoading}
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="ml-2"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            {t.retryButton}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

const EmptyState: React.FC<{ onUpload: () => void; language: Language }> = ({ onUpload, language }) => {
  const t = translations[language]
  
  return (
    <Card className="p-12 text-center">
      <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{t.noImagesTitle}</h3>
      <p className="text-muted-foreground mb-4">
        {t.noImagesDescription}
      </p>
      <Button onClick={onUpload}>
        <Plus className="w-4 h-4 mr-2" />
        {t.uploadImagesButton}
      </Button>
    </Card>
  )
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gallery')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const {
    images,
    isLoading,
    error,
    uploadProgress,
    isUploading,
    activeImages,
    inactiveImages,
    totalSize,
    loadImages,
    uploadImages,
    updateImage,
    deleteImage,
    reorderImages,
    clearError,
    retry
  } = useAdminDashboard()

  const { previewImage, isPreviewOpen, openPreview, closePreview } = useImagePreview()
  const { language, maxImages, maxFileSize, changeLanguage } = useAdminSettings()

  const t = translations[language]

  const handleFileUpload = (files: FileList) => {
    uploadImages(files)
  }

  const handleImageDelete = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      deleteImage(id)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState onRetry={retry} language={language} />
  }

  return (
    <div className="space-y-6 p-6 bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <Select value={language} onValueChange={(value: Language) => changeLanguage(value)}>
            <SelectTrigger className="w-32">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">{t.german}</SelectItem>
              <SelectItem value="sr">{t.serbian}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Plus className="w-4 h-4 mr-2" />
            {t.addImages}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
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
              <p className="text-sm text-muted-foreground">{t.totalImages}</p>
              <p className="text-2xl font-bold">{images.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.activeImages}</p>
              <p className="text-2xl font-bold">{activeImages.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.storageUsed}</p>
              <p className="text-2xl font-bold">{(totalSize / 1024 / 1024).toFixed(1)}MB</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.availableSlots}</p>
              <p className="text-2xl font-bold">{maxImages - images.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Alert className="border-blue-200 bg-blue-50">
          <Upload className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            {t.upload} {uploadProgress}%...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearError}
              className="ml-2"
            >
              <X className="w-4 h-4 mr-1" />
              {t.dismiss || 'Dismiss'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            {t.gallery}
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {t.upload}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {t.preview}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          {images.length === 0 ? (
            <EmptyState onUpload={() => setActiveTab('upload')} language={language} />
          ) : (
            <div className="space-y-6">
              {/* Active Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t.activeImagesTitle} ({activeImages.length})</h2>
                  <Badge variant="default">{t.visibleInCarousel}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {activeImages.map(image => (
                    <ImageCard
                      key={image.id}
                      image={image}
                      onDelete={handleImageDelete}
                      onUpdate={updateImage}
                      onPreview={openPreview}
                      language={language}
                    />
                  ))}
                </div>
              </div>

              {/* Inactive Images */}
              {inactiveImages.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{t.inactiveImagesTitle} ({inactiveImages.length})</h2>
                    <Badge variant="secondary">{t.hiddenFromCarousel}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inactiveImages.map(image => (
                      <ImageCard
                        key={image.id}
                        image={image}
                        onDelete={handleImageDelete}
                        onUpdate={updateImage}
                        onPreview={openPreview}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <ImageUploadZone
            onFileUpload={handleFileUpload}
            maxFiles={maxImages}
            allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
            maxFileSize={maxFileSize}
            language={language}
            isUploading={isUploading}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t.carouselPreviewTitle}</h2>
            <p className="text-muted-foreground mb-4">
              {t.carouselPreviewDescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeImages.slice(0, 6).map(image => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{t.order} {image.order}</span>
                  </div>
                </div>
              ))}
            </div>
            {activeImages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {t.noActiveImagesPreview}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        image={previewImage}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        language={language}
      />
    </div>
  )
}

export default AdminDashboard
