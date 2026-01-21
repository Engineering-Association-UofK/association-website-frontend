import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryService } from '../api/gallery.service';

// Key for caching
export const GALLERY_KEYS = {
  all: ['gallery items'],
  lists: () => [...GALLERY_KEYS.all, 'list'],
  detail: (id) => [...GALLERY_KEYS.all, 'detail', id],
};

// Hook for fetching all gallery items
export const useGalleryItems = () => {
  return useQuery({
    queryKey: GALLERY_KEYS.lists(),
    queryFn: () => galleryService.getAll(),

    staleTime: 0, 
  });
};

// Hook to CREATE a gallery item
export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: galleryService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(GALLERY_KEYS.lists());
    },
  });
};


// Hook to DELETE a gallery item
export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => galleryService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['gallery items', 'list']);
    },
  });
};