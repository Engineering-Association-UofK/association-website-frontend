import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { botCommandService } from '../api/botCommands.service';

// Key for caching
export const BOT_COMMANDS_KEYS = {
  all: ['botCommands'],
  lists: () => [...BOT_COMMANDS_KEYS.all, 'list'],
  detail: (id) => [...BOT_COMMANDS_KEYS.all, 'detail', id],
};

// Hook for fetching all bot commands
export const useBotCommands = () => {
  return useQuery({
    queryKey: BOT_COMMANDS_KEYS.lists(),
    queryFn: () => botCommandService.getAll(),

    staleTime: 0, 
  });
};

// Hook for fetching a bot command by id
export const useBotCommand = (id) => {
  return useQuery({
    queryKey: ['botCommands', 'detail', id],
    queryFn: () => botCommandService.getById(id),
    
    enabled: !!id && id !== '0' && id !== 'new', 
    staleTime: 0,
  });
};

// Hook to CREATE a bot command
export const useCreateBotCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: botCommandService.create,
    onSuccess: () => {
      // Invalidates cache so the list updates automatically without a refresh
      queryClient.invalidateQueries(BOT_COMMANDS_KEYS.lists());
    },
  });
};

// Hook to UPDATE a bot command
export const useUpdateBotCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({data}) => botCommandService.update(data),
    onSuccess: (data, variables) => {
      // Refresh the list
      queryClient.invalidateQueries(['botCommands', 'list']);
      // Refresh the specific bot command details
      queryClient.invalidateQueries(['botCommands', 'detail', variables.id]);
    },
  });
};

// Hook to DELETE a bot command
export const useDeleteBotCommand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => botCommandService.delete(id),
    onSuccess: () => {
      // Refresh the list automatically
      queryClient.invalidateQueries(['botCommands', 'list']);
    },
  });
};