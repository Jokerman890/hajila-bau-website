// TypeScript interfaces for Supabase Photo Storage

export interface PhotoMetadata {
  id: string
  userId: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  path: string
  uploadedAt: Date
  signedUrl?: string
  expiresAt?: Date
}

export interface UploadOptions {
  userId: string
  file: File
  maxSize?: number
  generateSignedUrl?: boolean
  signedUrlExpiresIn?: number
}

export interface UploadResult {
  success: boolean
  data?: {
    path: string
    signedUrl?: string
    metadata: PhotoMetadata
  }
  error?: string
}

export interface BucketInfo {
  name: string
  id: string
  owner: string
  public: boolean
  created_at: string
  updated_at: string
}

export interface StorageError {
  message: string
  statusCode?: number
  error?: string
}

export interface SignedUrlOptions {
  expiresIn?: number
  transform?: {
    width?: number
    height?: number
    quality?: number
  }
}

export interface DeleteResult {
  success: boolean
  deletedPaths?: string[]
  error?: string
}

// RLS Policy types
export interface RLSPolicy {
  id: string
  name: string
  table_name: string
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  definition: string
  check?: string
}

export interface BucketPolicy {
  bucket_name: string
  policy_name: string
  definition: string
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
}

export interface SignedUrlResult {
  success: boolean
  signedUrl?: string
  error?: string
}

export interface ListResult {
  success: boolean
  photos?: PhotoMetadata[]
  error?: string
}

export interface StorageInitResult {
  success: boolean
  bucketCreated?: boolean
  policiesSet?: boolean
  error?: string
}
