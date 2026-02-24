import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secretariatService } from '../api/secretariats.service';

// Key for caching
export const SECRETARIATS_KEYS = {
    all: ['secretariats'],
    lists: () => [...SECRETARIATS_KEYS.all, 'list'],
    publicLists: () => [...SECRETARIATS_KEYS.all, 'public-list'],
    detail: (id) => [...SECRETARIATS_KEYS.all, 'detail', id],
    publicDetail: (id) => [...SECRETARIATS_KEYS.all, 'public-detail', id],
};

// ─── Public Hooks ───────────────────────────────────────────

// Hook for fetching all secretariats (public)
export const usePublicSecretariats = () => {
    return useQuery({
        queryKey: SECRETARIATS_KEYS.publicLists(),
        queryFn: () => secretariatService.getPublicAll(),
        staleTime: 0,
    });
};

// Hook for fetching a single secretariat by id (public)
export const usePublicSecretariat = (id) => {
    return useQuery({
        queryKey: SECRETARIATS_KEYS.publicDetail(id),
        queryFn: () => secretariatService.getPublicById(id),
        enabled: !!id && id !== '0' && id !== 'new',
        staleTime: 0,
    });
};

// ─── Admin Hooks ────────────────────────────────────────────

// Hook for fetching all secretariats (admin dashboard)
export const useSecretariats = () => {
    return useQuery({
        queryKey: SECRETARIATS_KEYS.lists(),
        queryFn: () => secretariatService.getAll(),
        staleTime: 0,
    });
};

// Hook for fetching a secretariat by id (admin)
export const useSecretariat = (id) => {
    return useQuery({
        queryKey: SECRETARIATS_KEYS.detail(id),
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
            queryClient.invalidateQueries(SECRETARIATS_KEYS.publicLists());
        },
    });
};

// Hook to UPDATE a secretariat
export const useUpdateSecretariat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data }) => secretariatService.update(data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(SECRETARIATS_KEYS.lists());
            queryClient.invalidateQueries(SECRETARIATS_KEYS.publicLists());
            queryClient.invalidateQueries(SECRETARIATS_KEYS.detail(variables.id));
            queryClient.invalidateQueries(SECRETARIATS_KEYS.publicDetail(variables.id));
        },
    });
};

// Hook to DELETE a secretariat
export const useDeleteSecretariat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => secretariatService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(SECRETARIATS_KEYS.lists());
            queryClient.invalidateQueries(SECRETARIATS_KEYS.publicLists());
        },
    });
};
