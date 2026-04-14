import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secretariatService } from '../api/secretariats.service';

// Key for caching
export const SECRETARIATS_KEYS = {
    all: ['secretariats'],
    lists: () => [...SECRETARIATS_KEYS.all, 'list'],
    detail: (id) => [...SECRETARIATS_KEYS.all, 'detail', id],
};

// Hook for fetching all secretariats
export const useSecretariats = () => {
    return useQuery({
        queryKey: SECRETARIATS_KEYS.lists(),
        queryFn: () => secretariatService.getAll(),
        staleTime: 0,
    });
};

// Hook for fetching a secretariat by id
export const useSecretariat = (id) => {
    return useQuery({
        queryKey: ['secretariats', 'detail', id],
        queryFn: () => secretariatService.getById(id),
        enabled: !!id && id !== '0' && id !== 'new',
        staleTime: 0,
    });
};

// Hook to CREATE a secretariat
export const useCreateSecretariat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: secretariatService.create,
        onSuccess: () => {
            queryClient.invalidateQueries(SECRETARIATS_KEYS.lists());
        },
    });
};

// Hook to UPDATE a secretariat
export const useUpdateSecretariat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data }) => secretariatService.update(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['secretariats', 'list']);
            queryClient.invalidateQueries(['secretariats', 'detail', variables.id]);
        },
    });
};

// Hook to DELETE a secretariat
export const useDeleteSecretariat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => secretariatService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['secretariats', 'list']);
        },
    });
};
