import { useQuery } from '@tanstack/react-query';
import { teamService } from '../api/team.service.js';

export const useTeam = () => {
    return useQuery({
        queryKey: ['team'],
        queryFn: () => teamService.getAll(),
    });
};