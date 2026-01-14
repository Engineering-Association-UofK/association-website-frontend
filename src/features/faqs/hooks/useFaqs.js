import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqService } from '../api/faqs.service';

// Key for caching
export const FAQS_KEYS = {
  all: ['faqs'],
  lists: () => [...FAQS_KEYS.all, 'list'],
  detail: (id) => [...FAQS_KEYS.all, 'detail', id],
};

// Hook for fetching all faqs
export const useFaqs = (queryParams) => {
  return useQuery({
    queryKey: FAQS_KEYS.lists(),
    queryFn: () => faqService.getAll(queryParams),

    staleTime: 0, 
  });
};

// Hook for fetching a faq by id
export const useFaq = (id, queryParams) => {
  return useQuery({
    queryKey: ['faqs', 'detail', id],
    queryFn: () => faqService.getById(id, queryParams),

    enabled: !!id && id !== '0' && id !== 'new', 
    staleTime: 0,
  });
};

// Hook to CREATE a faq
export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: faqService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(FAQS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a faq
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => faqService.update(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(['faqs', 'list']);
      // Refresh the specific faq details
      queryClient.invalidateQueries(['faqs', 'detail', variables.id]);
    },
  });
};

// Hook to DELETE a faq
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => faqService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['faqs', 'list']);
    },
  });
};