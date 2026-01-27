import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '../api/adminUsers.service';

// Key for caching
export const ADMIN_USERS_KEYS = {
  all: ['adminUsers'],
  lists: () => [...ADMIN_USERS_KEYS.all, 'list'],
  detail: (id) => [...ADMIN_USERS_KEYS.all, 'detail', id],
};

// Hook for fetching all admin users
export const useAdminUsers = () => {
  return useQuery({
    queryKey: ADMIN_USERS_KEYS.lists(),
    queryFn: () => adminUsersService.getAll(),

    staleTime: 0, 
  });
};

// Hook for fetching a admin user by id
export const useAdminUser = (id) => {
  return useQuery({
    queryKey: ['adminUsers', 'detail', id],
    queryFn: () => adminUsersService.getById(id),

    enabled: !!id && id !== '0' && id !== 'new', 
    staleTime: 0,
  });
};

// Hook to CREATE a admin user
export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminUsersService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(ADMIN_USERS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a admin user
export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => adminUsersService.update(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(['adminUsers', 'list']);
      // Refresh the specific admin user details
      queryClient.invalidateQueries(['adminUsers', 'detail', variables.id]);
    },
  });
};

// Hook to DELETE a admin user
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => adminUsersService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['adminUsers', 'list']);
    },
  });
};