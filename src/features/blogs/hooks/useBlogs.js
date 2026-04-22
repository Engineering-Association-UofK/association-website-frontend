import { useQuery } from '@tanstack/react-query';
import { cmsBlogsService } from '../api/blogs.service';

export const useCmsBlogs = (type, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['cms-blogs', type, page, limit],
    queryFn: () => cmsBlogsService.getByType(type, page, limit),
    staleTime: 5 * 60 * 1000,
  });
};