import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genericsService } from '../api/generics.service';
import { useLanguage } from '../../../context/LanguageContext';

export const useGenerics = (keywords) => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['generics', language, ...keywords],
    queryFn: async () => {
      const response = await genericsService.fetchByKeywords({ keywords, lang: language });

      // Transform array to object for easy access
      if (Array.isArray(response)) {
          return response.reduce((acc, item) => {
            acc[item.keyword] = item;
            return acc;
          }, {});
      }
      return {};
    },
    enabled: !!keywords && keywords.length > 0,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateGeneric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: genericsService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generics'] });
    },
  });
};