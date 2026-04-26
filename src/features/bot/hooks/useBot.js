import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { botService } from '../api/bot.service';

export const useBot = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ sessionId, keyword, input, language }) => 
      botService.interact(sessionId, keyword, input, language),
    onSuccess: (data) => {
      if (data.metadata) {
        const { action_text, is_internal } = data.metadata;

        // Give the user 1.5s to read the "Tour Guide" message 
        // before the view shifts
        setTimeout(() => {
          if (is_internal) {
            // Internal move: No page reload, bot stays mounted
            navigate(action_text); 
          } else {
            // External move: Open in a new tab
            window.open(action_text, '_blank');
          }
        }, 1500);
      }
    }
  });
};

export const useGoBack = () => {
  return useMutation({
    mutationFn: ({ sessionId, keyword, input, language }) =>
      botService.goBack(sessionId, keyword, input, language),
  });
};