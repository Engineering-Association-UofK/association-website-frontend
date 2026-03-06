import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imageStorageService } from '../api/imageStorage.service';

// Key for caching
export const IMAGE_STORAGE_KEYS = {
  all: ['image storage items'],
  lists: () => [...IMAGE_STORAGE_KEYS.all, 'list'],
  detail: (id) => [...IMAGE_STORAGE_KEYS.all, 'detail', id],
};

// Hook for fetching all image storage items
export const useImageStorageItems = () => {
  return useQuery({
    queryKey: IMAGE_STORAGE_KEYS.lists(),
    queryFn: () => imageStorageService.getAll(),

    staleTime: 0, 
  });
};

// // Hook for fetching a single gallery image by keyword
// export const useGalleryImage = (keyword) => {
//   return useQuery({
//     queryKey: ['gallery', 'keyword', keyword],
//     queryFn: () => galleryService.getByKeyword(keyword),
//     enabled: !!keyword,
//     staleTime: 1000 * 60 * 60, // 1 hour cache
//   });
// };

// Hook to CREATE a image storage item
export const useCreateImageStorageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imageStorageService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(IMAGE_STORAGE_KEYS.lists());
    },
  });
};

// Hook to PUBLISH an image to news
export const usePublishToNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imageStorageService.publish,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      // queryClient.invalidateQueries(IMAGE_STORAGE_KEYS.lists());
      queryClient.invalidateQueries(['image storage items', 'list']);
    },
  });
};

// // Hook to UPDATE a gallery item (made for keyword-based updates)
// export const useUpdateGalleryImage = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: galleryService.update,
//     onSuccess: (data, variables) => {
//       // Invalidate the specific keyword query
//       queryClient.invalidateQueries(['gallery', 'keyword', variables.keyword]);
//       // Also invalidate list just in case
//       queryClient.invalidateQueries(IMAGE_STORAGE_KEYS.lists());
//     },
//   });
// };

// Hook to DELETE a image storage item
export const useDeleteImageStorageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => imageStorageService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['image storage items', 'list']);
    },
  });
};

// Hook to DELETE all unused image storage items
export const useClearUnused = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: imageStorageService.clear,
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['image storage items', 'list']);
    },
  });
};

export const useUnpublishFromNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => imageStorageService.unpublish(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['image storage items', 'list']);
    },
  });
};