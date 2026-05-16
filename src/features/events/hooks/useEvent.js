import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../api/event.service';

// Open endpoints

export const useEvents = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['events', page],
        queryFn: () => eventService.getEvents(page, limit),
    });
}

export const useEvent = (id) => {
    return useQuery({
        queryKey: ['event', id],
        queryFn: () => eventService.getEvent(id),
        enabled: !!id,
    });
}

// Application endpoints

export const useGetStatus = (page = 1, limit = 10, eventID = 0) => {
    return useQuery({
        queryKey: ['status', page, eventID],
        queryFn: () => eventService.getStatus(page, limit, eventID),
        enabled: !!eventID,
    });
}

export const useCancelApplication = (id) => {
    return useMutation({
        mutationFn: (id) => eventService.cancel(id),
    });
}

export const useApply = (id, eventID = 0) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eventService.apply(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['status']);
        }
    });
}

// Admin endpoints

export const useGetParticipants = (id) => {
    return useQuery({
        queryKey: ['participants'],
        queryFn: () => eventService.getEventParticipants(id),
        refetchOnWindowFocus: false,
    });
}

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => eventService.create(data),
        onSuccess: () => queryClient.invalidateQueries(['events']),
    });
}

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => eventService.update(data),
        onSuccess: () => queryClient.invalidateQueries(['events']),
    });
}

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => eventService.delete(id),
        onSuccess: () => queryClient.invalidateQueries(['events']),
    });
}

export const useGenerateCerts = () => {
    return useMutation({
        mutationFn: (data) => eventService.generateCerts(data),
    });
}

export const useSendFinishEmails = () => {
    return useMutation({
        mutationFn: (data) => eventService.sendFinishEmails(data),
    });
}
export const useSendEmails = () => {
    return useMutation({
        mutationFn: (data) => eventService.sendEmails(data),
    });
}