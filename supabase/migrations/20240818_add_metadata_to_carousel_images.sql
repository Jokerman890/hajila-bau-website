-- Add metadata column to carousel_images table
ALTER TABLE public.carousel_images 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update RLS policy to include metadata
COMMENT ON COLUMN public.carousel_images.metadata IS 'Additional metadata for carousel images (e.g., alt text, captions, links)';

-- Create GIN index for metadata JSONB column for better query performance
CREATE INDEX IF NOT EXISTS idx_carousel_images_metadata ON public.carousel_images USING GIN (metadata);

-- Update existing rows with default metadata if needed
UPDATE public.carousel_images 
SET metadata = jsonb_build_object(
  'alt', COALESCE(metadata->>'alt', ''),
  'title', COALESCE(metadata->>'title', filename),
  'caption', COALESCE(metadata->>'caption', ''),
  'is_active', COALESCE((metadata->'is_active')::boolean, true),
  'target_url', COALESCE(metadata->>'target_url', '')
)
WHERE metadata IS NULL OR jsonb_typeof(metadata) = 'null';

-- Create or replace function for reordering carousel images
CREATE OR REPLACE FUNCTION public.reorder_carousel_images(
  image_ids uuid[],
  metadata_updates jsonb DEFAULT '{}'::jsonb
) 
RETURNS SETOF carousel_images
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  i integer;
  img_id uuid;
  img_record carousel_images%ROWTYPE;
  updated_images carousel_images[] := '{}';
BEGIN
  -- Begin transaction
  BEGIN
    -- Update order_index and metadata for each image
    FOR i IN 1..array_length(image_ids, 1) LOOP
      img_id := image_ids[i];
      
      -- Update the image with new order and metadata
      UPDATE carousel_images
      SET 
        order_index = i,
        metadata = COALESCE(metadata, '{}'::jsonb) || 
                   jsonb_build_object(
                     'alt', COALESCE(metadata_updates->>'alt', COALESCE(metadata->>'alt', '')),
                     'title', COALESCE(metadata_updates->>'title', COALESCE(metadata->>'title', filename)),
                     'caption', COALESCE(metadata_updates->>'caption', COALESCE(metadata->>'caption', '')),
                     'is_active', COALESCE((metadata_updates->'is_active')::boolean, COALESCE((metadata->'is_active')::boolean, true)),
                     'target_url', COALESCE(metadata_updates->>'target_url', COALESCE(metadata->>'target_url', ''))
                   )
      WHERE id = img_id
      RETURNING * INTO img_record;
      
      -- Add to results if update was successful
      IF FOUND THEN
        updated_images := array_append(updated_images, img_record);
      END IF;
    END LOOP;
    
    -- Return all updated images in the new order
    RETURN QUERY SELECT * FROM unnest(updated_images) ORDER BY order_index;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error
    RAISE WARNING 'Error in reorder_carousel_images: %', SQLERRM;
    -- Re-raise the exception
    RAISE;
  END;
  
  RETURN;
END;
$$;
