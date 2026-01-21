import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../api/blogs.service';

// Key for caching
export const BLOGS_KEYS = {
  all: ['blogs'],
  lists: () => [...BLOGS_KEYS.all, 'list'],
  detail: (id) => [...BLOGS_KEYS.all, 'detail', id],
};

// Hook for fetching all blogs
export const useBlogs = () => {
  return useQuery({
    queryKey: BLOGS_KEYS.lists(),
    queryFn: () => blogService.getAll(),

    staleTime: 0, 
  });
};

// Hook for fetching a blog by id
export const useBlog = (id) => {
  return useQuery({
    queryKey: ['blogs', 'detail', id],
    queryFn: () => blogService.getById(id),
    
    enabled: !!id && id !== '0' && id !== 'new', 
    staleTime: 0,
  });
};

// Hook to CREATE a blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(BLOGS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => blogService.update(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(['blogs', 'list']);
      // Refresh the specific blog details
      queryClient.invalidateQueries(['blogs', 'detail', variables.id]);
    },
  });
};

// Hook to DELETE a blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => blogService.delete(id),
    onSuccess: () => {
      // 1. Refresh the list automatically
      queryClient.invalidateQueries(['blogs', 'list']);
    },
  });
};