import { useQuery } from '@tanstack/react-query';
import { monitoringService } from '../api/monitoring.service';

export const useMonitoring = () => {
    return useQuery({
        queryKey: ['monitoring-dashboard'],
        queryFn: async () => {
            const [overview, system, app] = await Promise.all([
                monitoringService.getOverview(),
                monitoringService.getSystem(),
                monitoringService.getApp(),
            ]);

            return {
                overview,
                system,
                app
            };
        },
        refetchInterval: 30000,
        staleTime: 10000, 
    });
};